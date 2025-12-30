// src/utils/bibleApi.ts
import { BOOK_NUMBER } from "./bookNumber";

const BASE = "https://api.prayerpulse.io";

// Você pode trocar "ARC" por outra sigla disponível na API.
// A API permite usar o formato numérico do livro (legacy) e também ?clean=true. :contentReference[oaicite:5]{index=5}
export async function fetchBibleChapter(
  bookPt: string,
  chapter: number,
  translation: string = "ARC"
): Promise<string> {
  const bookNum = BOOK_NUMBER[bookPt];
  if (!bookNum) throw new Error(`Livro inválido: "${bookPt}" (sem mapeamento)`);
  if (!Number.isFinite(chapter) || chapter <= 0) throw new Error(`Capítulo inválido: ${chapter}`);

  const url = `${BASE}/bible/get-chapter/${encodeURIComponent(translation)}/${bookNum}/${chapter}/?clean=true`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`API Bíblia falhou (${res.status}): ${msg || "sem detalhes"}`);
  }

  const data = await res.json();

  // A API pode devolver lista de versos ou objeto; normalizamos aqui.
  // Vamos aceitar os formatos mais comuns:
  // - Array: [{ verse: 1, text: "..." }, ...]
  // - Object: { verses: [...] } ou { data: [...] }
  const verses =
    Array.isArray(data) ? data :
    Array.isArray(data?.verses) ? data.verses :
    Array.isArray(data?.data) ? data.data :
    null;

  if (!verses) {
    // fallback: se vier algo diferente, tenta achar "text"
    const maybeText = typeof data?.text === "string" ? data.text : null;
    if (maybeText) return maybeText;
    throw new Error("Formato inesperado de resposta da API.");
  }

  // Monta: "1. texto\n2. texto\n..."
  const lines = verses
    .map((v: any) => {
      const n = v?.verse ?? v?.number ?? v?.v;
      const t = v?.text ?? v?.t;
      if (!t) return null;
      return n ? `${n}. ${stripHtml(String(t))}` : stripHtml(String(t));
    })
    .filter(Boolean);

  return lines.join("\n");
}

function stripHtml(input: string) {
  return input.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?[^>]+>/g, "");
}

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ""; }
}
