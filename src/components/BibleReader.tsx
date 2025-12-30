import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Loader2, CheckCircle2, RefreshCw, Copy, Plus, Minus, AlertCircle } from 'lucide-react';
import { fetchBibleChapter, validateBibleText, ValidationResult } from '../utils/geminiApi';
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
  const [chapterText, setChapterText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [fontSize, setFontSize] = useState(16);

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

  // Cache key for localStorage
  const getCacheKey = () => `bible_cache_${book}_${currentChapter}`;

  const loadChapter = async (forceReload = false) => {
    setLoading(true);
    setError(null);
    setValidation(null);

    try {
      // Check cache first
      if (!forceReload) {
        const cached = localStorage.getItem(getCacheKey());
        if (cached) {
          const { text, timestamp } = JSON.parse(cached);
          // Cache valid for 7 days
          if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
            setChapterText(text);
            const validationResult = validateBibleText(text);
            setValidation(validationResult);
            setLoading(false);
            return;
          }
        }
      }

      const text = await fetchBibleChapter(book, currentChapter);
      
      // Validate the text
      const validationResult = validateBibleText(text);
      setValidation(validationResult);
      
      if (!validationResult.isValid && validationResult.error) {
        setError(validationResult.error);
      } else {
        setChapterText(text);
        
        // Cache the result
        localStorage.setItem(getCacheKey(), JSON.stringify({
          text,
          timestamp: Date.now(),
        }));

        // Show warning if any
        if (validationResult.warning) {
          toast.warning('⚠️ Atenção', {
            description: validationResult.warning,
            duration: 5000,
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar capítulo');
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    loadChapter(true);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(chapterText);
      toast.success('📋 Texto copiado!', {
        description: 'O capítulo foi copiado para a área de transferência.',
        duration: 3000,
      });
    } catch (err) {
      toast.error('Erro ao copiar', {
        description: 'Não foi possível copiar o texto.',
        duration: 3000,
      });
    }
  };

  const handlePrevious = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNext = () => {
    if (currentChapter < totalChapters) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Reader Panel */}
      <div className="fixed inset-0 md:inset-4 md:max-w-4xl md:max-h-[90vh] md:mx-auto md:my-auto bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] border border-white/20 md:rounded-2xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2FA4FF]" />
            <div>
              <h2 className="text-lg md:text-xl">
                {book} {currentChapter}
              </h2>
              <p className="text-xs text-[#DADADA]">
                ARC – Almeida Revista e Corrigida
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Controls */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="Diminuir fonte"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xs px-2">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="Aumentar fonte"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleReload}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              title="Recarregar capítulo"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleCopyText}
              disabled={!chapterText || loading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              title="Copiar texto"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Mark as Read Button */}
            <button
              onClick={onMarkAsRead}
              className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                isRead
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/20'
              }`}
              title={isRead ? 'Marcar como não lido' : 'Marcar como lido'}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isRead ? 'Lido' : 'Marcar'}
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#2FA4FF] animate-spin" />
              <span className="ml-3 text-[#DADADA]">Carregando capítulo...</span>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 mb-3">❌ {error}</p>
              <p className="text-xs text-[#DADADA] mb-4">
                Não foi possível carregar o capítulo. Por favor, verifique sua conexão com a internet e tente novamente.
              </p>
              <button
                onClick={() => loadChapter(true)}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && chapterText && (
            <div className="max-w-3xl mx-auto">
              <div 
                className="leading-relaxed whitespace-pre-wrap text-[#DADADA]"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
              >
                {chapterText}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-white/10 bg-black/20">
          <button
            onClick={handlePrevious}
            disabled={currentChapter === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Anterior</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-[#DADADA]">
              Capítulo {currentChapter} de {totalChapters}
            </p>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: Math.min(totalChapters, 10) }, (_, i) => {
                const chapterNum = i + 1;
                return (
                  <div
                    key={chapterNum}
                    className={`w-2 h-2 rounded-full transition-all ${
                      chapterNum === currentChapter
                        ? 'bg-[#2FA4FF] w-4'
                        : 'bg-white/20'
                    }`}
                  />
                );
              })}
              {totalChapters > 10 && (
                <span className="text-xs text-white/40 ml-1">...</span>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentChapter === totalChapters}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
          >
            <span className="hidden md:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}