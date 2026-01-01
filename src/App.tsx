import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';
import { Toaster, toast } from 'sonner';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';
import { Settings, Book as BibleIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1f2a] to-[#2a0f2f] text-white flex flex-col font-sans overflow-x-hidden">
      <Toaster position="top-center" theme="dark" />

      {/* --- HEADER FIXO --- */}
      <header className="fixed top-0 left-0 right-0 w-full z-[100] bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-lg">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="font-serif italic text-lg md:text-xl font-medium text-white">
              Bible Life
            </div>
            <nav className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setIsLibraryOpen(true)} className="flex items-center gap-2 px-3 md:px-5 py-2 rounded-xl bg-[#2FA4FF]/10 text-[#2FA4FF] border border-[#2FA4FF]/20 transition-all active:scale-95 group">
                <BibleIcon size={18} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Bíblia</span>
              </button>
              <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-3 md:px-5 py-2 rounded-xl bg-white/5 text-gray-400 border border-white/5 transition-all active:scale-95 group">
                <Settings size={18} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Ajustes</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className={`flex-1 flex flex-col pt-[calc(110px+env(safe-area-inset-top))] md:pt-48 pb-24 transition-all duration-500 ${isReaderOpen || isLibraryOpen ? 'blur-2xl opacity-20 pointer-events-none' : ''}`}>
        
        {/* 🟦 SEÇÃO 1 — BANNER HERO (SIMÉTRICO) */}
        <section className="px-6 text-center py-12 md:py-20 mb-12">
          <div className="max-w-3xl mx-auto">
            {/* Slogan unificado */}
            <div className="space-y-2 mb-10">
              <h1 className="text-[28px] md:text-[56px] leading-tight font-light italic text-[#2FA4FF]" style={{ fontFamily: "'Crimson Text', serif" }}>
                Um dia por vez.
              </h1>
              <h1 className="text-[28px] md:text-[56px] leading-tight font-light italic text-[#2FA4FF]" style={{ fontFamily: "'Crimson Text', serif" }}>
                Um texto por dia.
              </h1>
              <h1 className="text-[28px] md:text-[56px] leading-tight font-light italic text-[#2FA4FF]" style={{ fontFamily: "'Crimson Text', serif" }}>
                Uma vida transformada.
              </h1>
            </div>
            {/* Texto de apoio */}
            <div className="max-w-md mx-auto border-t border-white/10 pt-10">
              <p className="text-[14px] md:text-[18px] text-slate-400 font-light italic leading-relaxed">
                "Quando a Palavra ocupa um lugar diário na rotina, o entendimento é ampliado..."
              </p>
            </div>
          </div>
        </section>

        {/* 🟦 SEÇÃO 2 — PROGRESSO (COM BARRA) */}
        <section className="px-6 mb-24 md:mb-32 text-center">
          <div className="max-w-md mx-auto">
            <p className="text-[10px] tracking-[0.5em] text-[#2FA4FF] font-black uppercase mb-4">Seu Progresso de Leitura</p>
            <h2 className="text-[60px] md:text-[90px] text-white font-black mb-6 leading-none" style={{ fontFamily: "'Crimson Text', serif" }}>
              {readingPercentage}%
            </h2>
            {/* Barra de Progresso com Respiro */}
            <div className="px-4">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#2FA4FF] to-[#8B5CF6] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(47,164,255,0.4)]"
                  style={{ width: `${readingPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 🟦 SEÇÃO 3 — LEITURA DO DIA */}
        <div className="px-4 md:px-12 lg:px-20 mb-32">
          <DailyReadingCard
            currentDay={selectedDay}
            dailyReading={dailyReading}
            onDayChange={setSelectedDay}
            readChapters={readChapters}
            onToggleChapter={toggleChapter}
            onReadNow={handleReadNow}
          />
        </div>

        {/* 🟦 SEÇÃO 4 — LIVROS (COM GAPS CORRETOS) */}
        <div className="px-4 md:px-12 lg:px-20 space-y-32">
          <section>
            <h3 className="text-center text-xs tracking-[0.4em] uppercase text-gray-500 mb-12 italic font-bold">Antigo Testamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {oldTestamentBooks.map((book) => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(chapter) => toggleChapter(book.name, chapter)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-center text-xs tracking-[0.4em] uppercase text-gray-500 mb-12 italic font-bold">Novo Testamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {newTestamentBooks.map((book) => (
                <BookCard key={book.name} book={book} readChapters={readChapters[book.name] || new Set()} onToggleChapter={(chapter) => toggleChapter(book.name, chapter)} onReadNow={handleReadNow} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userName={userName} onUserNameChange={(n) => { setUserName(n); localStorage.setItem('bibleUserName', n); }} />
      <BibleLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} books={books as any} onSelectChapter={handleReadNow} />
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
