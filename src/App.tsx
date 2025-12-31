import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Settings, Book as BibleIcon } from 'lucide-react';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';

// Componentes
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';

// Definição de tipos para evitar erros de TypeScript
interface Book {
  name: string;
  chapters: number;
  testament?: string;
}

export default function App() {
  const [readChapters, setReadChapters] = useState<Record<string, Set<number>>>({});
  const [userName, setUserName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState('');
  const [readerChapter, setReaderChapter] = useState(1);
  const [readerTotalChapters, setReaderTotalChapters] = useState(1);

  // Lista de livros (Exemplo básico, mantenha a sua lista original aqui)
  const books: Book[] = [
    { name: "Gênesis", chapters: 50, testament: "old" },
    { name: "Apocalipse", chapters: 22, testament: "new" }
  ];

  const toggleChapter = (bookName: string, chapter: number) => {
    // Sua lógica de marcar capítulo lido aqui
  };

  const handleReadNow = (bookName: string, chapter: number) => {
    setReaderBook(bookName);
    setReaderChapter(chapter);
    setIsReaderOpen(true);
  };

  const readingPercentage = 0; // Calculado dinamicamente no seu código original

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#020617] text-slate-100" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <Toaster position="top-center" theme="dark" />
      
      {/* HEADER ESTÁTICO COM GRADIENTE AZUL PETRÓLEO */}
      <nav className="w-full bg-gradient-to-r from-[#0b1f2a] to-[#2a0f2f] border-b border-white/5 py-8 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 flex justify-center items-center gap-4">
          <button 
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#2FA4FF] border border-blue-500/20 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <BibleIcon size={16} /> BÍBLIA
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <Settings size={16} /> AJUSTES
          </button>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL (EMPURRADO PELO HEADER) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 space-y-20">
        
        {/* TEXTO DE BOAS VINDAS DIAGRAMADO */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            Um dia por vez. <br />
            Um texto por dia. <br />
            <span className="font-extrabold text-[#2FA4FF]">Uma vida transformada.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md">
            A constância na leitura da Palavra amplia o entendimento e renova a mente.
          </p>
        </section>

        {/* PROGRESSO TOTAL */}
        <div className="relative flex flex-col items-center justify-center py-10">
          <span className="absolute text-[120px] md:text-[180px] font-black text-white/[0.02] leading-none select-none">
            {readingPercentage}%
          </span>
          <div className="relative z-10 text-center">
            <p className="text-[10px] tracking-[0.5em] text-blue-400 uppercase font-black mb-2">Progresso Total</p>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">{readingPercentage}%</h2>
          </div>
        </div>

        {/* CARD DE LEITURA DIÁRIA */}
        <div className="pb-20">
          <DailyReadingCard
            currentDay={getDayOfYear()}
            dailyReading={getReadingForDay(getDayOfYear())}
            onDayChange={() => {}}
            readChapters={readChapters}
            onToggleChapter={toggleChapter}
            onReadNow={handleReadNow}
          />
        </div>
      </main>

      {/* MODAIS (CORRIGIDOS PARA O BUILD NÃO FALHAR) */}
      <BibleLibrary 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        books={books} 
        onSelectChapter={handleReadNow} 
      />

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userName={userName} 
        onUserNameChange={setUserName} 
      />

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
