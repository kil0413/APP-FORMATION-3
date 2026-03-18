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
      <Header title="Formation continue" backButton />
      
      <main className="flex flex-col gap-8 px-5 py-6">
        {/* Barre de recherche Premium */}
        <section>
          <div className="relative flex items-center h-16 w-full rounded-[1.5rem] bg-white shadow-2xl ring-1 ring-gray-100 px-6 focus-within:ring-4 focus-within:ring-red-100 transition-all">
            <Search className="text-gray-300 mr-4" size={24} />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou mot-clé..." 
              className="flex-1 bg-transparent border-none outline-none text-[#1A1A2E] placeholder-gray-300 text-lg font-black italic tracking-tighter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Thématiques / Catégories */}
        <section className="-mx-5 px-5 overflow-x-auto no-scrollbar">
           <div className="flex gap-4 pb-4">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => navigate(`/categorie/${cat.id}`)}
                  className="shrink-0 flex flex-col items-center gap-3 p-4 bg-white rounded-[2rem] shadow-xl border border-gray-50 active:scale-95 transition-transform"
                >
                   <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1A1A2E]">
                      <LayoutGrid size={24} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                </button>
              ))}
           </div>
        </section>

        {/* Liste des fiches */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Documents ({filteredFiches.length})</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {filteredFiches.length > 0 ? filteredFiches.map(fiche => {
              const isCompleted = user.completed_fiches?.includes(fiche.id);
              const category = categories.find(c => c.id === fiche.category_id);
              
              return (
                <Card 
                  key={fiche.id} 
                  className="cursor-pointer transition-all active:scale-[0.98] rounded-[2rem] border-none shadow-xl bg-white overflow-hidden p-0" 
                  onClick={() => navigate(`/fiche/${fiche.id}`)}
                >
                  <CardContent className="flex items-center gap-5 p-5">
                    <div 
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                      style={{ backgroundColor: category?.theme_header || '#fae78f' }}
                    >
                      <FileText size={28} />
                    </div>
                    
                    <div className="flex flex-col flex-1 gap-1 overflow-hidden">
                      <h3 className="font-black text-[#1A1A2E] truncate text-lg tracking-tighter italic uppercase">{fiche.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className="bg-gray-100 text-gray-500 border-none font-bold uppercase text-[9px] tracking-widest px-3">
                           {category?.name}
                        </Badge>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#CC1A1A]">{fiche.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center ml-2">
                      {isCompleted ? (
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-[#34C759]">
                           <CheckCircle2 size={24} />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                           <ChevronRight size={24} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  {/* Progress Line */}
                  {isCompleted && <div className="h-1.5 w-full bg-[#34C759]" />}
                </Card>
              );
            }) : (
              <div className="py-20 text-center">
                 <p className="text-gray-300 font-black uppercase tracking-widest">Aucun document trouvé</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
