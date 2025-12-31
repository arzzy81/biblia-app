import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { Toaster, toast } from 'sonner';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';
import { Settings } from 'lucide-react';

interface Book {
  name: string;
  chapters: number;
  testament?: string;
  period?: string;
}

const books: Book[] = [
  { name: "Gênesis", chapters: 50, testament: "old", period: "~4000-1800 a.C." },
  { name: "Êxodo", chapters: 40, testament: "old", period: "~1446 a.C." },
  { name: "Levítico", chapters: 27, testament: "old", period: "~1445 a.C." },
  { name: "Números", chapters: 36, testament: "old", period: "~1445-1405 a.C." },
  { name: "Deuteronômio", chapters: 34, testament: "old", period: "~1405 a.C." },
  { name: "Josué", chapters: 24, testament: "old", period: "~1405-1385 a.C." },
  { name: "Juízes", chapters: 21, testament: "old", period: "~1380-1050 a.C." },
  { name: "Rute", chapters: 4, testament: "old", period: "~1100 a.C." },
  { name: "1 Samuel", chapters: 31, testament: "old", period: "~1100-1010 a.C." },
  { name: "2 Samuel", chapters: 24, testament: "old", period: "~1010-970 a.C." },
  { name: "1 Reis", chapters: 22, testament: "old", period: "~970-850 a.C." },
  { name: "2 Reis", chapters: 25, testament: "old", period: "~850-560 a.C." },
  { name: "1 Crônicas", chapters: 29, testament: "old", period: "~1000-970 a.C." },
  { name: "2 Crônicas", chapters: 36, testament: "old", period: "~970-538 a.C." },
  { name: "Esdras", chapters: 10, testament: "old", period: "~538-457 a.C." },
  { name: "Neemias", chapters: 13, testament: "old", period: "~445-420 a.C." },
  { name: "Ester", chapters: 10, testament: "old", period: "~483-473 a.C." },
  { name: "Jó", chapters: 42, testament: "old", period: "~2000-1800 a.C." },
  { name: "Salmos", chapters: 150, testament: "old", period: "~1440-400 a.C." },
  { name: "Provérbios", chapters: 31, testament: "old", period: "~950-700 a.C." },
  { name: "Eclesiastes", chapters: 12, testament: "old", period: "~935 a.C." },
  { name: "Cântico dos Cânticos", chapters: 8, testament: "old", period: "~965 a.C." },
  { name: "Isaías", chapters: 66, testament: "old", period: "~740-680 a.C." },
  { name: "Jeremias", chapters: 52, testament: "old", period: "~627-580 a.C." },
  { name: "Lamentações", chapters: 5, testament: "old", period: "~586 a.C." },
  { name: "Ezequiel", chapters: 48, testament: "old", period: "~593-571 a.C." },
  { name: "Daniel", chapters: 12, testament: "old", period: "~605-530 a.C." },
  { name: "Oséias", chapters: 14, testament: "old", period: "~755-715 a.C." },
  { name: "Joel", chapters: 3, testament: "old", period: "~835 a.C." },
  { name: "Amós", chapters: 9, testament: "old", period: "~760 a.C." },
  { name: "Obadias", chapters: 1, testament: "old", period: "~840 a.C." },
  { name: "Jonas", chapters: 4, testament: "old", period: "~760 a.C." },
  { name: "Miquéias", chapters: 7, testament: "old", period: "~735-700 a.C." },
  { name: "Naum", chapters: 3, testament: "old", period: "~663-612 a.C." },
  { name: "Habacuque", chapters: 3, testament: "old", period: "~607 a.C." },
  { name: "Sofonias", chapters: 3, testament: "old", period: "~630 a.C." },
  { name: "Ageu", chapters: 2, testament: "old", period: "~520 a.C." },
  { name: "Zacarias", chapters: 14, testament: "old", period: "~520-480 a.C." },
  { name: "Malaquias", chapters: 4, testament: "old", period: "~430 a.C." },
  { name: "Mateus", chapters: 28, testament: "new", period: "~4 a.C.-30 d.C." },
  { name: "Marcos", chapters: 16, testament: "new", period: "~27-30 d.C." },
  { name: "Lucas", chapters: 24, testament: "new", period: "~4 a.C.-30 d.C." },
  { name: "João", chapters: 21, testament: "new", period: "~27-30 d.C." },
  { name: "Atos", chapters: 28, testament: "new", period: "~30-62 d.C." },
  { name: "Romanos", chapters: 16, testament: "new", period: "~57 d.C." },
  { name: "1 Coríntios", chapters: 16, testament: "new", period: "~55 d.C." },
  { name: "2 Coríntios", chapters: 13, testament: "new", period: "~56 d.C." },
  { name: "Gálatas", chapters: 6, testament: "new", period: "~49 d.C." },
  { name: "Efésios", chapters: 6, testament: "new", period: "~60 d.C." },
  { name: "Filipenses", chapters: 4, testament: "new", period: "~61 d.C." },
  { name: "Colossenses", chapters: 4, testament: "new", period: "~60 d.C." },
  { name: "1 Tessalonicenses", chapters: 5, testament: "new", period: "~51 d.C." },
  { name: "2 Tessalonicenses", chapters: 3, testament: "new", period: "~51 d.C." },
  { name: "1 Timóteo", chapters: 6, testament: "new", period: "~63 d.C." },
  { name: "2 Timóteo", chapters: 4, testament: "new", period: "~67 d.C." },
  { name: "Tito", chapters: 3, testament: "new", period: "~63 d.C." },
  { name: "Filemom", chapters: 1, testament: "new", period: "~60 d.C." },
  { name: "Hebreus", chapters: 13, testament: "new", period: "~67 d.C." },
  { name: "Tiago", chapters: 5, testament: "new", period: "~45 d.C." },
  { name: "1 Pedro", chapters: 5, testament: "new", period: "~63 d.C." },
  { name: "2 Pedro", chapters: 3, testament: "new", period: "~66 d.C." },
  { name: "1 João", chapters: 5, testament: "new", period: "~90 d.C." },
  { name: "2 João", chapters: 1, testament: "new", period: "~90 d.C." },
  { name: "3 João", chapters: 1, testament: "new", period: "~90 d.C." },
  { name: "Judas", chapters: 1, testament: "new", period: "~65 d.C." },
  { name: "Apocalipse", chapters: 22, testament: "new", period: "~95 d.C." }
];

export default function App() {
  const [readChapters, setReadChapters] = useState<Record<string, Set<number>>>({});
  const [selectedDay, setSelectedDay] = useState<number>(getDayOfYear());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState('');
  const [readerChapter, setReaderChapter] = useState(1);
  const [readerTotalChapters, setReaderTotalChapters] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('bibleReadingProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const restored: Record<string, Set<number>> = {};
      for (const [bookName, chapters] of Object.entries(parsed)) {
        restored[bookName] = new Set(chapters as number[]);
      }
      setReadChapters(restored);
    }
    const savedName = localStorage.getItem('bibleUserName');
    if (savedName) setUserName(savedName);
  }, []);

  const saveProgress = (newReadChapters: Record<string, Set<number>>) => {
    const toSave: Record<string, number[]> = {};
    for (const [bookName, chapters] of Object.entries(newReadChapters)) {
      toSave[bookName] = Array.from(chapters);
    }
    localStorage.setItem('bibleReadingProgress', JSON.stringify(toSave));
  };

  const toggleChapter = (bookName: string, chapter: number) => {
    setReadChapters(prev => {
      const newState = { ...prev };
      if (!newState[bookName]) newState[bookName] = new Set();
      else newState[bookName] = new Set(newState[bookName]);
      
      const wasRead = newState[bookName].has(chapter);
      if (wasRead) newState[bookName].delete(chapter);
      else newState[bookName].add(chapter);
      
      const book = books.find(b => b.name === bookName);
      if (book && !wasRead && newState[bookName].size === book.chapters) {
        toast.success('🎉 Parabéns!', {
          description: `Você completou o livro de ${bookName}!`,
        });
      }
      saveProgress(newState);
      return newState;
    });
  };

  const totalChaptersCount = books.reduce((sum, book) => sum + book.chapters, 0);
  const readChaptersCount = Object.values(readChapters).reduce((sum, set) => sum + set.size, 0);
  const readingPercentage = totalChaptersCount > 0 ? Math.round((readChaptersCount / totalChaptersCount) * 100) : 0;
  const dailyReading = getReadingForDay(selectedDay);

  const handleReadNow = (book: string, chapter: number, totalChaps: number) => {
    setReaderBook(book);
    setReaderChapter(chapter);
    setReaderTotalChapters(totalChaps);
    setIsReaderOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b1f2a] text-white overflow-x-hidden">
      <Toaster position="top-center" theme="dark" />
      
      {/* BACKGROUND GRADIENT */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#0b1f2a] to-[#2a0f2f] -z-10" />

      {/* MAIN CONTENT WRAPPER - Aqui aplicamos o desfoque Apple quando o leitor abrir */}
      <div className={`transition-all duration-500 ${isReaderOpen ? 'blur-xl scale-95 opacity-30 pointer-events-none' : 'blur-0'}`}>
        <div className="px-4 md:px-12 lg:px-20 py-8 md:py-16">
          
          <header className="mb-12 md:mb-16 max-w-2xl">
            <h1 className="text-[28px] md:text-[46px] leading-[1.2] mb-4 md:mb-6" style={{ fontFamily: "'Crimson Text', serif" }}>
              Um dia por vez.<br />
              Um texto por dia.<br />
              Uma vida transformada.
            </h1>
            <p className="text-[14px] md:text-[18px] leading-[1.5] text-[#DADADA]">
              Quando a Palavra ocupa um lugar diário na rotina, o entendimento é ampliado...
            </p>
          </header>

          <div className="text-center mb-12 md:mb-20 relative">
            <h2 className="text-[36px] md:text-[72px] mb-3 md:mb-4 bg-gradient-to-r from-[#2FA4FF] to-[#8B5CF6] bg-clip-text text-transparent leading-tight" style={{ fontFamily: "'Crimson Text', serif" }}>
              {userName ? `${userName.toUpperCase()}, VOCÊ JÁ LEU ${readingPercentage}%` : `VOCÊ JÁ LEU ${readingPercentage}%`}
            </h2>
            <button onClick={() => setIsSettingsOpen(true)} className="absolute top-0 right-0 p-3 hover:bg-white/10 rounded-lg">
              <Settings className="w-6 h-6 text-[#2FA4FF]" />
            </button>
          </div>

          <div className="mb-12 md:mb-20">
            <DailyReadingCard
              currentDay={selectedDay}
              dailyReading={dailyReading}
              onDayChange={setSelectedDay}
              readChapters={readChapters}
              onToggleChapter={toggleChapter}
              onReadNow={handleReadNow}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.name}
                book={book}
                readChapters={readChapters[book.name] || new Set()}
                onToggleChapter={(chapter) => toggleChapter(book.name, chapter)}
                onReadNow={handleReadNow}
              />
            ))}
          </div>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        onUserNameChange={(name) => { setUserName(name); localStorage.setItem('bibleUserName', name); }}
      />

      <BibleReader
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        book={readerBook}
        chapter={readerChapter}
        totalChapters={readerTotalChapters}
        isRead={readChapters[readerBook]?.has(readerChapter) || false}
        onMarkAsRead={() => toggleChapter(readerBook, readerChapter)}
      />
    </div>
  );
}
