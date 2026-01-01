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

  // Lógica de busca funcional (case insensitive)
  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay (Fundo escuro) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => {
          setSelectedBook(null);
          onClose();
        }}
      />

      {/* Painel Lateral (Drawer) */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-gradient-to-br from-[#0b1f2a] to-[#2a0f2f] border-l border-white/20 shadow-2xl z-50 flex flex-col transition-transform duration-300">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0b1f2a]/95 backdrop-blur-xl z-10">
          <h2 className="text-xl md:text-2xl flex items-center gap-3 font-semibold text-white">
            <BibleIcon className="w-6 h-6 text-[#2FA4FF]" />
            {selectedBook ? selectedBook.name : 'Bíblia Completa'}
          </h2>
          <button
            onClick={() => {
              if (selectedBook) setSelectedBook(null);
              else onClose();
            }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          >
            {selectedBook ? (
              <ChevronRight className="w-6 h-6 text-white/70 rotate-180" />
            ) : (
              <X className="w-6 h-6 text-white/70" />
            )}
          </button>
        </div>

        {/* Conteúdo Principal (Lista) */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {!selectedBook ? (
            <div className="space-y-6">
              
              {/* --- BARRA DE PESQUISA NOVA E CORRIGIDA --- */}
              <div className="relative group">
                {/* Ícone da Lupa */}
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2FA4FF] transition-colors duration-300" />
                
                {/* Input de Texto */}
                <input
                  type="text"
                  placeholder="Pesquisar livro (ex: João)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 text-white placeholder:text-white/30 rounded-xl py-4 pl-12 pr-4 border border-white/10 outline-none focus:border-[#2FA4FF]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#2FA4FF]/20 transition-all duration-300 shadow-inner"
                />
              </div>

              {/* Lista de Livros Filtrada */}
              <div className="grid grid-cols-1 gap-3">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <button
                      key={book.name}
                      onClick={() => setSelectedBook(book)}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-[#2FA4FF]/30 hover:shadow-lg hover:shadow-[#2FA4FF]/5 hover:translate-x-1 transition-all duration-300 group"
                    >
                      <span className="text-[#DADADA] font-medium text-lg group-hover:text-white transition-colors">
                        {book.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/30 uppercase tracking-widest font-semibold px-2 py-1 rounded bg-black/20">
                          {book.testament === 'old' ? 'AT' : 'NT'}
                        </span>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#2FA4FF] transition-colors" />
                      </div>
                    </button>
                  ))
                ) : (
                  // Estado Vazio (Sem resultados)
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                    <Search className="w-12 h-12 mb-4 text-white/20" />
                    <p className="text-white/60 text-lg">Nenhum livro encontrado</p>
                    <p className="text-xs text-white/30 mt-1">Verifique a ortografia</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Visualização dos Capítulos
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#2FA4FF] uppercase tracking-[0.2em] font-bold">
                  Capítulos disponíveis
                </p>
                <span className="text-xs text-white/30 font-mono">
                  Total: {selectedBook.chapters}
                </span>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((cap) => (
                  <button
                    key={cap}
                    onClick={() => onSelectChapter(selectedBook.name, cap)}
                    className="aspect-square flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-[#DADADA] hover:bg-[#2FA4FF] hover:text-white hover:border-[#2FA4FF] hover:shadow-[0_0_15px_rgba(47,164,255,0.4)] hover:-translate-y-1 transition-all duration-200"
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
           <div className="p-4 bg-[#2FA4FF]/10 rounded-xl border border-[#2FA4FF]/20 flex gap-3 items-start">
              <span className="text-lg">💡</span>
              <p className="text-xs text-[#DADADA]/90 leading-relaxed">
                <strong className="text-[#2FA4FF] block mb-1">Dica de Navegação</strong>
                Use a barra de pesquisa para encontrar rapidamente livros como "Gênesis" ou "Apocalipse". Clique no livro para ver os capítulos.
              </p>
           </div>
        </div>
      </div>
    </>
  );
}
