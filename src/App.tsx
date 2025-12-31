import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Settings, Book as BibleIcon } from 'lucide-react';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';

// Importe seus componentes garantindo que os caminhos estão corretos
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';

export default function App() {
  const [readChapters, setReadChapters] = useState<Record<string, Set<number>>>({});
  const [userName, setUserName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState('');
  const [readerChapter, setReaderChapter] = useState(1);

  // Prevenção de erro: Se o plano de leitura falhar, define um padrão
  const currentDayReading = getReadingForDay(getDayOfYear()) || { chapters: [] };

  return (
    /* O h-screen e o overflow-x-hidden garantem que o fundo escuro domine a tela */
    <div className="min-h-screen w-full bg-[#020617] text-white overflow-x-hidden" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <Toaster position="top-center" theme="dark" />
      
      {/* HEADER: Agora com cores sólidas de fallback para evitar o branco se o gradiente falhar */}
      <header className="w-full bg-[#0b1f2a] bg-gradient-to-r from-[#0b1f2a] to-[#2a0f2f] border-b border-white/10 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col items-center">
          <div className="flex gap-4">
            <button 
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-[#2FA4FF]/20 text-[#2FA4FF] border border-white/10 transition-all font-bold uppercase tracking-widest text-xs"
            >
              <BibleIcon size={18} />
              Bíblia
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all font-bold uppercase tracking-widest text-xs"
            >
              <Settings size={18} />
              Ajustes
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO: Ajustado para não sumir */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        
        {/* TÍTULO INICIAL DIAGRAMADO */}
        <div className="mb-20">
          <h1 className="text-4xl md:text-5xl font-light leading-tight text-white mb-4">
            Um dia por vez. <br />
            Um texto por dia. <br />
            <span className="font-extrabold text-[#2FA4FF]">Uma vida transformada.</span>
          </h1>
          <p className="text-gray-500 text-lg">
            A constância na leitura renova o entendimento.
          </p>
        </div>

        {/* PROGRESSO */}
        <div className="flex flex-col items-center mb-24 py-10 border-y border-white/5">
           <p className="text-[10px] tracking-[0.5em] text-[#2FA4FF] uppercase font-black mb-2">
              Progresso de Leitura
           </p>
           <h2 className="text-7xl font-bold text-white">0%</h2>
        </div>

        {/* ÁREA DO CARD DO DIA */}
        <div className="bg-white/5 rounded-3xl p-1 border border-white/10">
          <DailyReadingCard
            currentDay={getDayOfYear()}
            dailyReading={currentDayReading}
            onDayChange={() => {}}
            readChapters={readChapters}
            onToggleChapter={() => {}}
            onReadNow={() => {}}
          />
        </div>
      </main>

      {/* COMPONENTES DE INTERFACE (Modais) */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userName={userName} 
        onUserNameChange={setUserName} 
      />
      
      <BibleLibrary 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        books={[]} 
        onSelectChapter={() => {}} 
      />

      {/* O Reader só renderiza se estiver aberto para evitar erros de API/Nulo */}
      {isReaderOpen && (
        <BibleReader 
          isOpen={isReaderOpen} 
          onClose={() => setIsReaderOpen(false)} 
          book={readerBook} 
          chapter={readerChapter} 
          totalChapters={1} 
          isRead={false} 
          onMarkAsRead={() => {}} 
        />
      )}
    </div>
  );
}
