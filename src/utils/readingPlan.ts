// Plano de leitura da Bíblia em 365 dias
// Aproximadamente 3-4 capítulos por dia para completar os 1189 capítulos

export interface DailyReading {
  day: number;
  readings: {
    book: string;
    chapters: number[];
  }[];
}

export const readingPlan: DailyReading[] = [
  // Semana 1 - Gênesis
  { day: 1, readings: [{ book: "Gênesis", chapters: [1, 2, 3] }] },
  { day: 2, readings: [{ book: "Gênesis", chapters: [4, 5, 6] }] },
  { day: 3, readings: [{ book: "Gênesis", chapters: [7, 8, 9] }] },
  { day: 4, readings: [{ book: "Gênesis", chapters: [10, 11, 12] }] },
  { day: 5, readings: [{ book: "Gênesis", chapters: [13, 14, 15] }] },
  { day: 6, readings: [{ book: "Gênesis", chapters: [16, 17, 18] }] },
  { day: 7, readings: [{ book: "Gênesis", chapters: [19, 20, 21] }] },
  
  // Semana 2 - Gênesis
  { day: 8, readings: [{ book: "Gênesis", chapters: [22, 23, 24] }] },
  { day: 9, readings: [{ book: "Gênesis", chapters: [25, 26, 27] }] },
  { day: 10, readings: [{ book: "Gênesis", chapters: [28, 29, 30] }] },
  { day: 11, readings: [{ book: "Gênesis", chapters: [31, 32, 33] }] },
  { day: 12, readings: [{ book: "Gênesis", chapters: [34, 35, 36] }] },
  { day: 13, readings: [{ book: "Gênesis", chapters: [37, 38, 39] }] },
  { day: 14, readings: [{ book: "Gênesis", chapters: [40, 41, 42] }] },
  
  // Semana 3 - Gênesis/Êxodo
  { day: 15, readings: [{ book: "Gênesis", chapters: [43, 44, 45] }] },
  { day: 16, readings: [{ book: "Gênesis", chapters: [46, 47, 48] }] },
  { day: 17, readings: [{ book: "Gênesis", chapters: [49, 50] }, { book: "Êxodo", chapters: [1] }] },
  { day: 18, readings: [{ book: "Êxodo", chapters: [2, 3, 4] }] },
  { day: 19, readings: [{ book: "Êxodo", chapters: [5, 6, 7] }] },
  { day: 20, readings: [{ book: "Êxodo", chapters: [8, 9, 10] }] },
  { day: 21, readings: [{ book: "Êxodo", chapters: [11, 12, 13] }] },
  
  // Continua com a distribuição dos 1189 capítulos em 365 dias...
  // Por questão de espaço, vou criar apenas uma amostra e depois gerar dinamicamente
];

// Função auxiliar para gerar o plano completo
export function generateFullReadingPlan(): DailyReading[] {
  const plan: DailyReading[] = [];
  let currentDay = 1;
  
  const booksData = [
    { name: "Gênesis", chapters: 50 },
    { name: "Êxodo", chapters: 40 },
    { name: "Levítico", chapters: 27 },
    { name: "Números", chapters: 36 },
    { name: "Deuteronômio", chapters: 34 },
    { name: "Josué", chapters: 24 },
    { name: "Juízes", chapters: 21 },
    { name: "Rute", chapters: 4 },
    { name: "1 Samuel", chapters: 31 },
    { name: "2 Samuel", chapters: 24 },
    { name: "1 Reis", chapters: 22 },
    { name: "2 Reis", chapters: 25 },
    { name: "1 Crônicas", chapters: 29 },
    { name: "2 Crônicas", chapters: 36 },
    { name: "Esdras", chapters: 10 },
    { name: "Neemias", chapters: 13 },
    { name: "Ester", chapters: 10 },
    { name: "Jó", chapters: 42 },
    { name: "Salmos", chapters: 150 },
    { name: "Provérbios", chapters: 31 },
    { name: "Eclesiastes", chapters: 12 },
    { name: "Cântico dos Cânticos", chapters: 8 },
    { name: "Isaías", chapters: 66 },
    { name: "Jeremias", chapters: 52 },
    { name: "Lamentações", chapters: 5 },
    { name: "Ezequiel", chapters: 48 },
    { name: "Daniel", chapters: 12 },
    { name: "Oséias", chapters: 14 },
    { name: "Joel", chapters: 3 },
    { name: "Amós", chapters: 9 },
    { name: "Obadias", chapters: 1 },
    { name: "Jonas", chapters: 4 },
    { name: "Miquéias", chapters: 7 },
    { name: "Naum", chapters: 3 },
    { name: "Habacuque", chapters: 3 },
    { name: "Sofonias", chapters: 3 },
    { name: "Ageu", chapters: 2 },
    { name: "Zacarias", chapters: 14 },
    { name: "Malaquias", chapters: 4 },
    { name: "Mateus", chapters: 28 },
    { name: "Marcos", chapters: 16 },
    { name: "Lucas", chapters: 24 },
    { name: "João", chapters: 21 },
    { name: "Atos", chapters: 28 },
    { name: "Romanos", chapters: 16 },
    { name: "1 Coríntios", chapters: 16 },
    { name: "2 Coríntios", chapters: 13 },
    { name: "Gálatas", chapters: 6 },
    { name: "Efésios", chapters: 6 },
    { name: "Filipenses", chapters: 4 },
    { name: "Colossenses", chapters: 4 },
    { name: "1 Tessalonicenses", chapters: 5 },
    { name: "2 Tessalonicenses", chapters: 3 },
    { name: "1 Timóteo", chapters: 6 },
    { name: "2 Timóteo", chapters: 4 },
    { name: "Tito", chapters: 3 },
    { name: "Filemom", chapters: 1 },
    { name: "Hebreus", chapters: 13 },
    { name: "Tiago", chapters: 5 },
    { name: "1 Pedro", chapters: 5 },
    { name: "2 Pedro", chapters: 3 },
    { name: "1 João", chapters: 5 },
    { name: "2 João", chapters: 1 },
    { name: "3 João", chapters: 1 },
    { name: "Judas", chapters: 1 },
    { name: "Apocalipse", chapters: 22 },
  ];

  let chaptersPerDay = 3; // Média de 3 capítulos por dia
  let currentBookIndex = 0;
  let currentChapter = 1;

  while (currentDay <= 365 && currentBookIndex < booksData.length) {
    const dailyReading: DailyReading = {
      day: currentDay,
      readings: [],
    };

    let chaptersToday = 0;
    
    while (chaptersToday < chaptersPerDay && currentBookIndex < booksData.length) {
      const currentBook = booksData[currentBookIndex];
      const chaptersLeftInBook = currentBook.chapters - currentChapter + 1;
      const chaptersToRead = Math.min(
        chaptersPerDay - chaptersToday,
        chaptersLeftInBook
      );

      const chaptersList: number[] = [];
      for (let i = 0; i < chaptersToRead; i++) {
        chaptersList.push(currentChapter + i);
      }

      // Adiciona ou agrupa no mesmo livro
      const existingBookReading = dailyReading.readings.find(
        r => r.book === currentBook.name
      );
      
      if (existingBookReading) {
        existingBookReading.chapters.push(...chaptersList);
      } else {
        dailyReading.readings.push({
          book: currentBook.name,
          chapters: chaptersList,
        });
      }

      currentChapter += chaptersToRead;
      chaptersToday += chaptersToRead;

      // Se terminou o livro, vai para o próximo
      if (currentChapter > currentBook.chapters) {
        currentBookIndex++;
        currentChapter = 1;
      }
    }

    plan.push(dailyReading);
    currentDay++;
  }

  return plan;
}

// Função para obter a leitura de um dia específico
export function getReadingForDay(day: number): DailyReading | null {
  const plan = generateFullReadingPlan();
  return plan.find(r => r.day === day) || null;
}

// Função para calcular o dia do ano (1-365)
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
