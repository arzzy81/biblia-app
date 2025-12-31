import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';
import { Toaster, toast } from 'sonner';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';
import { Settings, Book as BibleIcon } from 'lucide-react';

// ... (Interface e Array de books permanecem idênticos ao seu código)
interface Book {
  name: string;
  chapters: number;
  testament?: string;
  period?: string;
}

const books: Book[] = [
  { name: "Gênesis", chapters: 50, testament: "old", period: "~4000-1800 a.C." },
  // ... (restante dos livros)
  { name: "Apocalipse", chapters: 22, testament: "new", period: "~95 d.C." }
];

export default function App() {
  const [readChapters, setReadChapters] = useState<Record<string, Set<number>>>({});
  const [selectedDay, setSelectedDay] = useState<number>(getDayOfYear());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
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
        toast.success('🎉 Parabéns!', { description: `Você completou o livro de ${bookName}!` });
      }
      saveProgress(newState);
      return newState;
    });
  };

  const handleReadNow = (bookName: string, chapter: number) => {
    const bookInfo = books.find(b => b.name === bookName);
    const actualTotal = bookInfo ? bookInfo.chapters : 1;
    setReaderBook(bookName);
    setReaderChapter(chapter);
    setReaderTotalChapters(actualTotal);
    setIsReaderOpen(true);
    setIsLibraryOpen(false);
  };

  const oldTestamentBooks = books.filter(b => b.testament === "old");
  const newTestamentBooks = books.filter(b => b.testament === "new");
  const totalChaptersCount = books.reduce((sum, book) => sum + book.chapters, 0);
  const readChaptersCount = Object.values(readChapters).reduce((sum, set) => sum + set.size, 0);
  const readingPercentage = totalChaptersCount > 0 ? Math.round((readChaptersCount / totalChaptersCount) * 100) : 0;
  const dailyReading = getReadingForDay(selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1f2a] to-[#2a0f2f] text-white flex flex-col">
      <Toaster position="top-center" theme="dark" />
      
      {/* CONTEÚDO COM MARGEM INFERIOR AUMENTADA (pb-40) PARA NÃO COBRIR O TEXTO */}
      <div className={`px-4 md:px-12 lg:px-20 pt-12 pb-40 transition-all duration-500 flex-1 ${isReaderOpen || isLibraryOpen ? 'blur-2xl opacity-20 pointer-events-none' : 'blur-0 opacity-100'}`}>
        
        <header className="mb-12 md:mb-16 max-w-2xl">
          <h1 className="text-[28px] md:text-[46px] leading-[1.2] mb-4 md:mb-6" style={{ fontFamily: "'Crimson Text', serif" }}>
            Um dia por vez.<br /> Um texto por dia.<br /> Uma vida transformada.
          </h1>
          <p className="text-[14px] md:text-[18px] text-[#DADADA]">
            Quando a Palavra ocupa um lugar diário na rotina, o entendimento é ampliado...
          </p>
        </header>

        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-[36px] md:text-[72px] mb-3 md:mb-4 bg-gradient-to-r from-[#2FA4FF] to-[#8B5CF6] bg-clip-text text-transparent" style={{ fontFamily: "'Crimson Text', serif" }}>
            {userName ? `${userName.toUpperCase()}, VOCÊ JÁ LEU ${readingPercentage}%` : `VOCÊ JÁ LEU ${readingPercentage}%`}
          </h2>
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

        <div className="space-y-20">
          <section>
            <h3 className="text-center text-xs tracking-[0.3em] uppercase text-gray-500 mb-8 italic">Antigo Testamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {oldTestamentBooks.map((book) => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(chapter) => toggleChapter(book.name, chapter)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-center text-xs tracking-[0.3em] uppercase text-gray-500 mb-8 italic">Novo Testamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newTestamentBooks.map((book) => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(chapter) => toggleChapter(book.name, chapter)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- NOVA TAB BAR DE NAVEGAÇÃO (ESTILO MOBILE APP) --- */}
      <footer className="fixed bottom-0 left-0 right-0 z-[50] px-4 pb-6 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent">
        <nav className="max-w-md mx-auto flex items-stretch bg-[#0b1f2a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Aba Biblioteca */}
          <button 
            onClick={() => setIsLibraryOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-4 hover:bg-white/5 transition-all active:bg-white/10"
          >
            <BibleIcon size={22} className="text-[#2FA4FF]" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#2FA4FF]">Biblioteca</span>
          </button>
          
          {/* Divisor Visual Silencioso */}
          <div className="w-[1px] bg-white/5 my-4" />

          {/* Aba Ajustes */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-4 hover:bg-white/5 transition-all active:bg-white/10"
          >
            <Settings size={22} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Ajustes</span>
          </button>

        </nav>
      </footer>

      {/* --- MODAIS E COMPONENTES DE LEITURA --- */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userName={userName} onUserNameChange={(n) => { setUserName(n); localStorage.setItem('bibleUserName', n); }} />
      
      <BibleLibrary 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        books={books as any} 
        onSelectChapter={handleReadNow} 
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
