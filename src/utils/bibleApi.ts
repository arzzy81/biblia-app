// src/utils/bibleApi.ts

type BibleBook = {
  abbrev: string;
  chapters: string[][];
};

let cachedBible: BibleBook[] | null = null;

// Mapa FIXO pt-BR → abbrev do JSON
const BOOK_ABBREV_MAP: Record<string, string> = {
  "Gênesis": "gn",
  "Êxodo": "ex",
  "Levítico": "lv",
  "Números": "nm",
  "Deuteronômio": "dt",
  "Josué": "js",
  "Juízes": "jz",
  "Rute": "rt",
  "1 Samuel": "1sm",
  "2 Samuel": "2sm",
  "1 Reis": "1rs",
  "2 Reis": "2rs",
  "1 Crônicas": "1cr",
  "2 Crônicas": "2cr",
  "Esdras": "ed",
  "Neemias": "ne",
  "Ester": "et",
  "Jó": "job",
  "Salmos": "sl",
  "Provérbios": "pv",
  "Eclesiastes": "ec",
  "Cânticos": "ct",
  "Isaías": "is",
  "Jeremias": "jr",
  "Lamentações": "lm",
  "Ezequiel": "ez",
  "Daniel": "dn",
  "Oséias": "os",
  "Joel": "jl",
  "Amós": "am",
  "Obadias": "ob",
  "Jonas": "jn",
  "Miquéias": "mq",
  "Naum": "na",
  "Habacuque": "hc",
  "Sofonias": "sf",
  "Ageu": "ag",
  "Zacarias": "zc",
  "Malaquias": "ml",
  "Mateus": "mt",
  "Marcos": "mc",
  "Lucas": "lc",
  "João": "jo",
  "Atos": "at",
  "Romanos": "rm",
  "1 Coríntios": "1co",
  "2 Coríntios": "2co",
  "Gálatas": "gl",
  "Efésios": "ef",
  "Filipenses": "fp",
  "Colossenses": "cl",
  "1 Tessalonicenses": "1ts",
  "2 Tessalonicenses": "2ts",
  "1 Timóteo": "1tm",
  "2 Timóteo": "2tm",
  "Tito": "tt",
  "Filemom": "fm",
  "Hebreus": "hb",
  "Tiago": "tg",
  "1 Pedro": "1pe",
  "2 Pedro": "2pe",
  "1 João": "1jo",
  "2 João": "2jo",
  "3 João": "3jo",
  "Judas": "jd",
  "Apocalipse": "ap"
};

async function loadBible(): Promise<BibleBook[]> {
  if (cachedBible) return cachedBible;

  const res = await fetch("/nvi.json");
  if (!res.ok) throw new Error("Não foi possível carregar nvi.json");

  cachedBible = await res.json();
  return cachedBible;
}

export async function fetchBibleChapter(
  bookPt: string,
  chapter: number
): Promise<string> {
  const abbrev = BOOK_ABBREV_MAP[bookPt];
  if (!abbrev) {
    throw new Error(`Livro não mapeado: ${bookPt}`);
  }

  const bible = await loadBible();
  const book = bible.find(b => b.abbrev === abbrev);

  if (!book) {
    throw new Error(`Livro não encontrado no JSON: ${abbrev}`);
  }

  const chapterIndex = chapter - 1;
  const verses = book.chapters[chapterIndex];

  if (!verses) {
    throw new Error(`Capítulo inválido: ${chapter}`);
  }

  // Numera versículos manualmente
  return verses
    .map((text, i) => `${i + 1}. ${text}`)
    .join("\n");
}
