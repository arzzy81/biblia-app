// src/utils/bibleApi.ts

export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

let cachedBible: BibleBook[] | null = null;

function normalize(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

const bookMap: Record<string, string> = {
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

export async function fetchBibleChapter(bookName: string, chapter: number): Promise<string> {
  if (!cachedBible) {
    const res = await fetch('/nvi.json');
    if (!res.ok) throw new Error('Não foi possível carregar a Bíblia.');
    cachedBible = await res.json();
  }

  const target = normalize(bookName);
  const targetAbbrev = bookMap[target];

  const book = cachedBible?.find(b => 
    normalize(b.name) === target || 
    normalize(b.abbrev) === target ||
    normalize(b.abbrev) === targetAbbrev
  );

  if (!book) throw new Error(`Livro não encontrado: ${bookName}`);

  const verses = book.chapters[chapter - 1];
  if (!verses) throw new Error(`Capítulo ${chapter} não encontrado.`);

  return verses.map((v, i) => `${i + 1}. ${v}`).join('\n');
}
