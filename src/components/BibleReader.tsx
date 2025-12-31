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
    }
  }, [isOpen, book, chapter]);

  useEffect(() => {
    if (isOpen) {
      loadChapter();
    }
  }, [isOpen, currentChapter]);

  const getCacheKey = () => `bible_cache_${book}_${currentChapter}`;

  const loadChapter = async (forceReload = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!forceReload) {
        const cached = localStorage.getItem(getCacheKey());
        if (cached) {
          const { text, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 604800000) { // 7 dias
            setChapterText(text);
            setLoading(false);
            return;
          }
        }
      }

      const text = await fetchBibleChapter(book, currentChapter);
      const validationResult = validateBibleText(text);
      
      if (!validationResult.isValid && validationResult.error) {
        setError(validationResult.error);
      } else {
        setChapterText(text);
        localStorage.setItem(getCacheKey(), JSON.stringify({
          text,
          timestamp: Date.now(),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na conexao com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(chapterText);
      toast.success('Texto copiado');
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/95 z-[100]"
        onClick={onClose}
      />

      <div className="fixed inset-0 md:inset-4 lg:inset-10 md:max-w-5xl md:mx-auto bg-[#0b161d] border border-white/10 md:rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5 bg-[#122835]">
          <div className="flex items-center gap-4">
            <BookOpen className="w-6 h-6 text-[#2FA4FF]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
                {book} {currentChapter}
              </h2>
              <p className="text-[10px] text-blue-300/40 uppercase tracking-widest mt-1">
                ARC - Almeida Revista e Corrigida
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/5">
              <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="p-1.5 hover:bg-white/10 rounded-lg"><Minus size={16} /></button>
              <span className="text-[10px] font-bold px-2 text-gray-500">{fontSize}PX</span>
              <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-1.5 hover:bg-white/10 rounded-lg"><Plus size={16} /></button>
            </div>

            <button onClick={() => loadChapter(true)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>

            <button onClick={handleCopyText} className="p-2 text-gray-400 hover:text-white transition-colors">
              <Copy size={18} />
            </button>

            <button
              onClick={onMarkAsRead}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                isRead 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <CheckCircle2 size={16} />
              <span className="hidden sm:inline">{isRead ? 'LIDO' : 'MARCAR'}</span>
            </button>

            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-16 bg-[#0b161d]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-10 h-10 text-[#2FA4FF] animate-spin" />
              <p className="text-[10px] tracking-[0.2em] text-blue-300/20 uppercase font-bold">Aguarde</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center p-12 bg-black/20 border border-white/5 rounded-3xl mt-20">
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">{error}</p>
              <button
                onClick={() => loadChapter(true)}
                className="px-10 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold tracking-widest transition-all"
              >
                TENTAR NOVAMENTE
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div 
                className="leading-[1.9] whitespace-pre-wrap text-[#e2e8f0] font-serif"
                style={{ fontSize: `${fontSize}px` }}
              >
                {chapterText}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 md:p-8 border-t border-white/5 bg-[#122835]">
          <button
            onClick={() => setCurrentChapter(c => Math.max(1, c - 1))}
            disabled={currentChapter === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 bg-black/30 hover:bg-black/50 disabled:opacity-5 rounded-2xl transition-all text-xs font-bold tracking-widest text-gray-400"
          >
            <ChevronLeft size={18} /> ANTERIOR
          </button>

          <div className="hidden sm:block">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
              {currentChapter} / {totalChapters}
            </p>
          </div>

          <button
            onClick={() => setCurrentChapter(c => Math.min(totalChapters, c + 1))}
            disabled={currentChapter === totalChapters || loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 text-[#2FA4FF] hover:bg-blue-500/20 disabled:opacity-5 rounded-2xl transition-all text-xs font-bold tracking-widest"
          >
            PROXIMO <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
