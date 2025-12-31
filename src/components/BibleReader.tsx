import { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, CheckCircle2, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBibleChapter } from '../utils/bibleApi';

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
  const [chapterText, setChapterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(18);

  // Atualiza o capítulo quando o modal abre
  useEffect(() => {
    if (isOpen) setCurrentChapter(chapter);
  }, [isOpen, chapter]);

  // Carrega o texto da Bíblia
  useEffect(() => {
    if (isOpen) {
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          const text = await fetchBibleChapter(book, currentChapter);
          setChapterText(text);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [isOpen, currentChapter, book]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {/* Container Principal - Fundo Preto Sólido */}
      <div className="relative w-full h-full max-w-4xl bg-black flex flex-col overflow-hidden md:border-x md:border-white/10">
        
        {/* Header - Fundo Escuro Sólido */}
        <header className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0b1f2a]">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-400" size={24} />
            <div>
              <h2 className="text-white font-bold text-lg leading-none">{book} {currentChapter}</h2>
              <p className="text-[10px] text-gray-500 uppercase mt-1">NVI - Nova Versão Internacional</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded text-gray-400" onClick={() => setFontSize(s => Math.max(12, s-2))}><Minus size={18}/></button>
            <button className="p-2 hover:bg-white/10 rounded text-gray-400" onClick={() => setFontSize(s => Math.min(32, s+2))}><Plus size={18}/></button>
            <button 
              className={`p-2 rounded transition-colors ${isRead ? 'text-green-400' : 'text-gray-400'}`} 
              onClick={onMarkAsRead}
            >
              <CheckCircle2 size={24} className={isRead ? "fill-green-400/20" : ""} />
            </button>
            <button className="p-2 hover:bg-red-500/20 text-white ml-2" onClick={onClose}>
              <X size={28}/>
            </button>
          </div>
        </header>

        {/* Área do Texto - Fundo Preto Sólido */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="animate-spin text-blue-400" size={40} />
              <p className="text-gray-500 text-sm">Carregando capítulo...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-6 text-center">
              <div className="text-red-400 border border-red-500/20 p-4 rounded bg-red-500/5">
                {error}
              </div>
            </div>
          ) : (
            <div 
              style={{ fontSize: `${fontSize}px` }} 
              className="text-gray-200 leading-[1.8] font-serif whitespace-pre-wrap max-w-2xl mx-auto pb-20"
            >
              {chapterText}
            </div>
          )}
        </main>

        {/* Footer - Fundo Escuro Sólido */}
        <footer className="p-4 border-t border-white/10 flex justify-between items-center bg-[#0b1f2a]">
          <button 
            disabled={currentChapter <= 1}
            onClick={() => {
              setCurrentChapter(c => c - 1);
              document.querySelector('main')?.scrollTo(0,0);
            }}
            className="flex items-center gap-2 text-sm text-gray-400 disabled:opacity-20 px-3 py-2"
          >
            <ChevronLeft size={20} /> Anterior
          </button>
          
          <span className="text-xs text-gray-500 font-medium">
            CAPÍTULO {currentChapter} DE {totalChapters}
          </span>

          <button 
            disabled={currentChapter >= totalChapters}
            onClick={() => {
              setCurrentChapter(c => c + 1);
              document.querySelector('main')?.scrollTo(0,0);
            }}
            className="flex items-center gap-2 text-sm text-gray-400 disabled:opacity-20 px-3 py-2"
          >
            Próximo <ChevronRight size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}
