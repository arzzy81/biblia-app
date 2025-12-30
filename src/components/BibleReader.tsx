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
import { fetchBibleChapter } from '../utils/bibleApi';
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
    if (isOpen) {
      setCurrentChapter(chapter);
    }
  }, [isOpen, chapter]);

  useEffect(() => {
    if (isOpen) {
      loadChapter();
    }
  }, [isOpen, currentChapter]);

  const getCacheKey = () => `bible_cache_${book}_${currentChapter}`;

  async function loadChapter(forceReload = false) {
    setLoading(true);
    setError(null);

    try {
      if (!forceReload) {
        const cached = localStorage.getItem(getCacheKey());
        if (cached) {
          const { text, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
            setChapterText(text);
            setLoading(false);
            return;
          }
        }
      }

      const text = await fetchBibleChapter(book, currentChapter, 'ARC');
      setChapterText(text);

      localStorage.setItem(
        getCacheKey(),
        JSON.stringify({
          text,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar o capítulo'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(chapterText);
      toast.success('Texto copiado com sucesso');
    } catch {
      toast.error('Erro ao copiar o texto');
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 md:inset-4 md:max-w-4xl md:mx-auto md:my-auto bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] border border-white/20 md:rounded-2xl shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2FA4FF]" />
            <div>
              <h2 className="text-lg">
                {book} {currentChapter}
              </h2>
              <p className="text-xs text-[#DADADA]">
                ARC – Almeida Revista e Corrigida
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="p-1.5 hover:bg-white/10 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xs px-2">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="p-1.5 hover:bg-white/10 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => loadChapter(true)}
              className="p-2 hover:bg-white/10 rounded"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={handleCopyText}
              disabled={!chapterText}
              className="p-2 hover:bg-white/10 rounded"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={onMarkAsRead}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                isRead
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isRead ? 'Lido' : 'Marcar'}
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#2FA4FF] animate-spin" />
              <span className="ml-3 text-[#DADADA]">
                Carregando capítulo...
              </span>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && chapterText && (
            <div
              className="max-w-3xl mx-auto whitespace-pre-wrap text-[#DADADA]"
              style={{ fontSize, lineHeight: 1.8 }}
            >
              {chapterText}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={() =>
              currentChapter > 1 &&
              setCurrentChapter(currentChapter - 1)
            }
            disabled={currentChapter === 1}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm text-[#DADADA]">
            Capítulo {currentChapter} de {totalChapters}
          </span>

          <button
            onClick={() =>
              currentChapter < totalChapters &&
              setCurrentChapter(currentChapter + 1)
            }
            disabled={currentChapter === totalChapters}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
