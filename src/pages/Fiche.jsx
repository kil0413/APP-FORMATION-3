import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, CheckCircle2, Bookmark, Flame, Shield, Info, AlertTriangle, Zap, Target } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import PDFViewer from '../components/ui/PDFViewer';

export default function Fiche() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fiches, categories, quizzes } = useFicheStore();
  
  const currentFiche = fiches.find(f => f.id === id) || fiches[0];
  const quiz = quizzes.find(q => q.fiche_id === id);
  const currentCategory = categories.find(c => c.id === currentFiche.category_id);
  const categoryName = currentCategory?.name || 'Formation';
  
  const [activePage, setActivePage] = useState(1);
  const [completed, setCompleted] = useState(user.completed_fiches?.includes(id) || false);
  const scrollContainerRef = useRef(null);

  const totalPages = 3;

  // Configuration des couleurs extraites de mockData
  const currentTheme = {
    header: currentCategory?.theme_header || '#fae78f',
    bg: currentCategory?.theme_bg || '#FBFAEF',
    text: ['c2', 'c3', 'c1'].includes(currentFiche.category_id) ? (currentFiche.category_id === 'c3' ? 'black' : 'white') : 'black'
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pageHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const currentPage = Math.round(scrollTop / pageHeight) + 1;
      if (currentPage !== activePage) {
        setActivePage(currentPage);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      addXp(10);
      completeFiche(id);
      if (!quiz) {
        setTimeout(() => {
          alert("Félicitations ! Vous avez complété la leçon.\n+10 XP 🎉");
          navigate(-1);
        }, 500);
      }
    }
  };

  const scrollToPage = (pageNum) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: (pageNum - 1) * container.clientHeight,
        behavior: 'smooth'
      });
    }
  };

  if (currentFiche.id === 'f4') {
    return (
      <div 
        className="h-screen w-full max-w-[390px] mx-auto flex flex-col overflow-hidden font-['Inter',_sans-serif]"
        style={{ backgroundColor: currentTheme.bg }}
      >
        
        {/* HEADER */}
        <header 
          className="pt-6 pb-4 px-4 text-center relative shrink-0 shadow-sm"
          style={{ backgroundColor: currentTheme.header }}
        >
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-4 top-8 transition-colors"
            style={{ color: currentTheme.text === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
          >
            <ChevronLeft size={28} />
          </button>
          <h1 
            className="text-2xl font-black tracking-tight"
            style={{ color: currentTheme.text }}
          >
            Fiches de Révision
          </h1>
          <p 
            className="text-sm font-bold mt-1"
            style={{ color: currentTheme.text === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
          >
            {currentFiche.title}
          </p>
        </header>

        {/* INDICATOR AREA */}
        <div 
          className="py-4 flex flex-col items-center gap-2 shrink-0 z-10"
          style={{ backgroundColor: currentTheme.bg }}
        >
          <div className="flex gap-2 items-center">
            {[1, 2, 3].map((p) => (
              <div 
                key={p}
                className={`transition-all duration-300 rounded-full ${
                  activePage === p ? 'w-8 h-2.5 bg-[#405663]' : 'w-2.5 h-2.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Fiche {activePage} sur {totalPages}</span>
        </div>

        {/* MAIN SWIPER AREA */}
        <main 
          className="flex-1 relative flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: currentTheme.bg }}
        >
          
          {/* Vertical Scroll Container with Snap (Hidden Scrollbar) */}
          <div 
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            style={{ 
              msOverflowStyle: 'none', 
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            
            {/* PAGE 1 */}
            <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center p-0">
              <div className="w-full h-full overflow-hidden flex flex-col">
                <img src="/assets/fiches/page1.jpg" alt={`${currentFiche.title} - Page 1`} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* PAGE 2 */}
            <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center p-0">
              <div className="w-full h-full overflow-hidden flex flex-col">
                <img src="/assets/fiches/page2.jpg" alt={`${currentFiche.title} - Page 2`} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* PAGE 3 */}
            <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center p-0">
              <div className="w-full h-full overflow-hidden flex flex-col">
                <img src="/assets/fiches/page3.jpg" alt={`${currentFiche.title} - Page 3`} className="w-full h-full object-contain" />
              </div>
            </div>

          </div>

        </main>

        {/* FOOTER */}
        <footer 
          className="py-3 px-4 border-t border-gray-100 text-center shrink-0"
          style={{ backgroundColor: currentTheme.bg }}
        >
          <div className="flex flex-col gap-3">
            <button
              onClick={handleComplete}
              disabled={completed}
              className={`w-full flex items-center justify-center gap-3 rounded-[1.5rem] py-5 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl ${
                completed 
                ? 'bg-[#34C759] text-white shadow-green-500/20' 
                : 'bg-[#1A1A2E] text-white shadow-black/30'
              }`}
            >
              {completed ? <><CheckCircle2 size={24} /> Fiche Assimilée</> : 'Valider la leçon (+10 XP)'}
            </button>
            
            {completed && quiz && (
              <button
                onClick={() => navigate(`/quiz/${id}`)}
                className="w-full flex items-center justify-center gap-3 rounded-[1.5rem] py-5 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl bg-[#CC1A1A] text-white shadow-red-500/20"
              >
                <Zap size={24} /> Lancer le Quiz
              </button>
            )}
          </div>
        </footer>

        {/* Global CSS for No Scrollbar */}
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { 
            scrollbar-width: none; 
            -ms-overflow-style: none;
          }
        ` }} />
      </div>
    );
  }

  // Fallback pour les fiches standards
  // ... rest of the standard component logic (removed for brevity but I should keep it for the complete file)
  return (
    <div className="min-h-screen pb-24 relative" style={{ backgroundColor: currentTheme.bg }}>
      <div 
        className="fixed top-0 z-50 w-full max-w-[390px] pt-2 pb-2 px-4 shadow-sm border-b border-gray-100"
        style={{ backgroundColor: currentTheme.header }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 active:scale-95"
            style={{ color: currentTheme.text }}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-sm font-black truncate uppercase" style={{ color: currentTheme.text }}>{currentFiche.title}</h1>
            <div className="flex gap-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: currentTheme.text === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>
              <span>{categoryName}</span>
              <span>•</span>
              <span className="text-orange-300 font-black">{currentFiche.difficulty}</span>
            </div>
          </div>
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 active:scale-95"
            style={{ color: currentTheme.text }}
          >
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      <main className="px-5 pt-24 pb-32 flex flex-col gap-8">
        {currentFiche.file_data ? (
           <div className="w-full flex justify-center">
              {currentFiche.file_type === 'pdf' ? (
                 <PDFViewer base64Data={currentFiche.file_data} />
              ) : (
                 <img src={currentFiche.file_data} alt={currentFiche.title} className="w-full h-auto object-contain rounded-2xl shadow-xl border border-gray-100" />
              )}
           </div>
        ) : (!currentFiche.sections || currentFiche.sections.length === 0) ? (
          <div className="py-20 text-center">
             <p className="text-gray-400 font-bold italic">Cette fiche ne contient pas encore de texte.</p>
          </div>
        ) : currentFiche.sections.map((section, idx) => (
          <section key={idx} className="flex flex-col gap-3">
            <h2 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2 italic">
              <span className="h-6 w-1 bg-[#CC1A1A] rounded-full mr-1" />
              {section.title}
            </h2>
            
            {section.type === 'definition' && (
              <div className="flex flex-col gap-3">
                {section.content && <p className="text-[#3b3b44] leading-relaxed font-bold">{section.content}</p>}
                {section.items && (
                  <ul className="grid grid-cols-1 gap-2 mt-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-[#CC1A1A]" />
                        <span className="font-black text-[#1A1A2E] text-sm italic">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.steps && (
                  <div className="flex flex-col gap-2 mt-2">
                    {section.steps.map((step, i) => (
                       <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm font-black text-[#1A1A2E] text-xs">
                         {step}
                       </div>
                    ))}
                  </div>
                )}
                {section.warning && (
                  <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-black border border-red-100 flex items-start gap-3">
                    <AlertTriangle size={18} className="shrink-0" />
                    {section.warning}
                  </div>
                )}
              </div>
            )}

            {section.type === 'keypoints' && (
              <div className="flex flex-col gap-3">
                <ul className="flex flex-col gap-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-4 items-center bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-md transition-all active:scale-[0.98]">
                      <CheckCircle2 className="text-[#34C759] shrink-0" size={24} />
                      <span className="text-[#1A1A2E] leading-tight font-black text-sm italic">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.type === 'remember' && (
              <div className="rounded-[2.5rem] bg-[#1A1A2E] p-8 mt-4 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Target size={100} />
                </div>
                <h4 className="text-[10px] font-black uppercase text-red-500 mb-2 tracking-widest italic">À RETENIR</h4>
                <p className="font-black leading-tight text-lg tracking-tighter italic">{section.content}</p>
              </div>
            )}
          </section>
        ))}
      </main>

      <div 
        className="fixed bottom-0 z-50 w-full max-w-[390px] p-6 border-t border-gray-100 safe-area-bottom pb-8"
        style={{ backgroundColor: currentTheme.bg }}
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`w-full flex items-center justify-center gap-3 rounded-[1.5rem] py-5 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-2xl ${
              completed 
              ? 'bg-[#34C759] text-white shadow-green-500/20' 
              : 'bg-[#1A1A2E] text-white shadow-black/30'
            }`}
          >
            {completed ? <><CheckCircle2 size={24} /> Fiche Assimilée</> : 'Valider la leçon (+10 XP)'}
          </button>

          {completed && quiz && (
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className="w-full flex items-center justify-center gap-3 rounded-[1.5rem] py-5 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl bg-[#CC1A1A] text-white shadow-red-500/20"
            >
              <Zap size={24} /> Lancer le Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
