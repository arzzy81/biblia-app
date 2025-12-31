// src/utils/bibleApi.ts

export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

let cachedBible: BibleBook[] | null = null;

/**
 * Normaliza o texto para comparação:
 * - Remove acentos
 * - Converte para minúsculas
 * - Remove espaços extras
 * Ex: "2 Coríntios" -> "2corintios"
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "") // Remove todos os espaços
    .trim();
}

/**
 * Carrega o JSON da Bíblia (cache em memória para não baixar várias vezes)
 */
async function loadBible(): Promise<BibleBook[]> {
  if (cachedBible) return cachedBible;

  try {
    const res = await fetch("/nvi.json");
    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }
    const data = await res.json();
    cachedBible = data;
    return data;
  } catch (error) {
    console.error("Erro ao carregar nvi.json:", error);
    throw new Error("Falha ao carregar a Bíblia.");
  }
}

/**
 * Mapa manual para garantir que nomes complexos encontrem suas abreviações
 * caso a busca direta pelo nome falhe.
 */
const abbreviationMap: Record<string, string> = {
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

/**
 * Encontra o livro correto no array, tentando por:
 * 1. Nome exato
 * 2. Abreviação exata
 * 3. Nome normalizado (sem acento/espaço)
 * 4. Mapeamento manual
 */
function findBook(bible: BibleBook[], search: string): BibleBook | null {
  const target = normalize(search);

  return bible.find((book) => {
    const bookNameNorm = normalize(book.name);
    const bookAbbrevNorm = normalize(book.abbrev);

    // Verifica se bate com o nome, com a abreviação, ou usa o mapa de segurança
    return (
      bookNameNorm === target ||
      bookAbbrevNorm === target ||
      bookAbbrevNorm === abbreviationMap[target]
    );
  }) || null;
}

/**
 * Função principal exportada para o componente
 */
export async function fetchBibleChapter(
  bookName: string,
  chapter: number
): Promise<string> {
  const bible = await loadBible();
  
  const book = findBook(bible, bookName);

  if (!book) {
    // Log para ajudar a debugar caso ainda falhe
    console.warn(`Livro não encontrado para a busca: "${bookName}" (Normalizado: "${normalize(bookName)}")`);
    throw new Error(`Livro não encontrado: ${bookName}`);
  }

  // Garante que o capítulo é válido
  if (chapter < 1 || chapter > book.chapters.length) {
    throw new Error(`Capítulo ${chapter} não existe em ${book.name}`);
  }

  // Pega o array de versículos (índice é chapter - 1)
  const verses = book.chapters[chapter - 1];

  // Retorna formatado como string única
  return verses.map((text, index) => `${index + 1}. ${text}`).join("\n");
}
