import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, FileText, Image, CheckCircle2, ChevronRight, Map, Shield, LayoutGrid, Brain } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useFicheStore } from '../store/useFicheStore';
import { useAuthStore } from '../store/useAuthStore';

const filters = ['Tous', 'Cours', 'Fiches'];

export default function Repertoire() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { fiches, categories, isLoading: isFichesLoading } = useFicheStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  if (isAuthLoading || isFichesLoading || !user) {
    return (
      <div className="flex bg-[#CC1A1A] h-screen items-center justify-center">
        <div className="text-white font-black uppercase text-xl animate-pulse">
          CHARGEMENT...
        </div>
      </div>
    );
  }

  const filteredFiches = (fiches || []).filter(fiche => {
    const matchesFilter = activeFilter === 'Tous' || (activeFilter === 'Fiches');
    const matchesSearch = (fiche.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageWrapper>
      <Header title="Formation continue" backButton className="md:hidden" />
      
      <main className="flex flex-col gap-8 px-5 py-6 md:px-10 md:py-12">
        {/* Title Desktop */}
        <div className="hidden md:flex flex-col gap-3">
          <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Bibliothèque <span className="text-[#CC1A1A]">Pompier</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accédez à l'ensemble du savoir théorique et opérationnel.</p>
        </div>

        {/* Barre de recherche Premium */}
        <section>
          <div className="relative flex items-center h-16 md:h-20 w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-gray-100 px-6 md:px-10 focus-within:ring-4 focus-within:ring-red-100 transition-all">
            <Search className="text-gray-300 mr-4" size={28} />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou mot-clé..." 
              className="flex-1 bg-transparent border-none outline-none text-[#1A1A2E] placeholder-gray-300 text-lg md:text-xl font-black italic tracking-tighter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Thématiques / Catégories */}
        <section className="-mx-5 px-5 md:mx-0 md:px-0">
           <h2 className="hidden md:block text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Catégories</h2>
           <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 pb-4">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => navigate(`/categorie/${cat.id}`)}
                  className="shrink-0 flex flex-col items-center gap-4 p-5 md:p-8 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-50 hover:border-red-500/30 hover:shadow-red-500/10 transition-all group"
                >
                   <div 
                     className="h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] bg-gray-50 flex items-center justify-center text-[#1A1A2E] group-hover:bg-red-50 group-hover:text-[#CC1A1A] transition-colors"
                     style={{ color: cat.theme_header }}
                   >
                      <LayoutGrid size={32} />
                   </div>
                   <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-center">{cat.name}</span>
                </button>
              ))}
           </div>
        </section>

        {/* Liste des fiches */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Documents ({filteredFiches.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredFiches.length > 0 ? filteredFiches.map(fiche => {
              const isCompleted = user.completed_fiches?.includes(fiche.id);
              const category = categories.find(c => c.id === fiche.category_id);
              
              return (
                <Card 
                  key={fiche.id} 
                  className="cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden p-0 h-full flex flex-col" 
                  onClick={() => navigate(`/fiche/${fiche.id}`)}
                >
                  <CardContent className="flex flex-col flex-1 p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div 
                        className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl"
                        style={{ backgroundColor: category?.theme_header || '#fae78f' }}
                      >
                        <FileText size={32} />
                      </div>
                      {isCompleted && (
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-[#34C759]">
                           <CheckCircle2 size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 gap-2">
                      <h3 className="font-black text-[#1A1A2E] text-xl md:text-2xl tracking-tighter italic uppercase leading-tight line-clamp-2">{fiche.title}</h3>
                      <div className="flex items-center gap-3 mt-4">
                        <Badge className="bg-gray-100 text-gray-400 border-none font-black uppercase text-[10px] tracking-widest px-4 py-1.5">
                           {category?.name}
                        </Badge>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#CC1A1A]">{fiche.difficulty}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Progress Line */}
                  <div className={`h-2 w-full ${isCompleted ? 'bg-[#34C759]' : 'bg-gray-50'}`} />
                </Card>
              );
            }) : (
              <div className="col-span-full py-24 text-center">
                 <p className="text-gray-300 font-black uppercase tracking-widest text-xl">Aucun document trouvé</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
