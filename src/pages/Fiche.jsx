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
  const { fiches, categories, quizzes, isLoading: isStoreLoading } = useFicheStore();
  const { user, addXp, completeFiche, isLoading: isAuthLoading } = useAuthStore();
  
  const currentFiche = fiches.find(f => f.id === id) || fiches[0];
  
  if (!currentFiche || isStoreLoading || isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F2F2F7]">
         <div className="text-[#CC1A1A] font-black uppercase text-xl animate-pulse italic">Chargement du contenu...</div>
      </div>
    );
  }

  const quiz = quizzes.find(q => q.fiche_id === id);
  const currentCategory = categories.find(c => c.id === currentFiche.category_id);
  const categoryName = currentCategory?.name || 'Formation';
  
  const [activePage, setActivePage] = useState(1);
  const [completed, setCompleted] = useState(user?.completed_fiches?.includes(id) || false);
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
        className="h-screen w-full flex flex-col overflow-hidden font-['Inter',_sans-serif]"
        style={{ backgroundColor: currentTheme.bg }}
      >
        
        {/* HEADER */}
        <header 
          className="pt-6 pb-4 px-4 text-center relative shrink-0 shadow-sm z-20"
          style={{ backgroundColor: currentTheme.header }}
        >
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-6 top-8 transition-colors p-2 hover:bg-black/5 rounded-full"
            style={{ color: currentTheme.text === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
          >
            <ChevronLeft size={32} />
          </button>
          <h1 
            className="text-2xl md:text-3xl font-black tracking-tight"
            style={{ color: currentTheme.text }}
          >
            Fiches de Révision
          </h1>
          <p 
            className="text-sm md:text-base font-bold mt-1"
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
                  activePage === p ? 'w-10 h-2.5 bg-[#405663]' : 'w-2.5 h-2.5 bg-gray-200'
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
            <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center p-0 md:p-4">
              <div className="w-full h-full max-w-4xl overflow-hidden flex flex-col md:rounded-3xl md:shadow-2xl">
                <img src="/assets/fiches/page1.jpg" alt={`${currentFiche.title} - Page 1`} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* PAGE 2 */}
            <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center p-0 md:p-4">
              <div className="w-full h-full max-w-4xl overflow-hidden flex flex-col md:rounded-3xl md:shadow-2xl">
                <img src="/assets/fiches/page2.jpg" alt={`${currentFiche.title} - Page 2`} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* PAGE 3 */}
            <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center p-0 md:p-4">
              <div className="w-full h-full max-w-4xl overflow-hidden flex flex-col md:rounded-3xl md:shadow-2xl">
                <img src="/assets/fiches/page3.jpg" alt={`${currentFiche.title} - Page 3`} className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer 
          className="py-6 px-6 md:px-12 border-t border-gray-100 text-center shrink-0 z-20"
          style={{ backgroundColor: currentTheme.bg }}
        >
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <button
              onClick={handleComplete}
              disabled={completed}
              className={`flex-1 flex items-center justify-center gap-3 rounded-[2rem] py-6 md:py-8 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-2xl ${
                completed 
                ? 'bg-[#34C759] text-white shadow-green-500/20' 
                : 'bg-[#1A1A2E] text-white shadow-black/30'
              }`}
            >
              {completed ? <><CheckCircle2 size={32} /> Fiche Assimilée</> : 'Valider la leçon (+10 XP)'}
            </button>
            
            {completed && quiz && (
              <button
                onClick={() => navigate(`/quiz/${id}`)}
                className="flex-1 flex items-center justify-center gap-3 rounded-[2rem] py-6 md:py-8 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl bg-[#CC1A1A] text-white shadow-red-500/20"
              >
                <Zap size={32} /> Lancer le Quiz
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
  return (
    <div className="min-h-screen relative flex flex-col bg-[#F2F2F7]" style={{ backgroundColor: currentTheme.bg }}>
      {/* Header Responsive */}
      <header 
        className="fixed top-0 z-50 w-full pt-4 pb-4 px-4 md:px-12 shadow-md border-b border-black/5 backdrop-blur-md"
        style={{ backgroundColor: currentTheme.header }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 active:scale-90 transition-transform"
            style={{ color: currentTheme.text }}
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="flex-1 overflow-hidden">
            <h1 className="text-base md:text-2xl font-black truncate uppercase tracking-tighter" style={{ color: currentTheme.text }}>{currentFiche.title}</h1>
            <div className="flex gap-2 text-[9px] md:text-xs font-black uppercase tracking-widest opacity-70" style={{ color: currentTheme.text }}>
              <span>{categoryName}</span>
              <span>•</span>
              <span className="text-red-600">{currentFiche.difficulty}</span>
            </div>
          </div>
          
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 active:scale-95 transition-transform"
            style={{ color: currentTheme.text }}
          >
            <Bookmark size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto pt-32 pb-48 flex flex-col gap-12">
        {currentFiche.file_data ? (
           <div className="w-full flex justify-center px-0">
              {currentFiche.file_type === 'pdf' ? (
                 <PDFViewer base64Data={currentFiche.file_data} />
              ) : (
                 <img src={currentFiche.file_data} alt={currentFiche.title} className="w-full h-auto object-contain md:rounded-[3rem] shadow-2xl md:border-8 border-white" />
              )}
           </div>
        ) : (!currentFiche.sections || currentFiche.sections.length === 0) ? (
          <div className="py-24 text-center px-6">
             <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <Info size={40} className="text-gray-300" />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Contenu en cours de rédaction...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12 px-5 md:px-0">
            {currentFiche.sections.map((section, idx) => (
              <section key={idx} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ delay: `${idx * 100}ms` }}>
            <h2 className="text-2xl md:text-3xl font-black text-[#1A1A2E] flex items-center gap-3 tracking-tighter uppercase italic">
              <span className="h-8 w-2 bg-[#CC1A1A] rounded-full" />
              {section.title}
            </h2>
            
            {section.type === 'definition' && (
              <div className="flex flex-col gap-4">
                {section.content && <p className="text-lg text-[#3b3b44] leading-relaxed font-bold bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">{section.content}</p>}
                {section.items && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-4 bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="h-3 w-3 rounded-full bg-[#CC1A1A] shrink-0" />
                        <span className="font-black text-[#1A1A2E] text-sm md:text-base italic">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.steps && (
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {section.steps.map((step, i) => (
                       <div key={i} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl font-black text-[#1A1A2E] text-sm md:text-base flex gap-4">
                         <span className="text-[#CC1A1A] opacity-30">{i+1}</span>
                         {step}
                       </div>
                    ))}
                  </div>
                )}
                {section.warning && (
                  <div className="mt-8 p-8 bg-red-50 text-red-900 rounded-[2rem] text-sm font-black border-2 border-red-100 flex items-start gap-4 shadow-lg shadow-red-500/5">
                    <AlertTriangle size={24} className="shrink-0 text-red-600" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest opacity-50">Attention / Danger</span>
                      {section.warning}
                    </div>
                  </div>
                )}
              </div>
            )}

            {section.type === 'keypoints' && (
              <div className="flex flex-col gap-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-5 items-center bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl transition-all hover:-translate-y-1">
                      <CheckCircle2 className="text-[#34C759] shrink-0" size={32} />
                      <span className="text-[#1A1A2E] leading-tight font-black text-sm md:text-lg italic tracking-tighter">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.type === 'remember' && (
              <div className="rounded-[3rem] bg-[#1A1A2E] p-10 md:p-14 mt-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Target size={180} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase text-red-500 mb-4 tracking-[0.3em] italic flex items-center gap-2">
                    <Zap size={16} className="fill-current" />
                    À RETENIR IMPÉRATIVEMENT
                  </h4>
                  <p className="font-black leading-tight text-xl md:text-3xl tracking-tighter italic max-w-2xl">{section.content}</p>
                </div>
              </div>
            )}
            </section>
          ))}
          </div>
        )}
      </main>

      {/* Footer Boutons Fixes */}
      <div 
        className="fixed bottom-0 z-50 w-full p-8 md:p-12 border-t border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-md"
        style={{ backgroundColor: currentTheme.bg }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`flex-1 flex items-center justify-center gap-4 rounded-[2rem] py-6 md:py-8 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-2xl ${
              completed 
              ? 'bg-[#34C759] text-white shadow-green-500/20' 
              : 'bg-[#1A1A2E] text-white shadow-black/30'
            }`}
          >
            {completed ? <><CheckCircle2 size={32} /> Fiche Assimilée</> : 'Marquer comme lu (+10 XP)'}
          </button>

          {completed && quiz && (
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className="flex-1 flex items-center justify-center gap-4 rounded-[2rem] py-6 md:py-8 font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl bg-[#CC1A1A] text-white shadow-red-500/20"
            >
              <Zap size={32} /> Lancer le Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
