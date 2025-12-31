// src/utils/bibleApi.ts

type BibleBook = {
  name?: string;
  abbrev: string;
  chapters: string[][]; // [ [verso1, verso2...], [cap2...], ... ]
};

let cachedBible: BibleBook[] | null = null;

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]/g, ""); // remove espaços/pontuação
}

async function loadBible(): Promise<BibleBook[]> {
  if (cachedBible) return cachedBible;

  const res = await fetch("/nvi.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Não foi possível carregar /nvi.json (${res.status})`);
  }

  const data = (await res.json()) as BibleBook[];
  if (!Array.isArray(data) || !data.length) {
    throw new Error("nvi.json inválido ou vazio.");
  }

  cachedBible = data;
  return data;
}

function findBook(bible: BibleBook[], bookPt: string): BibleBook | null {
  // 1) tenta por nome exato (com acento)
  const exact = bible.find((b) => b.name === bookPt);
  if (exact) return exact;

  const target = normalize(bookPt);

  // 2) tenta por nome normalizado (sem acento)
  const byName = bible.find((b) => b.name && normalize(b.name) === target);
  if (byName) return byName;

  // 3) tenta se o usuário já passou abreviação (ex: "gl", "2co", "gn")
  const byAbbrev = bible.find((b) => normalize(b.abbrev) === target);
  if (byAbbrev) return byAbbrev;

  return null;
}

/**
 * Lê um capítulo do JSON local.
 * - bookPt: nome em PT-BR (ex: "Gálatas", "2 Coríntios") OU abreviação (ex: "gl", "2co")
 * - chapter: número do capítulo (1-based)
 * - translation: ignorado (mantido só pra compatibilidade com seu componente)
 */
export async function fetchBibleChapter(
  bookPt: string,
  chapter: number,
  translation: string = "NVI"
): Promise<string> {
  const bible = await loadBible();

  const book = findBook(bible, bookPt);
  if (!book) throw new Error(`Livro não encontrado: ${bookPt}`);

  if (!Number.isFinite(chapter) || chapter <= 0) {
    throw new Error(`Capítulo inválido: ${chapter}`);
  }

  const capIndex = chapter - 1;
  const cap = book.chapters?.[capIndex];
  if (!cap) {
    throw new Error(`Capítulo não encontrado: ${book.name ?? book.abbrev} ${chapter}`);
  }

  // Monta: "1. texto\n2. texto\n..."
  return cap.map((v, i) => `${i + 1}. ${v}`).join("\n");
}
