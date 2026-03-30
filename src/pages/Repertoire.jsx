import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, FileText, ImageIcon, CheckCircle2, ChevronRight, Map, Shield, LayoutGrid, Brain, Filter, ArrowUpRight, Clock, Star } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useFicheStore } from '../store/useFicheStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

export default function Repertoire() {
  const [activeTab, setActiveTab] = useState('Tous');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { fiches, categories, isLoading: isFichesLoading } = useFicheStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  const tabs = ['Tous', 'QCM', 'PDF', 'Images', 'Favoris'];

  const filteredItems = useMemo(() => {
    let items = [];

    // Fiches
    if (activeTab !== 'QCM') {
      const fItem = (fiches || []).filter(fiche => {
        const matchesSearch = fiche.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || fiche.category_id === activeCategory;
        const matchesTab = activeTab === 'Tous' || 
                          (activeTab === 'PDF' && fiche.file_type === 'pdf') ||
                          (activeTab === 'Images' && fiche.file_type === 'image') ||
                          (activeTab === 'Favoris' && user.favorites?.includes(fiche.id));
        return matchesSearch && matchesCategory && matchesTab;
      }).map(f => ({ ...f, itemType: 'fiche' }));
      items = [...items, ...fItem];
    }

    // Quizzes
    if (activeTab === 'Tous' || activeTab === 'QCM') {
      const { quizzes } = useFicheStore.getState();
      const qItem = (quizzes || []).filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
        const ficheCategory = fiches.find(f => f.id === quiz.fiche_id)?.category_id;
        const matchesCategory = activeCategory === 'all' || ficheCategory === activeCategory;
        return matchesSearch && matchesCategory;
      }).map(q => ({ ...q, itemType: 'quiz' }));
      items = [...items, ...qItem];
    }

    return items;
  }, [fiches, searchQuery, activeCategory, activeTab, user]);

  if (isAuthLoading || isFichesLoading || !user) {
    return (
      <div className="flex bg-[#1A1A2E] h-screen items-center justify-center">
        <div className="text-white font-black uppercase text-xs tracking-[0.3em] animate-pulse">
          SYNCHRONISATION...
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <Header title="Bibliothèque" backButton className="md:hidden" />
      
      <main className="flex flex-col gap-10 px-5 py-8 md:px-12 md:py-16">
        
        {/* Header Repertoire */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Bibliothèque <span className="text-red-600">Opérationnelle</span></h1>
              <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Accédez à {fiches.length} documents de formation</p>
            </div>
            
            {/* Tabs Filter */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl md:rounded-3xl self-start border border-white/5">
               {tabs.map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "px-6 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all",
                     activeTab === tab ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-white/40 hover:text-white/60"
                   )}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          {/* Search Bar Premium */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none">
              <Search className="text-white/20 group-focus-within:text-red-500 transition-colors" size={28} />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher une fiche, un grade ou un module..." 
              className="w-full bg-white/[0.04] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] py-8 md:py-10 pl-24 pr-10 text-white shadow-2xl placeholder-white/10 font-black italic text-xl md:text-2xl focus:ring-4 focus:ring-red-600/10 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Horizontal Categories */}
        <section className="flex flex-col gap-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.4em]">Catégories Thématiques</h2>
              {activeCategory !== 'all' && (
                <button onClick={() => setActiveCategory('all')} className="text-red-500 font-black text-[10px] uppercase tracking-widest">Réinitialiser</button>
              )}
           </div>
           
           <div className="flex overflow-x-auto no-scrollbar gap-5 pb-4 -mx-5 px-5 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                   className={cn(
                     "shrink-0 flex items-center gap-4 p-4 md:p-6 rounded-[2rem] border transition-all duration-300 group shadow-2xl",
                     activeCategory === cat.id 
                       ? "bg-red-600 border-red-600 shadow-red-500/20 scale-105" 
                       : "bg-white/5 border-white/5 hover:border-red-600/20"
                   )}
                >
                    <div 
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                        activeCategory === cat.id ? "bg-white/10 text-white" : "bg-white/5 text-white/40 group-hover:bg-red-500/10 group-hover:text-red-500"
                      )}
                    >
                      <LayoutGrid size={24} />
                   </div>
                    <div className="flex flex-col items-start pr-4">
                       <span className={cn("text-xs font-black uppercase tracking-widest", activeCategory === cat.id ? "text-white" : "text-white")}>{cat.name}</span>
                       <span className={cn("text-[9px] font-bold mt-0.5", activeCategory === cat.id ? "text-white/40" : "text-white/20")}>12 documents</span>
                    </div>
                </button>
              ))}
           </div>
        </section>

        {/* Documents Grid */}
        <section className="flex flex-col gap-10 mb-20">
           <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
                Résultats <span className="text-red-500">({filteredItems.length})</span>
             </h2>
             <div className="flex items-center gap-2 text-white/30">
                <Filter size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Trier par : Pertinence</span>
             </div>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredItems.length > 0 ? filteredItems.map(item => {
              const categoryId = item.itemType === 'quiz' ? fiches.find(f => f.id === item.fiche_id)?.category_id : item.category_id;
              const category = categories.find(c => c.id === categoryId);
              const isCompleted = user.completed_fiches?.some(f => f.startsWith(item.itemType === 'quiz' ? item.fiche_id : item.id));
              
              return (
                 <Card 
                   key={`${item.itemType}-${item.id}`} 
                   className="group cursor-pointer border-white/5 shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[3rem] bg-[#1E293B]/20 overflow-hidden p-0" 
                   onClick={() => navigate(`/${item.itemType === 'quiz' ? 'quiz' : 'fiche'}/${item.id}`)}
                 >
                   <CardContent className="p-8 flex flex-col gap-8">
                     <div className="flex items-start justify-between">
                       <div className="relative">
                         <div 
                            className="h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-[2rem] text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 flex"
                            style={{ backgroundColor: category?.theme_header || '#CC1A1A' }}
                         >
                           {item.itemType === 'quiz' ? <Brain size={40} /> : item.file_type === 'pdf' ? <FileText size={40} /> : <ImageIcon size={40} />}
                         </div>
                         {isCompleted && (
                           <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-green-500 shadow-xl border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                              <CheckCircle2 size={24} />
                           </div>
                         )}
                       </div>
                       <Badge className="bg-white/5 text-white/40 border-none font-black uppercase text-[10px] tracking-widest px-4 py-2">
                          {item.itemType === 'quiz' ? 'QCM' : (item.difficulty || 'Fiche')}
                       </Badge>
                     </div>
                     
                     <div className="flex flex-col gap-4">
                         <h3 className="font-black text-white text-2xl md:text-3xl tracking-tighter italic uppercase leading-tight line-clamp-2">
                            {item.title}
                         </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 px-3 py-1 bg-red-500/10 rounded-lg">{category?.name || 'Général'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-3 py-1 bg-white/5 rounded-lg flex items-center gap-1">
                               <Clock size={12} />
                               {item.itemType === 'quiz' ? '5 min' : '10 min'}
                           </span>
                        </div>
                     </div>

                     <div className="mt-2 pt-6 border-t border-gray-100 flex items-center justify-between group-hover:border-red-100 transition-colors">
                        <div className="flex items-center -space-x-3">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="h-8 w-8 rounded-full border-2 border-[#1E293B] bg-white/10 overflow-hidden shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="" />
                             </div>
                           ))}
                           <span className="pl-6 text-[10px] font-black text-white/30 uppercase tracking-widest">+12 révisés</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#CC1A1A] group-hover:text-white transition-all shadow-lg group-hover:shadow-red-500/30">
                           <ArrowUpRight size={20} />
                        </div>
                     </div>
                   </CardContent>
                 </Card>
              );
            }) : (
              <div className="col-span-full py-40 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
                 <div className="h-40 w-40 bg-gray-50 rounded-full flex items-center justify-center relative">
                    <Search size={64} className="text-gray-200" />
                    <div className="absolute top-0 right-0 h-10 w-10 bg-red-500 rounded-full border-4 border-white animate-bounce" />
                 </div>
                 <div className="text-center flex flex-col gap-2">
                    <p className="text-[#1A1A2E] font-black uppercase tracking-tighter italic text-2xl">Aucun document trouvé</p>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Essaie avec d'autres mots-clés ou filtres.</p>
                 </div>
                 <button 
                   onClick={() => {setSearchQuery(''); setActiveCategory('all'); setActiveTab('Tous');}}
                   className="mt-4 px-10 py-5 bg-[#1A1A2E] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
                 >
                    Réinitialiser tout
                 </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
