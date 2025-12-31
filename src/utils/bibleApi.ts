// src/utils/bibleApi.ts
type BibleBook = {
  name: string;          // ex: "Gálatas", "2 Coríntios"
  abbrev: string;        // ex: "gl", "2co"
  chapters: string[][];  // chapters[capituloIndex][versoIndex] = texto
};

let cachedBible: BibleBook[] | null = null;

/** Normaliza texto para comparar (remove acentos, baixa caixa, remove espaços extras) */
function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

async function loadBible(): Promise<BibleBook[]> {
  if (cachedBible) return cachedBible;

  // Em Vite/Vercel, tudo que está em /public vira disponível na raiz:
  // public/nvi.json -> https://seusite.com/nvi.json
  const res = await fetch("/nvi.json", { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar /nvi.json (${res.status}). ${text}`);
  }

  const data = (await res.json()) as BibleBook[];

  if (!Array.isArray(data) || !data.length) {
    throw new Error("Formato inválido em /nvi.json (não é um array de livros).");
  }

  cachedBible = data;
  return data;
}

function findBook(bible: BibleBook[], bookPt: string): BibleBook | null {
  const target = norm(bookPt);

  // 1) tenta pelo name (mais comum no seu app)
  let book = bible.find((b) => norm(b.name) === target);
  if (book) return book;

  // 2) tenta pelo abbrev (caso algum lugar use abreviação)
  book = bible.find((b) => norm(b.abbrev) === target);
  if (book) return book;

  // 3) tenta “contém” (só pra tolerar pequenas diferenças)
  book = bible.find((b) => norm(b.name).includes(target) || target.includes(norm(b.name)));
  return book ?? null;
}

/**
 * Mantém a assinatura compatível com o que você já tinha.
 * translation é ignorado aqui porque estamos lendo do JSON local (NVI).
 */
export async function fetchBibleChapter(
  bookPt: string,
  chapter: number,
  _translation: string = "NVI"
): Promise<string> {
  if (!Number.isFinite(chapter) || chapter <= 0) {
    throw new Error(`Capítulo inválido: ${chapter}`);
  }

  const bible = await loadBible();
  const book = findBook(bible, bookPt);

  if (!book) {
    throw new Error(`Livro não encontrado: ${bookPt}`);
  }

  const chapIndex = chapter - 1;
  const chap = book.chapters?.[chapIndex];

  if (!chap) {
    const total = book.chapters?.length ?? 0;
    throw new Error(`Capítulo ${chapter} não existe em ${book.name} (total: ${total}).`);
  }

  // chap é um array de versos (strings)
  const lines = chap
    .map((verseText, i) => {
      const n = i + 1;
      const t = String(verseText ?? "").trim();
      if (!t) return null;
      return `${n}. ${t}`;
    })
    .filter(Boolean) as string[];

  return lines.join("\n");
}
