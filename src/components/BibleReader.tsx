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

export function BibleReader({ isOpen, onClose, book, chapter, totalChapters, isRead, onMarkAsRead }: BibleReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(chapter);
  const [chapterText, setChapterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(19);

  useEffect(() => {
    if (isOpen) setCurrentChapter(chapter);
  }, [isOpen, chapter]);

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
    <div className="fixed inset-0 z-[999] flex items-center justify-center animate-in fade-in duration-300">
      {/* Overlay com desfoque profundo (Estilo Apple) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[12px]" 
        onClick={onClose} 
      />
      
      {/* Container de Vidro Líquido */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-4xl bg-[#0b1f2a]/70 backdrop-blur-[25px] md:rounded-3xl flex flex-col overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <header className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-400" size={24} />
            <div>
              <h2 className="text-white font-bold text-lg">{book} {currentChapter}</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">NVI - Nova Versão Internacional</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full" onClick={() => setFontSize(s => Math.max(12, s-2))}><Minus size={18}/></button>
            <span className="text-xs text-gray-400">{fontSize}px</span>
            <button className="p-2 hover:bg-white/10 rounded-full" onClick={() => setFontSize(s => Math.min(30, s+2))}><Plus size={18}/></button>
            <button className="p-2 hover:bg-white/10 rounded-full text-blue-400" onClick={onMarkAsRead}>
              <CheckCircle2 className={isRead ? "fill-blue-400 text-black" : ""} size={22} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full text-white/60" onClick={onClose}><X size={24}/></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <Loader2 className="animate-spin" size={40} />
              <p className="tracking-widest text-xs">CARREGANDO TEXTO...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-10">{error}</div>
          ) : (
            <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }} className="text-gray-100 font-serif whitespace-pre-wrap max-w-2xl mx-auto pb-20">
              {chapterText}
            </div>
          )}
        </main>

        <footer className="p-5 border-t border-white/10 flex justify-between items-center bg-black/20">
          <button 
            disabled={currentChapter <= 1}
            onClick={() => setCurrentChapter(c => c - 1)}
            className="flex items-center gap-2 text-sm text-gray-400 disabled:opacity-10"
          >
            <ChevronLeft size={20} /> Anterior
          </button>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Capítulo {currentChapter} de {totalChapters}</span>
          <button 
            disabled={currentChapter >= totalChapters}
            onClick={() => setCurrentChapter(c => c + 1)}
            className="flex items-center gap-2 text-sm text-gray-400 disabled:opacity-10"
          >
            Próximo <ChevronRight size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}
