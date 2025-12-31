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
    // CAMADA 1: Ocupa a tela toda. O fundo é preto sólido para garantir que NADA do app apareça.
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
      
      {/* CAMADA 2: O quadro de leitura. Ele tem uma cor sólida (não transparente). */}
      <div className="relative w-full h-full max-w-4xl bg-[#0b1f2a] flex flex-col shadow-2xl">
        
        {/* CABEÇALHO: Fundo sólido para não vazar texto */}
        <header className="p-4 border-b border-white/10 flex justify-between items-center bg-[#162c38]">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-400" size={24} />
            <div>
              <h2 className="text-white font-bold text-lg leading-none">{book} {currentChapter}</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Leitura Oficial NVI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-black/30 rounded-lg p-1">
              <button className="p-2 hover:bg-white/10 text-gray-400" onClick={() => setFontSize(s => Math.max(12, s-2))}><Minus size={18}/></button>
              <button className="p-2 hover:bg-white/10 text-gray-400" onClick={() => setFontSize(s => Math.min(32, s+2))}><Plus size={18}/></button>
            </div>
            
            <button 
              className={`p-2 transition-colors ${isRead ? 'text-green-400' : 'text-gray-500'}`}
              onClick={onMarkAsRead}
            >
              <CheckCircle2 size={26} className={isRead ? "fill-green-400/20" : ""} />
            </button>

            <button className="p-2 text-white/70 hover:text-white" onClick={onClose}>
              <X size={30}/>
            </button>
          </div>
        </header>

        {/* ÁREA DO TEXTO: Aqui é o segredo. Fundo TOTALMENTE SÓLIDO. */}
        <main className="flex-1 overflow-y-auto p-6 md:p-16 bg-[#0b1f2a]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <Loader2 className="animate-spin" size={40} />
              <p>Buscando escrituras...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 text-red-400 bg-red-900/10 rounded-xl border border-red-900/20">
              {error}
            </div>
          ) : (
            <div 
              style={{ fontSize: `${fontSize}px` }} 
              className="text-gray-100 leading-[1.8] font-serif whitespace-pre-wrap max-w-2xl mx-auto pb-32"
            >
              {/* O texto agora está sobre um fundo azul-petróleo escuro totalmente sólido */}
              {chapterText}
            </div>
          )}
        </main>

        {/* RODAPÉ: Fundo sólido */}
        <footer className="p-4 border-t border-white/10 flex justify-between items-center bg-[#162c38]">
          <button 
            disabled={currentChapter <= 1}
            onClick={() => {
              setCurrentChapter(c => c - 1);
              document.querySelector('main')?.scrollTo(0,0);
            }}
            className="flex items-center gap-2 text-sm text-gray-300 disabled:opacity-20 px-4 py-2 bg-black/20 rounded-lg"
          >
            <ChevronLeft size={20} /> Anterior
          </button>
          
          <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">
            Capítulo {currentChapter} de {totalChapters}
          </span>

          <button 
            disabled={currentChapter >= totalChapters}
            onClick={() => {
              setCurrentChapter(c => c + 1);
              document.querySelector('main')?.scrollTo(0,0);
            }}
            className="flex items-center gap-2 text-sm text-gray-300 disabled:opacity-20 px-4 py-2 bg-black/20 rounded-lg"
          >
            Próximo <ChevronRight size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}
