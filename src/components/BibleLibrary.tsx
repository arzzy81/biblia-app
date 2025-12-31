import { useState } from 'react';
import { X, Book, ChevronDown, ChevronUp } from 'lucide-react';

interface BookInfo {
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

interface BibleLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  books: BookInfo[];
  onSelectChapter: (book: string, chapter: number) => void;
}

export function BibleLibrary({ isOpen, onClose, books, onSelectChapter }: BibleLibraryProps) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');

  if (!isOpen) return null;

  const filteredBooks = books.filter(b => b.testament === activeTab);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6">
      {/* FUNDO COM DESFOQUE */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
        onClick={onClose} 
      />

      {/* JANELA DA BIBLIOTECA */}
      <div className="relative w-full h-full max-w-4xl bg-[#0b161d] shadow-2xl md:rounded-2xl flex flex-col overflow-hidden border border-white/10">
        
        {/* CABEÇALHO */}
        <div className="p-6 bg-[#122835] border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Book className="text-[#2FA4FF]" size={24} />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Bíblia Sagrada</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>

        {/* SELETOR DE TESTAMENTO */}
        <div className="flex border-b border-white/5 bg-[#0b161d]">
          <button 
            onClick={() => setActiveTab('old')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'old' ? 'text-[#2FA4FF] border-b-2 border-[#2FA4FF] bg-white/5' : 'text-gray-500'
            }`}
          >
            Antigo Testamento
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'new' ? 'text-[#2FA4FF] border-b-2 border-[#2FA4FF] bg-white/5' : 'text-gray-500'
            }`}
          >
            Novo Testamento
          </button>
        </div>

        {/* LISTA DE LIVROS E CAPÍTULOS */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0b161d] custom-scrollbar">
          <div className="grid grid-cols-1 gap-2">
            {filteredBooks.map((book) => (
              <div key={book.name} className="border border-white/5 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setSelectedBook(selectedBook === book.name ? null : book.name)}
                  className={`w-full flex justify-between items-center p-4 transition-colors ${
                    selectedBook === book.name ? 'bg-[#122835] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold">{book.name}</span>
                  {selectedBook === book.name ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>

                {/* GRADE DE CAPÍTULOS (SÓ APARECE SE O LIVRO FOR SELECIONADO) */}
                {selectedBook === book.name && (
                  <div className="p-4 bg-black/20 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 animate-in fade-in slide-in-from-top-2">
                    {Array.from({ length: book.chapters }, (_, i) => i + 1).map((cap) => (
                      <button
                        key={cap}
                        onClick={() => onSelectChapter(book.name, cap)}
                        className="aspect-square flex items-center justify-center rounded-lg bg-[#122835] border border-white/10 text-gray-300 hover:bg-[#2FA4FF] hover:text-white transition-all text-sm font-bold"
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
