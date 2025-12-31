import { useState } from 'react';
import { X, Book as BibleIcon, Search, ChevronRight } from 'lucide-react';

interface Book {
  name: string;
  chapters: number;
  testament?: string;
}

interface BibleLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectChapter: (bookName: string, chapter: number) => void;
}

export function BibleLibrary({ isOpen, onClose, books, onSelectChapter }: BibleLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Filtra os livros conforme a pesquisa
  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay (Mesmo efeito de desfoque das configurações) */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => {
          setSelectedBook(null);
          onClose();
        }}
      />

      {/* Bible Panel (Mesmo estilo e gradiente do SettingsPanel) */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] border-l border-white/20 shadow-2xl z-50 flex flex-col">
        
        {/* Header (Mantendo o padrão Visual) */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] z-10">
          <h2 className="text-xl md:text-2xl flex items-center gap-3 font-semibold">
            <BibleIcon className="w-6 h-6 text-[#2FA4FF]" />
            {selectedBook ? selectedBook.name : 'Bíblia Completa'}
          </h2>
          <button
            onClick={() => {
              if (selectedBook) setSelectedBook(null);
              else onClose();
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {selectedBook ? <ChevronRight className="w-5 h-5 rotate-180" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!selectedBook ? (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Pesquisar livro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#2FA4FF] transition-all"
                />
              </div>

              {/* Lista de Livros (Estilo Cards das Configurações) */}
              <div className="grid grid-cols-1 gap-2">
                {filteredBooks.map((book) => (
                  <button
                    key={book.name}
                    onClick={() => setSelectedBook(book)}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#2FA4FF]/50 transition-all group"
                  >
                    <span className="text-[#DADADA] group-hover:text-white transition-colors">{book.name}</span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#2FA4FF]" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-[#DADADA] uppercase tracking-wider">Selecione o Capítulo:</p>
              
              {/* Grade de Capítulos (Estilo moderno e limpo) */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((cap) => (
                  <button
                    key={cap}
                    onClick={() => onSelectChapter(selectedBook.name, cap)}
                    className="aspect-square flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-gradient-to-r hover:from-[#2FA4FF] hover:to-[#8B5CF6] hover:border-transparent transition-all"
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Informativo (Mesmo estilo do final das configurações) */}
        <div className="p-6 border-t border-white/10 bg-black/20">
           <div className="p-4 bg-[#2FA4FF]/10 rounded-lg border border-[#2FA4FF]/30">
              <p className="text-[11px] text-[#DADADA] leading-relaxed">
                💡 <strong>Dica:</strong> Selecione um livro e o capítulo desejado para abrir o leitor digital imersivo.
              </p>
           </div>
        </div>
      </div>
    </>
  );
}
