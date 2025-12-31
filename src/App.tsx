import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';
import { Toaster } from 'sonner';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';
import { Settings, Book as BibleIcon } from 'lucide-react';

// Lista de livros simplificada para o build (mantenha sua lista completa se tiver)
const books = [
  { name: "Gênesis", chapters: 50, testament: "old" },
  { name: "Êxodo", chapters: 40, testament: "old" },
  { name: "Apocalipse", chapters: 22, testament: "new" }
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

  const toggleChapter = (bookName: string, chapter: number) => {
    setReadChapters(prev => {
      const newState = { ...prev };
      if (!newState[bookName]) newState[bookName] = new Set();
      else newState[bookName] = new Set(newState[bookName]);
      if (newState[bookName].has(chapter)) newState[bookName].delete(chapter);
      else newState[bookName].add(chapter);
      
      const toSave: Record<string, number[]> = {};
      for (const [name, set] of Object.entries(newState)) {
        toSave[name] = Array.from(set);
      }
      localStorage.setItem('bibleReadingProgress', JSON.stringify(toSave));
      return newState;
    });
  };

  const handleReadNow = (bookName: string, chapter: number) => {
    const bookInfo = books.find(b => b.name === bookName);
    setReaderBook(bookName);
    setReaderChapter(chapter);
    setReaderTotalChapters(bookInfo ? bookInfo.chapters : 1);
    setIsReaderOpen(true);
    setIsLibraryOpen(false);
  };

  const totalChaptersCount = 1189;
  const readChaptersCount = Object.values(readChapters).reduce((sum, set) => sum + set.size, 0);
  const readingPercentage = Math.round((readChaptersCount / totalChaptersCount) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#2FA4FF]/30">
      <Toaster position="top-center" theme="dark" />
      
      {/* Botões Superiores Flutuantes (Versão que funcionava) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 bg-[#0b1f2a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <button 
          onClick={() => setIsLibraryOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-[#2FA4FF] transition-all active:scale-95"
        >
          <BibleIcon size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Bíblia</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 transition-all active:scale-95"
        >
          <Settings size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Ajustes</span>
        </button>
      </div>

      {/* Conteúdo Principal com margem superior para não bater nos botões */}
      <main className={`max-w-4xl mx-auto px-6 pt-32 pb-20 transition-all duration-500 ${isReaderOpen || isLibraryOpen ? 'blur-xl opacity-20' : 'opacity-100'}`}>
        
        <header className="mb-16">
          <h1 className="text-3xl md:text-5xl font-light leading-tight">
            Um dia por vez. <br />
            Um texto por dia. <br />
            <span className="font-bold text-[#2FA4FF]">Uma vida transformada.</span>
          </h1>
        </header>

        <div className="text-center mb-20">
          <h2 className="text-7xl md:text-9xl font-black text-white/5 leading-none select-none">
            {readingPercentage}%
          </h2>
          <p className="text-[10px] tracking-[0.5em] text-[#2FA4FF] uppercase font-bold -mt-4">
            Seu progresso total
          </p>
        </div>

        <DailyReadingCard
          currentDay={selectedDay}
          dailyReading={getReadingForDay(selectedDay)}
          onDayChange={setSelectedDay}
          readChapters={readChapters}
          onToggleChapter={toggleChapter}
          onReadNow={handleReadNow}
        />

        <div className="grid gap-12 mt-20">
          <section>
            <h3 className="text-[10px] tracking-[0.4em] text-gray-500 uppercase font-bold mb-6 border-b border-white/5 pb-2">Antigo Testamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.filter(b => b.testament === "old").map(book => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(c) => toggleChapter(book.name, c)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userName={userName} onUserNameChange={setUserName} />
      <BibleLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} books={books} onSelectChapter={handleReadNow} />
      
      {isReaderOpen && (
        <BibleReader 
          isOpen={isReaderOpen} 
          onClose={() => setIsReaderOpen(false)} 
          book={readerBook} 
          chapter={readerChapter} 
          totalChapters={readerTotalChapters} 
          isRead={readChapters[readerBook]?.has(readerChapter) || false} 
          onMarkAsRead={() => toggleChapter(readerBook, readerChapter)} 
        />
      )}
    </div>
  );
}
