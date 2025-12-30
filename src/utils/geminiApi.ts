// src/utils/geminiApi.ts
// (mantive o nome do arquivo para você não precisar mudar imports no app)

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

type BibleBook = {
  abbrev?: string;
  name: string;
  chapters: string[][];
};

let bibleCache: BibleBook[] | null = null;

// Normaliza texto para comparação (tira acento, espaços, pontuação)
function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]/g, ""); // remove espaços/pontuação
}

// Aliases para bater com nomes diferentes entre seu App e o JSON
// (se o seu JSON tiver mais diferenças, é só adicionar aqui)
const ALIASES: Record<string, string> = {
  // App: "Cântico dos Cânticos"  -> JSON geralmente: "Cânticos"
  [norm("Cântico dos Cânticos")]: "Cânticos",
  [norm("Cantares")]: "Cânticos",
  [norm("Cantico dos Canticos")]: "Cânticos",
};

async function loadBibleOnce(): Promise<BibleBook[]> {
  if (bibleCache) return bibleCache;

  // Vite/React: tudo que está em /public vira acessível em "/"
  const res = await fetch("/nvi.json", { cache: "force-cache" });

  if (!res.ok) {
    throw new Error(
      `Não encontrei /nvi.json (status ${res.status}). Confirme se o arquivo está em /public/nvi.json e commitado.`
    );
  }

  const data = (await res.json()) as BibleBook[];

  if (!Array.isArray(data) || !data.length) {
    throw new Error("O arquivo /nvi.json não parece estar no formato esperado (lista de livros).");
  }

  bibleCache = data;
  return data;
}

function formatChapterText(bookName: string, chapterNumber: number, verses: string[]): string {
  // Formato com numeração de versículos (um por linha)
  const lines = verses.map((v, i) => `${i + 1} ${v}`);
  return `${bookName} ${chapterNumber}\n\n${lines.join("\n")}`;
}

export function validateBibleText(text: string): ValidationResult {
  const cleaned = (text || "").trim();
  if (!cleaned) return { isValid: false, error: "Texto vazio." };

  // Checagens simples só pra evitar tela em branco
  if (cleaned.length < 50) {
    return { isValid: false, error: "Texto muito curto (provável erro ao carregar)." };
  }

  return { isValid: true };
}

// Esta é a função que o BibleReader já chama
export async function fetchBibleChapter(book: string, chapter: number): Promise<string> {
  const bible = await loadBibleOnce();

  const wantedNorm = norm(book);
  const aliasName = ALIASES[wantedNorm]; // se existir alias, usamos ele

  // tenta achar por:
  // 1) nome exato
  // 2) nome normalizado
  // 3) alias
  const found =
    bible.find((b) => b.name === book) ||
    bible.find((b) => norm(b.name) === wantedNorm) ||
    (aliasName ? bible.find((b) => b.name === aliasName) : undefined) ||
    (aliasName ? bible.find((b) => norm(b.name) === norm(aliasName)) : undefined);

  if (!found) {
    const exemplo = bible.slice(0, 8).map((b) => b.name).join(", ");
    throw new Error(
      `Livro "${book}" não encontrado no nvi.json. Exemplos de nomes existentes: ${exemplo}...`
    );
  }

  const idx = chapter - 1;
  if (!Number.isFinite(chapter) || chapter < 1 || idx >= found.chapters.length) {
    throw new Error(
      `Capítulo inválido: ${chapter}. "${found.name}" tem ${found.chapters.length} capítulos.`
    );
  }

  const verses = found.chapters[idx];
  if (!Array.isArray(verses) || !verses.length) {
    throw new Error(`Capítulo ${chapter} de "${found.name}" está vazio no JSON.`);
  }

  const text = formatChapterText(found.name, chapter, verses);

  const validation = validateBibleText(text);
  if (!validation.isValid) {
    throw new Error(validation.error || "Texto inválido.");
  }

  return text;
}
