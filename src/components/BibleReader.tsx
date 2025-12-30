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
import { toast } from 'sonner@2.0.3';

interface BibleReaderProps {
  isOpen: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
  totalChapters: number;
  isRead: boolean;
  onMarkAsRead: () => void;
}

type BibleJSON = {
  [book: string]: {
    chapters: string[][];
  };
};

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
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (isOpen) setCurrentChapter(chapter);
  }, [isOpen, chapter]);

  useEffect(() => {
    if (isOpen) loadChapter();
  }, [isOpen, currentChapter]);

  async function loadChapter() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/nvi.json');
      if (!res.ok) throw new Error('Arquivo da Bíblia não encontrado');

      const bible: BibleJSON = await res.json();

      const bookData = bible[book];
      if (!bookData) throw new Error(`Livro não encontrado: ${book}`);

      const verses = bookData.chapters[currentChapter - 1];
      if (!verses) throw new Error('Capítulo não encontrado');

      const text = verses
        .map((v, i) => `${i + 1}. ${v}`)
        .join('\n');

      setChapterText(text);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar capítulo'
      );
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
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />

      <div className="fixed inset-0 md:inset-4 md:max-w-4xl md:mx-auto bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] border border-white/20 rounded-2xl z-50 flex flex-col">
        <header className="p-4 border-b border-white/10 flex justify-between">
          <div className="flex gap-3 items-center">
            <BookOpen className="text-blue-400" />
            <div>
              <h2>{book} {currentChapter}</h2>
              <p className="text-xs text-gray-300">
                NVI – Nova Versão Internacional
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setFontSize(f => Math.max(12, f - 2))}><Minus /></button>
            <span>{fontSize}px</span>
            <button onClick={() => setFontSize(f => Math.min(26, f + 2))}><Plus /></button>
            <button onClick={loadChapter}><RefreshCw /></button>
            <button onClick={handleCopyText}><Copy /></button>
            <button onClick={onMarkAsRead}><CheckCircle2 /></button>
            <button onClick={onClose}><X /></button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {loading && <Loader2 className="animate-spin" />}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && (
            <pre style={{ fontSize, lineHeight: 1.8 }} className="whitespace-pre-wrap">
              {chapterText}
            </pre>
          )}
        </main>

        <footer className="p-4 border-t border-white/10 flex justify-between">
          <button onClick={() => setCurrentChapter(c => Math.max(1, c - 1))}>
            <ChevronLeft /> Anterior
          </button>
          <span>Capítulo {currentChapter} de {totalChapters}</span>
          <button onClick={() => setCurrentChapter(c => Math.min(totalChapters, c + 1))}>
            Próximo <ChevronRight />
          </button>
        </footer>
      </div>
    </>
  );
}
