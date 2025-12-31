// src/utils/bibleApi.ts

export interface BibleBook {
  abbrev: string;
  name?: string;
  chapters: string[][];
}

let cachedBible: BibleBook[] | null = null;

// Função simples de limpeza de texto
function normalize(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD") // Separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]/g, "") // Remove tudo que não é letra ou número (espaços, traços)
    .trim();
}

// Mapa manual de Nomes -> Abreviações
const manualMap: Record<string, string> = {
  "genesis": "gn", "exodo": "ex", "levitico": "lv", "numeros": "nm", "deuteronomio": "dt",
  "josue": "js", "juizes": "jz", "rute": "rt", "1samuel": "1sm", "2samuel": "2sm",
  "1reis": "1re", "2reis": "2re", "1cronicas": "1cr", "2cronicas": "2cr",
  "esdras": "ez", "neemias": "ne", "ester": "et", "jo": "jo", "salmos": "sl",
  "proverbios": "pv", "eclesiastes": "ec", "canticos": "ct", "isaias": "is",
  "jeremias": "jr", "lamentacoes": "lm", "ezequiel": "ez", "daniel": "dn",
  "oseias": "os", "joel": "jl", "amos": "am", "obadias": "ob", "jonas": "jn",
  "miqueias": "mq", "naum": "na", "habacuque": "hc", "sofonias": "sf",
  "ageu": "ag", "zacarias": "zc", "malaquias": "ml", "mateus": "mt",
  "marcos": "mc", "lucas": "lc", "joao": "jo", "atos": "at", "romanos": "rm",
  "1corintios": "1co", "2corintios": "2co", "galatas": "gl", "efesios": "ef",
  "filipenses": "fp", "colossenses": "cl", "1tessalonicenses": "1ts", "2tessalonicenses": "2ts",
  "1timoteo": "1tm", "2timoteo": "2tm", "tito": "tt", "filemom": "fm", "hebreus": "hb",
  "tiago": "tg", "1pedro": "1pe", "2pedro": "2pe", "1joao": "1jo", "2joao": "2jo",
  "3joao": "3jo", "judas": "jd", "apocalipse": "ap"
};

async function loadBible(): Promise<BibleBook[]> {
  if (cachedBible) return cachedBible;

  // Adicionei um timestamp ?t=... para garantir que o navegador não pegue versão velha
  const res = await fetch(`/nvi.json?t=${Date.now()}`);
  if (!res.ok) {
    throw new Error(`ERRO FATAL: Não consegui baixar o nvi.json. Status: ${res.status}`);
  }
  const data = await res.json();
  
  if (!Array.isArray(data)) {
    throw new Error("ERRO FATAL: O arquivo nvi.json não é uma lista (array).");
  }
  
  cachedBible = data;
  return data;
}

export async function fetchBibleChapter(
  bookName: string,
  chapter: number
): Promise<string> {
  const bible = await loadBible();

  // PREPARAÇÃO DOS DADOS
  const inputOriginal = bookName; // Ex: "2 Coríntios"
  const inputNormalizado = normalize(bookName); // Ex: "2corintios"
  const abbrevDoMapa = manualMap[inputNormalizado]; // Ex: "2co"

  // BUSCA
  const book = bible.find((b) => {
    const bAbbrev = normalize(b.abbrev);
    const bName = b.name ? normalize(b.name) : "";

    // 1. Tenta bater com a abreviação do mapa (ex: json "2co" == mapa "2co")
    if (abbrevDoMapa && bAbbrev === abbrevDoMapa) return true;
    
    // 2. Tenta bater o nome direto (ex: json "2corintios" == busca "2corintios")
    if (bName === inputNormalizado) return true;

    // 3. Tenta bater abreviação direta (ex: busca "gl" == json "gl")
    if (bAbbrev === inputNormalizado) return true;

    return false;
  });

  // SE NÃO ACHOU, GERA UM ERRO DETALHADO NA TELA
  if (!book) {
    // Vamos listar as primeiras 5 abreviações que existem no JSON para ver se ele carregou algo
    const debugList = bible.slice(0, 5).map(b => b.abbrev).join(", ");
    
    throw new Error(
      `DEBUG ERRO: Não achei o livro. \n` +
      `Busquei por: "${inputOriginal}" \n` +
      `Normalizado: "${inputNormalizado}" \n` +
      `Mapa achou abrev: "${abbrevDoMapa || 'Nenhuma'}" \n` +
      `No JSON existem ${bible.length} livros. Primeiros 5: [${debugList}...]`
    );
  }

  // Se achou o livro, verifica o capítulo
  if (chapter < 1 || chapter > book.chapters.length) {
    throw new Error(
      `Capítulo inválido. O livro ${book.name || book.abbrev} tem ${book.chapters.length} caps. Você pediu: ${chapter}`
    );
  }

  const verses = book.chapters[chapter - 1];
  
  // Verifica se verses existe e é array
  if (!verses || !Array.isArray(verses)) {
     // Às vezes o JSON tem capítulos vazios ou nulos
     return "Conteúdo deste capítulo indisponível.";
  }

  return verses.map((v, i) => `${i + 1}. ${v}`).join("\n");
}
