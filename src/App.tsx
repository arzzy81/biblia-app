// ... (mantenha todos os seus imports e a lista de 'books' igual até o início da função App)

export default function App() {
  const [readChapters, setReadChapters] = useState<Record<string, Set<number>>>({});
  const [selectedDay, setSelectedDay] = useState<number>(getDayOfYear());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState('');
  const [readerChapter, setReaderChapter] = useState(1);
  const [readerTotalChapters, setReaderTotalChapters] = useState(1);

  // Efeito para travar o scroll do fundo quando o leitor abrir
  useEffect(() => {
    if (isReaderOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isReaderOpen]);

  // ... (mantenha as funções saveProgress, toggleChapter, handleUserNameChange, handleReadNow e handleMarkAsRead exatamente como estão)

  const handleReadNow = (book: string, chapter: number, totalChaps: number) => {
    setReaderBook(book);
    setReaderChapter(chapter);
    setReaderTotalChapters(totalChaps);
    setIsReaderOpen(true);
  };

  const handleMarkAsRead = () => {
    toggleChapter(readerBook, readerChapter);
  };

  // Logica de progresso (mantenha igual)
  const totalChaptersCount = books.reduce((sum, book) => sum + book.chapters, 0);
  const readChaptersCount = Object.values(readChapters).reduce((sum, set) => sum + set.size, 0);
  const readingPercentage = totalChaptersCount > 0 ? Math.round((readChaptersCount / totalChaptersCount) * 100) : 0;
  const dailyReading = getReadingForDay(selectedDay);
  const oldTestamentBooks = books.filter(b => b.testament === "old");
  const newTestamentBooks = books.filter(b => b.testament === "new");

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-[#0b1f2a] to-[#2a0f2f] text-white transition-all duration-500 ${isReaderOpen ? 'blur-sm scale-[0.98]' : ''}`}>
      <Toaster 
        position="top-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #2FA4FF 0%, #8B5CF6 100%)',
            border: 'none',
            color: '#fff',
          },
        }}
      />
      
      {/* Todo o conteúdo principal */}
      <div className="px-4 md:px-12 lg:px-20 py-8 md:py-16">
        {/* Header Section */}
        <header className="mb-12 md:mb-16 max-w-2xl">
          <h1 className="text-[28px] md:text-[46px] leading-[1.2] mb-4 md:mb-6" style={{ fontFamily: "'Crimson Text', serif" }}>
            Um dia por vez.<br />
            Um texto por dia.<br />
            Uma vida transformada.
          </h1>
          <p className="text-[14px] md:text-[18px] leading-[1.5] text-[#DADADA]">
            Quando a Palavra ocupa um lugar diário na rotina, o entendimento é ampliado, 
            a mente é renovada e a vida é conduzida com propósito.
          </p>
        </header>

        {/* Reading Progress */}
        <div className="text-center mb-12 md:mb-20 relative">
          <h2 className="text-[36px] md:text-[72px] mb-3 md:mb-4 bg-gradient-to-r from-[#2FA4FF] to-[#8B5CF6] bg-clip-text text-transparent leading-tight" style={{ fontFamily: "'Crimson Text', serif" }}>
            {userName ? `${userName.toUpperCase()}, VOCÊ JÁ LEU ${readingPercentage}%` : `VOCÊ JÁ LEU ${readingPercentage}%`}
          </h2>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-0 right-0 p-3 hover:bg-white/10 rounded-lg transition-all hover:scale-110"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-[#2FA4FF]" />
          </button>
        </div>

        {/* Daily Reading Card */}
        <div className="mb-12 md:mb-20">
          <DailyReadingCard
            currentDay={selectedDay}
            dailyReading={dailyReading}
            onDayChange={setSelectedDay}
            readChapters={readChapters}
            onToggleChapter={toggleChapter}
            onReadNow={handleReadNow}
          />
        </div>

        {/* ... (O resto do seu conteúdo: Antigo Testamento, Novo Testamento e Footer permanecem os mesmos) ... */}
        
        {/* Renderização das listas de livros aqui */}
        {/* ... */}

      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        onUserNameChange={handleUserNameChange}
      />

      {/* Bible Reader - O segredo está aqui agora */}
      <BibleReader
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        book={readerBook}
        chapter={readerChapter}
        totalChapters={readerTotalChapters}
        isRead={readChapters[readerBook]?.has(readerChapter) || false}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
