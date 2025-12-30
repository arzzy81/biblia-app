import { BOOK_NUMBER } from "./bookNumber";

let bibleCache: any = null;

// Carrega o JSON apenas uma vez
async function loadBibleJson() {
  if (bibleCache) return bibleCache;

  const res = await fetch("/nvi.json");
  if (!res.ok) {
    throw new Error("Não foi possível carregar o arquivo nvi.json");
  }

  bibleCache = await res.json();
  return bibleCache;
}

export async function fetchBibleChapter(
  bookPt: string,
  chapter: number
): Promise<string> {
  const bookNum = BOOK_NUMBER[bookPt];
  if (!bookNum) {
    throw new Error(`Livro inválido: "${bookPt}"`);
  }

  if (!Number.isFinite(chapter) || chapter <= 0) {
    throw new Error(`Capítulo inválido: ${chapter}`);
  }

  const bible = await loadBibleJson();

  // Estrutura padrão do JSON (repositório que você achou)
  // bible[bookNumber][chapterNumber] = array de versos
  const bookData = bible[bookNum];
  if (!bookData) {
    throw new Error(`Livro não encontrado no JSON (${bookPt})`);
  }

  const chapterData = bookData[chapter];
  if (!chapterData || !Array.isArray(chapterData)) {
    throw new Error(`Capítulo ${chapter} não encontrado em ${bookPt}`);
  }

  // Monta texto: "1. texto\n2. texto\n..."
  return chapterData
    .map((verse: any, index: number) => {
      const text =
        typeof verse === "string"
          ? verse
          : verse?.text ?? verse?.t ?? "";

      if (!text) return null;
      return `${index + 1}. ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}
