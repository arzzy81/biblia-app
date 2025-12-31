import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Settings, Book as BibleIcon } from 'lucide-react';

export default function App() {
  // ... mantenha seus estados aqui ...

  return (
    /* FUNDO FORÇADO: O segredo está no flex-col e no bg-slate-950 fixo aqui */
    <div className="flex flex-col min-h-screen w-full bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      <Toaster position="top-center" theme="dark" />
      
      {/* HEADER: Gradiente Petróleo Estático (UX: Garante que o texto comece DEPOIS dos botões) */}
      <nav className="w-full bg-[#0b1f2a] bg-gradient-to-r from-[#0b1f2a] to-[#2a0f2f] border-b border-white/5 py-8 shadow-2xl relative z-10">
        <div className="max-w-4xl mx-auto px-6 flex justify-center items-center gap-4">
          <button 
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#2FA4FF] border border-blue-500/20 transition-all active:scale-95 font-bold uppercase tracking-[0.2em] text-[10px]"
          >
            <BibleIcon size={16} /> Bíblia
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 transition-all active:scale-95 font-bold uppercase tracking-[0.2em] text-[10px]"
          >
            <Settings size={16} /> Ajustes
          </button>
        </div>
      </nav>

      {/* ÁREA DE CONTEÚDO: Padding superior para dar respiro visual */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 space-y-20">
        
        {/* HERO SECTION: Tipografia Open Sans limpa */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-light leading-tight">
            Um dia por vez. <br />
            Um texto por dia. <br />
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2FA4FF] to-purple-400">
              Uma vida transformada.
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md font-medium border-l-2 border-blue-500/30 pl-4">
            A constância na leitura da Palavra amplia o entendimento e renova a mente.
          </p>
        </section>

        {/* PROGRESSO: Visual Minimalista (Removendo o bug de sobreposição) */}
        <div className="relative flex flex-col items-center justify-center py-10">
          <span className="absolute text-[120px] md:text-[200px] font-black text-white/[0.02] leading-none select-none">
            0%
          </span>
          <div className="relative z-10 text-center">
            <p className="text-[10px] tracking-[0.5em] text-blue-400 uppercase font-black mb-2">Progresso Total</p>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">0<span className="text-blue-500 text-3xl">%</span></h2>
          </div>
        </div>

        {/* COMPONENTES DO DIA E LISTA (Serão empurrados naturalmente para baixo) */}
        <div className="pb-20">
            {/* Seus componentes DailyReadingCard e BookCards entram aqui */}
        </div>
      </main>

      {/* Modais (Ficam fora do fluxo de renderização principal) */}
      {isLibraryOpen && <BibleLibrary ... />}
      {isSettingsOpen && <SettingsPanel ... />}
    </div>
  );
}
