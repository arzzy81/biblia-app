// src/utils/bibleApi.ts

// Definição da estrutura do Livro baseada no seu JSON
export interface BibleBook {
  abbrev: string;
  name?: string; // Opcional, pois você disse que nem sempre existe
  chapters: string[][];
}

let cachedBible: BibleBook[] | null = null;

/**
 * Normaliza textos para comparação:
 * "2 Coríntios" -> "2corintios"
 * "Gálatas" -> "galatas"
 */
function normalize(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]/g, "");      // Remove TUDO que não for letra ou número
}

/**
 * Mapa manual para garantir conversão de Nomes -> Abreviações do JSON (nvi.json)
 */
const bookMap: Record<string, string> = {
  // Velho Testamento
  "genesis": "gn", "exodo": "ex", "levitico": "lv", "numeros": "nm", "deuteronomio": "dt",
  "josue": "js", "juizes": "jz", "rute": "rt",
  "1samuel": "1sm", "isamuel": "1sm", "1osamuel": "1sm",
  "2samuel": "2sm", "iisamuel": "2sm", "2osamuel": "2sm",
  "1reis": "1re", "ireis": "1re", "1oreis": "1re",
  "2reis": "2re", "iireis": "2re", "2oreis": "2re",
  "1cronicas": "1cr", "icronicas": "1cr",
  "2cronicas": "2cr", "iicronicas": "2cr",
  "esdras": "ez", "neemias": "ne", "ester": "et", "jo": "jo", "salmos": "sl",
  "proverbios": "pv", "eclesiastes": "ec", "canticos": "ct", "isaias": "is",
  "jeremias": "jr", "lamentacoes": "lm", "ezequiel": "ez", "daniel": "dn",
  "oseias": "os", "joel": "jl", "amos": "am", "obadias": "ob", "jonas": "jn",
  "miqueias": "mq", "naum": "na", "habacuque": "hc", "sofonias": "sf",
  "ageu": "ag", "zacarias": "zc", "malaquias": "ml",
  // Novo Testamento
  "mateus": "mt", "marcos": "mc", "lucas": "lc", "joao": "jo", "atos": "at", "romanos": "rm",
  "1corintios": "1co", "icorintios": "1co",
  "2corintios": "2co", "iicorintios": "2co",
  "galatas": "gl", "efesios": "ef", "filipenses": "fp", "colossenses": "cl",
  "1tessalonicenses": "1ts", "itessalonicenses": "1ts",
  "2tessalonicenses": "2ts", "iitessalonicenses": "2ts",
  "1timoteo": "1tm", "itimoteo": "1tm",
  "2timoteo": "2tm", "iitimoteo": "2tm",
  "tito": "tt", "filemom": "fm", "hebreus": "hb", "tiago": "tg",
  "1pedro": "1pe", "ipedro": "1pe",
  "2pedro": "2pe", "iipedro": "2pe",
  "1joao": "1jo", "ijoao": "1jo",
  "2joao": "2jo", "iijoao": "2jo",
  "3joao": "3jo", "iiijoao": "3jo",
  "judas": "jd", "apocalipse": "ap"
};

/**
 * Carrega o JSON da Bíblia
 */
async function loadBible(): Promise<BibleBook[]> {
  if (cachedBible) return cachedBible;

  try {
    // Adiciona timestamp para evitar cache antigo do navegador
    const res = await fetch(`/nvi.json?v=${Date.now()}`);
    if (!res.ok) {
      console.error("Erro HTTP ao baixar nvi.json:", res.status);
      throw new Error(`Erro ao carregar Bíblia (HTTP ${res.status})`);
    }
    const data = await res.json();
    
    // Verificação de segurança básica
    if (!Array.isArray(data) || data.length === 0) {
      console.error("JSON recebido não é um array válido ou está vazio:", data);
      throw new Error("Arquivo nvi.json inválido.");
    }
    
    console.log(`[BibleApi] Sucesso! ${data.length} livros carregados do nvi.json.`);
    cachedBible = data;
    return data;
  } catch (err) {
    console.error("FALHA FATAL no loadBible:", err);
    throw err;
  }
}

/**
 * Tenta encontrar o livro usando várias estratégias
 */
function findBook(bible: BibleBook[], searchName: string): BibleBook | null {
  const normalizedSearch = normalize(searchName);
  
  // 1. Tenta pegar a abreviação do nosso mapa manual
  // Ex: "2 Coríntios" virou "2corintios" -> map["2corintios"] -> "2co"
  const targetAbbrev = bookMap[normalizedSearch];

  console.log(`[BibleApi] Buscando: "${searchName}" | Normalizado: "${normalizedSearch}" | Alvo Abreviação: "${targetAbbrev || 'não achou no mapa'}"`);

  // 2. Busca no JSON
  const found = bible.find(book => {
    const bookAbbrev = normalize(book.abbrev);
    const bookName = book.name ? normalize(book.name) : "";

    // Estratégia A: Bate com a abreviação do mapa (ex: "gl")
    if (targetAbbrev && bookAbbrev === targetAbbrev) return true;

    // Estratégia B: Bate direto com a abreviação (ex: busca "gl" e json tem "gl")
    if (bookAbbrev === normalizedSearch) return true;

    // Estratégia C: Bate com o nome (se existir "name" no json)
    if (bookName && bookName === normalizedSearch) return true;

    return false;
  });

  return found || null;
}

/**
 * Função principal chamada pelo componente
 */
export async function fetchBibleChapter(
  bookName: string,
  chapter: number
): Promise<string> {
  const bible = await loadBible();
  const book = findBook(bible, bookName);

  if (!book) {
    console.error(`[BibleApi] ERRO: Livro "${bookName}" não encontrado.`);
    console.log("Dica: Verifique se o nvi.json tem o campo 'abbrev' correto.");
    throw new Error(`Livro não encontrado: ${bookName}`);
  }

  // Validação do capítulo
  if (chapter < 1 || chapter > book.chapters.length) {
    console.error(`[BibleApi] ERRO: Livro ${book.abbrev} tem ${book.chapters.length} capítulos. Tentou acessar: ${chapter}`);
    throw new Error(`Capítulo ${chapter} não existe.`);
  }

  // Pega o conteúdo (array de versículos)
  const verses = book.chapters[chapter - 1];

  if (!verses || !Array.isArray(verses)) {
    throw new Error(`Erro na estrutura do capítulo ${chapter} de ${bookName}`);
  }

  // Formata para string
  return verses.map((text, index) => `${index + 1}. ${text}`).join("\n");
}
