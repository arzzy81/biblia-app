import { BOOK_NUMBER } from "./bookNumber";

/**
 * Lê a Bíblia diretamente do arquivo /public/nvi.json
 * Sem API, sem internet, sem dependência externa
 */
export async function fetchBibleChapter(
  bookPt: string,
  chapter: number,
  translation: string = "NVI"
): Promise<string> {
  // carrega o JSON público
  const res = await fetch("/nvi.json");
  if (!res.ok) {
    throw new Error("Não foi possível carregar o arquivo nvi.json");
  }

  const bible = await res.json();

  const book = bible[bookPt];
  if (!book) {
    throw new Error(`Livro não encontrado no JSON: ${bookPt}`);
  }

  const verses = book[String(chapter)];
  if (!verses || verses.length === 0) {
    throw new Error(`Capítulo ${chapter} não encontrado em ${bookPt}`);
  }

  // Monta o texto no formato:
  // 1. texto
  // 2. texto
  const text = verses
    .map((v: any) => `${v.verse}. ${v.text}`)
    .join("\n");

  return text;
}
