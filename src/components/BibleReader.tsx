// src/components/BibleReader.tsx
import { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Copy,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
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

  useEffect(() => {
    if (isOpen) {
      setCurrentChapter(chapter);
    }
  }, [isOpen, chapter]);

  useEffect(() => {
    if (isOpen) {
      loadChapter();
    }
  }, [isOpen, currentChapter, book]);

  async function loadChapter() {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchBibleChapter(book, currentChapter);
      setChapterText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyText() {
    await navigator.clipboard.writeText(chapterText);
    toast.success('Texto copiado');
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[60]" onClick={onClose} />

      <div className="fixed inset-0 md:inset-4 md:max-w-4xl md:mx-auto bg-[#0b1f2a] border border-white/20 rounded-2xl z-[70] flex flex-col shadow-2xl">
        <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex gap-3 items-center">
            <BookOpen className="text-blue-400" />
            <div>
              <h2 className="font-bold text-white">{book} {currentChapter}</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">NVI - Local</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button className="p-1 hover:bg-white/10 rounded" onClick={() => setFontSize(f => Math.max(12, f - 2))}><Minus size={18} /></button>
            <span className="text-xs w-8 text-center">{fontSize}px</span>
            <button className="p-1 hover:bg-white/10 rounded" onClick={() => setFontSize(f => Math.min(30, f + 2))}><Plus size={18} /></button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button className="p-1 hover:bg-white/10 rounded text-blue-400" onClick={onMarkAsRead}>
              <CheckCircle2 size={20} className={isRead ? "fill-blue-400 text-[#0b1f2a]" : ""} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded" onClick={onClose}><X size={20} /></button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-black/20">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="animate-spin text-blue-400" size={40} />
              <p className="text-gray-400">Carregando Escrituras...</p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={loadChapter} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <RefreshCw size={16} /> Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && (
            <div 
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }} 
              className="text-gray-200 font-serif whitespace-pre-wrap pb-10"
            >
              {chapterText}
            </div>
          )}
        </main>

        <footer className="p-4 border-t border-white/10 flex justify-between items-center bg-white/5">
          <button 
            disabled={currentChapter === 1}
            className="flex items-center gap-1 text-sm disabled:opacity-30"
            onClick={() => setCurrentChapter(c => Math.max(1, c - 1))}
          >
            <ChevronLeft size={18} /> Anterior
          </button>
          
          <span className="text-xs text-gray-400 uppercase">Capítulo {currentChapter} de {totalChapters}</span>
          
          <button 
            disabled={currentChapter === totalChapters}
            className="flex items-center gap-1 text-sm disabled:opacity-30"
            onClick={() => setCurrentChapter(c => Math.min(totalChapters, c + 1))}
          >
            Próximo <ChevronRight size={18} />
          </button>
        </footer>
      </div>
    </>
  );
}
