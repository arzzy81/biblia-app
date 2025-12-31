import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Loader2, CheckCircle2, RefreshCw, Copy, Plus, Minus } from 'lucide-react';
import { fetchBibleChapter } from '../utils/bibleApi'; // Ajustado para o seu utilitário real
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
    if (isOpen) setCurrentChapter(chapter);
  }, [isOpen, book, chapter]);

  useEffect(() => {
    if (isOpen) loadChapter();
  }, [isOpen, currentChapter]);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchBibleChapter(book, currentChapter);
      setChapterText(text);
    } catch (err) {
      setError('Erro ao carregar capítulo');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(chapterText);
      toast.success('Copiado!');
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. OVERLAY: Escurece o fundo completamente para isolar a janela */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* 2. JANELA FLUTUANTE (Reader Panel) */}
      <div className="fixed inset-0 md:inset-x-4 md:inset-y-10 md:max-w-4xl md:mx-auto bg-[#0b1f2a] border border-white/10 md:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[101] flex flex-col overflow-hidden">
        
        {/* HEADER: Fundo sólido para não vazar o texto de fundo */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-[#162c38]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2FA4FF]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                {book} {currentChapter}
              </h2>
              <p className="text-[10px] text-blue-300/60 uppercase tracking-widest">
                NVI - Tradução Oficial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1">
              <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="p-1.5 hover:bg-white/10 rounded"><Minus className="w-4 h-4" /></button>
              <button onClick={() => setFontSize(Math.min(30, fontSize + 2))} className="p-1.5 hover:bg-white/10 rounded"><Plus className="w-4 h-4" /></button>
            </div>

            <button onClick={() => loadChapter()} className="p-2 hover:bg-white/10 rounded-lg text-gray-400"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={handleCopyText} className="p-2 hover:bg-white/10 rounded-lg text-gray-400"><Copy className="w-4 h-4" /></button>
            
            <button
              onClick={onMarkAsRead}
              className={`p-2 rounded-lg transition-all ${isRead ? 'text-green-400' : 'text-gray-400'}`}
            >
              <CheckCircle2 className={`w-6 h-6 ${isRead ? 'fill-green-400/20' : ''}`} />
            </button>

            <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-white rounded-lg"><X className="w-6 h-6" /></button>
          </div>
        </div>

        {/* CONTENT: Área do texto com fundo SÓLIDO */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#0b1f2a] custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-10 h-10 text-[#2FA4FF] animate-spin" />
              <span className="text-gray-500 text-xs tracking-widest">CARREGANDO...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-10">{error}</div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div 
                className="leading-[1.8] whitespace-pre-wrap text-gray-200 font-serif"
                style={{ fontSize: `${fontSize}px` }}
              >
                {chapterText}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: Navegação */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-white/10 bg-[#162c38]">
          <button
            onClick={() => setCurrentChapter(c => c - 1)}
            disabled={currentChapter === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-10 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Capítulo {currentChapter} de {totalChapters}
          </p>

          <button
            onClick={() => setCurrentChapter(c => c + 1)}
            disabled={currentChapter === totalChapters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-10 rounded-xl transition-all"
          >
            Próximo <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
