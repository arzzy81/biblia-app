import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { DailyReadingCard } from './components/DailyReadingCard';
import { SettingsPanel } from './components/SettingsPanel';
import { BibleReader } from './components/BibleReader';
import { BibleLibrary } from './components/BibleLibrary';
import { Toaster } from 'sonner';
import { getDayOfYear, getReadingForDay } from './utils/readingPlan';
import { Settings, Book as BibleIcon } from 'lucide-react';

export default function App() {
  const [readChapters, setReadChapters] = useState<Record<string, Set<number>>>({});
  const [userName, setUserName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  
  // Estados para o leitor
  const [readerBook, setReaderBook] = useState('');
  const [readerChapter, setReaderChapter] = useState(1);

  // Lógica de porcentagem
  const totalChaptersCount = 1189;
  const readChaptersCount = Object.values(readChapters).reduce((sum, set) => sum + set.size, 0);
  const readingPercentage = Math.round((readChaptersCount / totalChaptersCount) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <Toaster position="top-center" theme="dark" />
      
      {/* --- CABEÇALHO COM GRADIENTE PADRÃO (NÃO FLUTUANTE) --- */}
      <header className="w-full bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] border-b border-white/10 py-10 px-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          
          {/* BOTÕES CENTRALIZADOS E MODERNOS */}
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 hover:bg-[#2FA4FF]/20 text-[#2FA4FF] border border-white/10 transition-all active:scale-95 shadow-lg"
            >
              <BibleIcon size={20} />
              <span className="font-bold uppercase tracking-[0.2em] text-xs">Bíblia</span>
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all active:scale-95 shadow-lg"
            >
              <Settings size={20} />
              <span className="font-bold uppercase tracking-[0.2em] text-xs">Ajustes</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-500 ${isReaderOpen || isLibraryOpen ? 'blur-xl opacity-20' : 'opacity-100'}`}>
        
        {/* BOAS VINDAS COM TIPOGRAFIA LIMPA */}
        <div className="mb-20 space-y-2">
          <h1 className="text-3xl md:text-5xl font-light text-slate-200 leading-tight">
            Um dia por vez. <br />
            Um texto por dia. <br />
            <span className="font-extrabold text-[#2FA4FF]">Uma vida transformada.</span>
          </h1>
          <p className="text-slate-500 text-lg italic">
            "Sua palavra é lâmpada para os meus pés."
          </p>
        </div>

        {/* PROGRESSO EM DESTAQUE */}
        <div className="flex flex-col items-center mb-24 relative">
          <span className="text-9xl md:text-[150px] font-black text-white/[0.03] leading-none select-none">
            {readingPercentage}%
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
             <p className="text-[10px] tracking-[0.6em] text-[#2FA4FF] uppercase font-black">
                {userName ? `${userName}, VOCÊ JÁ LEU` : 'SEU PROGRESSO TOTAL'}
             </p>
             <h2 className="text-4xl md:text-6xl font-bold text-white mt-2">
                {readingPercentage}%
             </h2>
          </div>
        </div>

        {/* CARD DE LEITURA DIÁRIA */}
        <div className="mb-20">
          <DailyReadingCard
            currentDay={getDayOfYear()}
            dailyReading={getReadingForDay(getDayOfYear())}
            onDayChange={() => {}}
            readChapters={readChapters}
            onToggleChapter={() => {}}
            onReadNow={() => {}}
          />
        </div>

        {/* LISTAGEM DE LIVROS (REORGANIZADA) */}
        <div className="space-y-20">
           <section>
              <h3 className="text-[11px] tracking-[0.5em] text-slate-600 font-black uppercase mb-10 flex items-center gap-4">
                 ANTIGO TESTAMENTO <span className="h-px flex-1 bg-white/5"></span>
              </h3>
              {/* Aqui você renderiza seus BookCards... */}
           </section>
        </div>
      </main>

      {/* COMPONENTES LATERAIS */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userName={userName} onUserNameChange={setUserName} />
      <BibleLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} books={[]} onSelectChapter={() => {}} />
    </div>
  );
}
