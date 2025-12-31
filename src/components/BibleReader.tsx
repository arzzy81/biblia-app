import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Loader2, CheckCircle2, RefreshCw, Copy, Plus, Minus } from 'lucide-react';
import { fetchBibleChapter, validateBibleText } from '../utils/geminiApi';
import { toast } from 'sonner';

interface BibleReaderProps {
  isOpen: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
  totalChapters: number;
  isRead: boolean;
  onMarkAsRead: () => void;
}

export function BibleReader({
  isOpen,
  onClose,
  book,
  chapter,
  totalChapters,
  isRead,
  onMarkAsRead,
}: BibleReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(chapter);
  const [chapterText, setChapterText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    if (isOpen) {
      setCurrentChapter(chapter);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, book, chapter]);

  useEffect(() => {
    if (isOpen) loadChapter();
  }, [isOpen, currentChapter]);

  const loadChapter = async (forceReload = false) => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchBibleChapter(book, currentChapter);
      setChapterText(text);
    } catch (err) {
      setError('Erro ao carregar o capitulo. Verifique sua conexao.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 lg:p-10">
      {/* FUNDO ESCURO COM DESFOQUE - Bloqueia a visão do que está atrás */}
      <div 
        className="absolute inset-0 bg-black/98 backdrop-blur-x1" 
        onClick={onClose} 
      />

      {/* JANELA FLUTUANTE SÓLIDA */}
      <div className="relative w-full h-full max-w-5xl bg-[#0b161d] shadow-[0_0_60px_rgba(0,0,0,1)] md:rounded-2xl flex flex-col overflow-hidden border border-white/10">
        
        {/* CABEÇALHO - Atualizado para NVI */}
        <div className="flex items-center justify-between p-4 md:p-6 bg-[#122835] border-b border-white/5">
          <div className="flex items-center gap-4">
            <BookOpen className="w-6 h-6 text-[#2FA4FF]" />
            <div>
              <h2 className="text-white font-bold text-lg md:text-xl">{book} {currentChapter}</h2>
              <p className="text-[10px] text-blue-300/40 uppercase tracking-widest mt-1">
                NVI - Nova Versão Internacional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(s => Math.max(12, s-2))} className="p-2 text-gray-400 hover:text-white"><Minus size={18}/></button>
            <button onClick={() => setFontSize(s => Math.min(32, s+2))} className="p-2 text-gray-400 hover:text-white"><Plus size={18}/></button>
            <button 
              onClick={onMarkAsRead}
              className={`ml-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isRead ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              {isRead ? 'LIDO' : 'MARCAR'}
            </button>
            <button onClick={onClose} className="ml-2 p-2 text-gray-400 hover:text-white">
              <X size={30} />
            </button>
          </div>
        </div>

        {/* ÁREA DE LEITURA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#0b161d]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="animate-spin text-[#2FA4FF] mb-4" size={40} />
              <p className="text-gray-500 text-xs tracking-widest uppercase">Buscando na NVI...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-gray-400 mb-6">{error}</p>
              <button onClick={() => loadChapter(true)} className="px-6 py-2 bg-white/10 rounded-lg text-sm">Tentar Novamente</button>
            </div>
          ) : (
            <div 
              className="max-w-3xl mx-auto text-[#e2e8f0] font-serif leading-[1.9]"
              style={{ fontSize: `${fontSize}px` }}
            >
              {chapterText}
            </div>
          )}
        </div>

        {/* RODAPÉ */}
        <div className="p-4 md:p-6 bg-[#122835] border-t border-white/5 flex justify-between items-center">
          <button 
            onClick={() => setCurrentChapter(c => Math.max(1, c-1))}
            disabled={currentChapter === 1}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 disabled:opacity-10"
          >
            <ChevronLeft size={18} /> ANTERIOR
          </button>
          
          <span className="text-[10px] text-gray-500 font-mono">{currentChapter} / {totalChapters}</span>

          <button 
            onClick={() => setCurrentChapter(c => Math.min(totalChapters, c+1))}
            disabled={currentChapter === totalChapters}
            className="flex items-center gap-2 text-sm font-bold text-[#2FA4FF] disabled:opacity-10"
          >
            PRÓXIMO <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
