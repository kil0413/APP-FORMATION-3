import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, CheckCircle2, Bookmark, Flame, Shield, Info, AlertTriangle, Zap, Target, Share2, Maximize2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import PDFViewer from '../components/ui/PDFViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Fiche() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fiches, categories, quizzes, isLoading: isStoreLoading } = useFicheStore();
  const { user, addXp, completeFiche, isLoading: isAuthLoading } = useAuthStore();
  
  const currentFiche = fiches.find(f => f.id === id);
  
  const [activePage, setActivePage] = useState(1);
  const [completed, setCompleted] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (user?.completed_fiches?.includes(id)) {
      setCompleted(true);
    }
  }, [user, id]);

  if (!currentFiche || isStoreLoading || isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F1117]">
         <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 bg-red-600 rounded-2xl animate-spin shadow-2xl flex items-center justify-center shadow-red-500/30">
               <Shield size={32} className="text-white" />
            </div>
            <div className="text-white/40 font-black uppercase text-xs tracking-[0.4em] animate-pulse italic">Préparation du module tactique...</div>
         </div>
      </div>
    );
  }

  const quiz = quizzes.find(q => q.fiche_id === id);
  const currentCategory = categories.find(c => c.id === currentFiche.category_id);
  const totalPages = 3; 

  const currentTheme = {
    header: currentCategory?.theme_header || '#fae78f',
    bg: currentCategory?.theme_bg || '#FBFAEF',
    text: ['c2', 'c3', 'c1'].includes(currentFiche.category_id) ? (currentFiche.category_id === 'c3' ? 'black' : 'white') : 'black'
  };

  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      addXp(10);
      completeFiche(id);
      if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
    }
  };

  const isSpecialFiche = currentFiche.id === 'f4';

  return (
    <div 
      className="h-screen w-full flex flex-col overflow-hidden font-['Inter',_sans-serif] selection:bg-red-500/30"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* HEADER - GLASS STYLE (V3) */}
      <header 
        className="fixed top-0 z-[60] w-full pt-4 pb-4 px-6 flex items-center justify-between backdrop-blur-2xl border-b border-black/5"
        style={{ backgroundColor: `${currentTheme.header}E6` }} // Add 90% opacity (E6)
      >
        <div className="flex items-center gap-5 w-full max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] bg-black/5 hover:bg-black/10 active:scale-95 transition-all shadow-sm"
            style={{ color: currentTheme.text }}
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <div className="flex-1 flex flex-col min-w-0">
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-black/30" style={{ color: `${currentTheme.text}4D` }}>Module {currentCategory?.name || 'V-Formation'}</span>
                <span className="h-1 w-1 bg-black/20 rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#CC1A1A]">Version 3.1</span>
             </div>
             <h1 
                className="text-lg md:text-2xl font-black tracking-tighter uppercase italic leading-none truncate mt-0.5"
                style={{ color: currentTheme.text }}
             >
               {currentFiche.title}
             </h1>
          </div>

          <div className="flex items-center gap-3">
             <button className="hidden md:flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-black/5 hover:bg-black/10 transition-all">
                <Bookmark size={22} style={{ color: currentTheme.text }} />
             </button>
             <button className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] bg-black/5 hover:bg-black/10 transition-all">
                <Share2 size={22} style={{ color: currentTheme.text }} />
             </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative pt-24 overflow-y-auto no-scrollbar scroll-smooth">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="w-full h-full max-w-7xl mx-auto flex flex-col"
         >
            {isSpecialFiche ? (
              /* FULLSCREEN IMAGE/PAGE VIEWER */
              <div className="flex-1 flex flex-col h-full bg-white/20 backdrop-blur-sm rounded-t-[3rem] overflow-hidden shadow-2xl">
                 <div className="bg-white/50 py-3 px-8 border-b border-black/5 flex items-center justify-between">
                    <div className="flex gap-2">
                       {[1,2,3].map(p => (
                         <div key={p} className={cn("h-1.5 w-8 rounded-full transition-all", activePage === p ? "bg-[#CC1A1A]" : "bg-black/5")} />
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Page haute définition</span>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar" ref={scrollContainerRef}>
                    {[1, 2, 3].map(p => (
                      <div key={p} className="h-full w-full snap-start flex items-center justify-center p-4">
                         <img 
                            src={`/assets/fiches/page${p}.jpg`} 
                            alt={`Page ${p}`} 
                            className="w-full h-full object-contain md:rounded-3xl shadow-xl bg-white" 
                            onLoad={() => setActivePage(p)}
                         />
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              /* STANDARD TEXT CONTENT */
              <div className="px-6 md:px-12 pb-48 flex flex-col gap-12">
                 {currentFiche.file_data ? (
                    <div className="w-full animate-in zoom-in duration-700">
                       {currentFiche.file_type === 'pdf' ? (
                          <PDFViewer base64Data={currentFiche.file_data} />
                       ) : (
                          <img 
                            src={currentFiche.file_data} 
                            alt={currentFiche.title} 
                            className="w-full h-auto object-contain md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-white" 
                          />
                       )}
                    </div>
                 ) : (
                    (currentFiche.sections || []).map((section, idx) => (
                      <section key={idx} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tighter uppercase italic flex items-center gap-4">
                            <span className="h-10 w-2.5 bg-[#CC1A1A] rounded-full shadow-[0_5px_15px_#CC1A1A4D]" />
                            {section.title}
                         </h2>
                         
                         {section.type === 'definition' && (
                           <div className="flex flex-col gap-6">
                              {section.content && <p className="text-xl text-[#3b3b44] leading-relaxed font-bold bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">{section.content}</p>}
                              {section.items && (
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  {section.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-5 bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                      <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#CC1A1A] group-hover:bg-[#CC1A1A] group-hover:text-white transition-all">
                                         <Zap size={20} />
                                      </div>
                                      <span className="font-black text-[#1A1A2E] text-base md:text-lg italic tracking-tight">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {section.warning && (
                                <div className="mt-8 p-10 bg-red-600 text-white rounded-[3rem] shadow-[0_20px_50px_rgba(204,26,26,0.3)] relative overflow-hidden group">
                                   <div className="relative z-10 flex items-start gap-6">
                                      <div className="h-14 w-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center shrink-0">
                                         <AlertTriangle size={32} />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                         <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Protocole de Sécurité</span>
                                         <p className="text-lg md:text-xl font-black italic tracking-tight leading-relaxed">{section.warning}</p>
                                      </div>
                                   </div>
                                   <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 -rotate-45 translate-x-10 translate-y-10 rounded-full" />
                                </div>
                              )}
                           </div>
                         )}

                         {section.type === 'keypoints' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {section.items.map((item, i) => (
                                <div key={i} className="flex gap-6 items-center bg-[#1A1A2E] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                   <div className="relative z-10 h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#34C759]">
                                      <CheckCircle2 size={32} />
                                   </div>
                                   <span className="relative z-10 text-white leading-tight font-black text-lg md:text-xl italic tracking-tighter">{item}</span>
                                   <div className="absolute bottom-0 right-0 h-24 w-24 bg-red-600 opacity-0 group-hover:opacity-10 transition-opacity blur-2xl" />
                                </div>
                              ))}
                           </div>
                         )}

                         {section.type === 'remember' && (
                            <div className="rounded-[4rem] bg-gradient-to-br from-[#1A1A2E] to-[#2A2A4E] p-12 md:p-20 shadow-[0_30px_70px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                               <div className="absolute -top-20 -right-20 h-80 w-80 bg-red-600/10 blur-[100px] rounded-full" />
                               <div className="relative z-10 flex flex-col gap-8">
                                  <div className="flex items-center gap-4">
                                     <div className="h-14 w-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                                        <Target size={32} className="text-white" />
                                     </div>
                                     <h4 className="text-xs font-black uppercase text-red-500 tracking-[0.4em] italic">Objectif Central</h4>
                                  </div>
                                  <p className="font-black leading-tight text-3xl md:text-5xl text-white tracking-tighter italic max-w-3xl border-l-[12px] border-red-600 pl-10 py-2">
                                     "{section.content}"
                                  </p>
                               </div>
                            </div>
                         )}
                      </section>
                    ))
                 )}
              </div>
            )}
         </motion.div>
      </main>

      {/* FLOATING ACTION FOOTER */}
      <footer 
        className="fixed bottom-0 z-50 w-full p-6 md:p-10 backdrop-blur-3xl border-t border-black/5 flex justify-center"
        style={{ backgroundColor: `${currentTheme.bg}F2` }}
      >
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 relative">
          
          {/* XP Badge Animation placeholder when clicking */}
          <AnimatePresence>
            {completed && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: -40 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-black text-xs shadow-2xl"
              >
                +10 XP ACQUIS
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleComplete}
            disabled={completed}
            className={cn(
              "flex-1 flex items-center justify-center gap-4 rounded-[2rem] py-5 md:py-8 font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-2xl",
              completed 
                ? 'bg-[#34C759] text-white shadow-[#34C759]33' 
                : 'bg-[#1A1A2E] text-white hover:bg-black shadow-black/20'
            )}
          >
            {completed ? <><CheckCircle2 size={24} strokeWidth={3} /> Leçon Validée</> : 'Marquer comme lu (+10 XP)'}
          </button>

          {completed && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => quiz ? navigate(`/quiz/${id}`) : navigate(-1)}
              className="flex-1 flex items-center justify-center gap-4 rounded-[2rem] py-5 md:py-8 font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-2xl bg-[#CC1A1A] text-white border-4 border-red-500/20"
            >
              {quiz ? (
                <>
                  <div className="p-1 bg-white/20 rounded-lg"><Zap size={22} fill="white" /></div> 
                  Lancer l'Évaluation
                </>
              ) : (
                'Retour au Repertoire'
              )}
            </motion.button>
          )}
        </div>
      </footer>

      {/* CSS Utilities */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      ` }} />
    </div>
  );
}
