import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';
import { Toaster, toast } from 'sonner';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';
import { Settings, Book as BibleIcon } from 'lucide-react';

// Importando a fonte Open Sans via Google Fonts no CSS global ou index.html é recomendado.
// Aqui aplicaremos via inline style ou classes do Tailwind para garantir a troca.

interface Book {
  name: string;
  chapters: number;
  testament?: string;
  period?: string;
}

const books: Book[] = [
  // ... (mantenha sua lista de livros aqui igual ao anterior)
  { name: "Gênesis", chapters: 50, testament: "old", period: "~4000-1800 a.C." },
  // ... adicione os demais livros como no código original
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
      const wasRead = newState[bookName].has(chapter);
      if (wasRead) newState[bookName].delete(chapter);
      else newState[bookName].add(chapter);
      saveProgress(newState);
      return newState;
    });
  };

  const saveProgress = (newReadChapters: Record<string, Set<number>>) => {
    const toSave: Record<string, number[]> = {};
    for (const [bookName, chapters] of Object.entries(newReadChapters)) {
      toSave[bookName] = Array.from(chapters);
    }
    localStorage.setItem('bibleReadingProgress', JSON.stringify(toSave));
  };

  const handleReadNow = (bookName: string, chapter: number) => {
    const bookInfo = books.find(b => b.name === bookName);
    setReaderBook(bookName);
    setReaderChapter(chapter);
    setReaderTotalChapters(bookInfo ? bookInfo.chapters : 1);
    setIsReaderOpen(true);
    setIsLibraryOpen(false);
  };

  const totalChaptersCount = books.reduce((sum, book) => sum + book.chapters, 0);
  const readChaptersCount = Object.values(readChapters).reduce((sum, set) => sum + set.size, 0);
  const readingPercentage = Math.round((readChaptersCount / totalChaptersCount) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#050a0e] text-white font-['Open_Sans',sans-serif]">
      <Toaster position="top-center" theme="dark" />
      
      {/* --- CABEÇALHO ESTÁTICO (NÃO FLUTUANTE) --- */}
      <header className="w-full bg-[#0b1f2a] border-b border-white/10 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            {/* BOTÃO BÍBLIA */}
            <button 
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 hover:bg-[#2FA4FF]/20 text-[#2FA4FF] border border-white/10 transition-all active:scale-95"
            >
              <BibleIcon size={18} />
              <span className="text-sm font-bold tracking-widest uppercase">Bíblia</span>
            </button>

            {/* BOTÃO AJUSTES */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all active:scale-95"
            >
              <Settings size={18} />
              <span className="text-sm font-bold tracking-widest uppercase">Ajustes</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className={`max-w-4xl mx-auto px-6 py-12 transition-all duration-500 ${isReaderOpen || isLibraryOpen ? 'blur-xl opacity-20' : 'opacity-100'}`}>
        
        {/* TEXTO DE BOAS VINDAS DIAGRAMADO SIMPLES */}
        <section className="mb-16 text-center md:text-left border-l-4 border-[#2FA4FF] pl-6 py-2">
          <h1 className="text-3xl md:text-4xl font-light leading-tight mb-4 text-white">
            Um dia por vez. <br />
            Um texto por dia. <br />
            <span className="font-bold">Uma vida transformada.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl">
            A constância na leitura da Palavra amplia o entendimento e renova a mente todos os dias.
          </p>
        </section>

        {/* PROGRESSO CENTRALIZADO */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent opacity-80">
            {readingPercentage}%
          </h2>
          <p className="text-xs tracking-[0.4em] text-[#2FA4FF] uppercase mt-2 font-bold">
            {userName ? `${userName}, seu progresso total` : 'Seu progresso total'}
          </p>
        </div>

        {/* CARD DE LEITURA DO DIA */}
        <div className="mb-20">
          <DailyReadingCard
            currentDay={selectedDay}
            dailyReading={getReadingForDay(selectedDay)}
            onDayChange={setSelectedDay}
            readChapters={readChapters}
            onToggleChapter={toggleChapter}
            onReadNow={handleReadNow}
          />
        </div>

        {/* LISTA DE LIVROS (GRID SIMPLIFICADA) */}
        <div className="space-y-16">
          <section>
            <h3 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-8 font-bold border-b border-white/5 pb-2">Antigo Testamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.filter(b => b.testament === "old").map((book) => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(cap) => toggleChapter(book.name, cap)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-8 font-bold border-b border-white/5 pb-2">Novo Testamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.filter(b => b.testament === "new").map((book) => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(cap) => toggleChapter(book.name, cap)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* PAINÉIS LATERAIS */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userName={userName} onUserNameChange={(n) => { setUserName(n); localStorage.setItem('bibleUserName', n); }} />
      <BibleLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} books={books} onSelectChapter={handleReadNow} />
      <BibleReader isOpen={isReaderOpen} onClose={() => setIsReaderOpen(false)} book={readerBook} chapter={readerChapter} totalChapters={readerTotalChapters} isRead={readChapters[readerBook]?.has(readerChapter) || false} onMarkAsRead={() => toggleChapter(readerBook, readerChapter)} />
    </div>
  );
}
