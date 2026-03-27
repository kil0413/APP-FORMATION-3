import { Heart, Zap, Flame, Play, LayoutGrid, Brain, CheckCircle2, ChevronRight, Trophy, Star, Target, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { cn } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const { fiches, categories, isLoading: isFichesLoading } = useFicheStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  if (isAuthLoading || isFichesLoading || !user) {
    return (
      <div className="flex bg-[#0A0A12] h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="h-20 w-20 bg-red-600 rounded-[2rem] flex items-center justify-center animate-bounce shadow-2xl shadow-red-500/40">
              <span className="text-white font-black italic text-2xl">SP</span>
           </div>
           <div className="text-white/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">
              Initialisation du centre d'entraînement...
           </div>
        </div>
      </div>
    );
  }

  const nrbcCategory = categories?.find(c => c.id === 'c3')?.name || 'NRBC';
  
  // Trouver dynamiquement la fiche Risque Gaz dans le store (exclut les mocks si possible)
  const risqueGazFiche = fiches?.find(f => f.title.toUpperCase().includes('RISQUE GAZ'));
  const risqueGazId = risqueGazFiche?.id || 'f4'; // Fallback au cas où

  return (
    <PageWrapper>
      <Header showLogo className="md:hidden" />
      
      <main className="flex flex-col lg:grid lg:grid-cols-12 gap-10 px-4 py-8 md:px-12 md:py-16">
        
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          {/* Welcome Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-600/20 flex items-center gap-2">
                   <Sparkles size={12} className="fill-current" />
                   Niveau {Math.floor(user.xp_total / 1000) + 1}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Bonjour <span className="text-red-500">{user.display_name}</span></h1>
                <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[11px]">Prêt pour tes {user.daily_goal - user.daily_xp > 0 ? user.daily_goal - user.daily_xp : 0} XP du jour ?</p>
              </div>
            </div>

            {/* Streak Counter Mobile Only */}
            <div className="md:hidden flex items-center gap-4 bg-orange-500/10 p-4 rounded-[2rem] border border-orange-500/20 self-start">
               <Flame size={24} className="fill-orange-500 text-orange-500 animate-pulse" />
               <div className="flex flex-col">
                  <span className="text-xl font-black text-white leading-none">{user.streak_days}</span>
                  <span className="text-[9px] font-black uppercase text-orange-500 tracking-widest">Série</span>
               </div>
            </div>
          </section>

          {/* Module en cours - Premium Hero Card */}
          <section>
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-950 text-white border border-red-500/30 shadow-[0_20px_50px_rgba(239,68,68,0.25)] group cursor-pointer" onClick={() => navigate(`/fiche/${risqueGazId}`)}>
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 -rotate-12 translate-x-1/4 -translate-y-1/4">
                 <Zap size={240} className="fill-white" />
              </div>
              
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between p-10 md:p-14 relative z-10 gap-8">
                <div className="flex flex-col gap-6 max-w-lg">
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-white text-red-600 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest animate-pulse">
                       MODULE PRIORITAIRE
                    </Badge>
                    <Badge className="bg-black/20 text-white/70 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                       {nrbcCategory}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">RISQUE GAZ</h2>
                    <p className="text-sm md:text-lg text-white/70 font-bold uppercase tracking-widest">Étape 4 : Plage d'explosivité et BLEVE</p>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                     <span className="h-1 flex-1 bg-black/20 rounded-full overflow-hidden">
                        <span className="block h-full bg-white w-[60%] shadow-lg shadow-white/50" />
                     </span>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">PROGRÈS 60%</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/fiche/${risqueGazId}`); }}
                  className="inline-flex items-center justify-center gap-4 rounded-[2rem] bg-white px-12 py-6 text-sm font-black uppercase tracking-widest text-red-600 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                >
                  Continuer
                  <Play size={20} className="fill-current" />
                </button>
              </CardContent>
              
              {/* Animated BG patterns */}
              <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-red-600/20 blur-[100px]" />
            </Card>
          </section>

          {/* Outils d'apprentissage - Grid Layout */}
          <section className="flex flex-col gap-8">
             <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-4">Outils de Formation</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 't1', title: 'QCM', sub: 'Flash Test', icon: <Zap />, color: 'bg-orange-600/20 text-orange-400', click: () => navigate('/quiz-general') },
                  { id: 't2', title: 'MSP', sub: 'Mises en situation', icon: <Flame />, color: 'bg-red-600/20 text-red-400', click: () => alert("Le module de Mise en Situation Pratique (MSP) est en cours de développement.") },
                  { id: 't3', title: 'MATOS', sub: 'Nomenclatures', icon: <Target />, color: 'bg-blue-600/20 text-blue-400', click: () => alert("Le module Matos est en cours de développement.") }
                ].map((tool) => (
                  <Card key={tool.id} onClick={tool.click} className="cursor-pointer group hover:scale-[1.02] transition-all border-white/5 bg-[#1E293B]/20">
                    <CardContent className="flex flex-col gap-6 p-8">
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12", tool.color)}>
                        {tool.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{tool.title}</h3>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{tool.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </section>

          {/* Activités Récentes Dynamiques */}
          <section>
            <h2 className="mb-8 text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
               <TrendingUp className="text-red-500" size={28} />
               Dernières Activités
            </h2>
            <div className="flex flex-col gap-5">
              {user?.completed_fiches && user.completed_fiches.length > 0 ? (
                user.completed_fiches.slice(-4).reverse().map((id, index) => {
                  const fiche = fiches.find(f => f.id === id);
                  if (!fiche) return null;
                  
                  return (
                    <Card key={`${id}-${index}`} onClick={() => navigate(`/fiche/${id}`)} className="border-white/5 bg-[#1E293B]/20 rounded-[2rem] hover:bg-[#1E293B]/40 transition-all cursor-pointer group">
                      <CardContent className="flex items-center gap-6 p-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#CC1A1A]/10 text-red-500 group-hover:rotate-6 transition-transform shadow-inner">
                          <CheckCircle2 size={28} />
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                          <h3 className="text-lg font-black text-white uppercase tracking-tighter italic line-clamp-1">{fiche.title}</h3>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            {categories.find(c => c.id === fiche.category_id)?.name || 'Module'} • Validé
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 pr-2">
                           <span className="text-[11px] font-black text-green-500">+10 XP</span>
                           <div className="h-6 w-6 rounded-full bg-black/30 flex items-center justify-center shadow-inner">
                              <ChevronRight size={14} className="text-white/40" />
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="w-full py-16 px-6 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-center">
                   <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center opacity-50">
                     <Brain size={24} className="text-white/40" />
                   </div>
                   <div>
                     <p className="text-sm font-black text-white uppercase tracking-widest italic opacity-70 mb-1">Aucune activité enregistrée</p>
                     <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Lancez une fiche pour commencer votre entraînement</p>
                   </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Space (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Points & Stats Card */}
          <Card className="rounded-[3rem] p-10 border border-white/5 bg-[#1E293B]/20 shadow-2xl relative overflow-hidden group">
             <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center justify-between">
                   <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Tableau de Bord</h2>
                   <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                      <Flame size={18} className="fill-orange-500 text-orange-500" />
                      <span className="font-black text-orange-500 text-sm">{user.streak_days}</span>
                   </div>
                </div>

                <div className="flex flex-col items-center py-6 gap-2">
                   <div className="relative h-44 w-44">
                      <svg className="h-full w-full -rotate-90">
                        <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * user.daily_xp / user.daily_goal)} className="text-red-500 transition-all duration-1000 stroke-round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-black text-white italic">{user.daily_xp}</span>
                         <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">/ {user.daily_goal} XP</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">XP TOTAL</p>
                      <p className="text-lg font-black text-white italic">{user.xp_total.toLocaleString()}</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">MODULES</p>
                      <p className="text-lg font-black text-white italic">14/25</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-2">
                      <Heart size={20} className="fill-red-500 text-red-500" />
                      <span className="text-lg font-black text-white">{user.lives}</span>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Énergies</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-2">
                      <Trophy size={20} className="fill-yellow-500 text-yellow-500" />
                      <span className="text-lg font-black text-white">{Math.floor(user.xp_total / 100)}</span>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Rank</span>
                   </div>
                </div>
             </div>
          </Card>

          {/* Leaderboard Preview */}
          <section className="bg-[#1E293B]/20 rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Classement Général</h2>
                  <Target size={20} className="text-red-500" />
               </div>

               <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Lucas T.', xp: '4,2k', me: false },
                    { rank: 2, name: 'Jean P.', xp: '1,2k', me: true },
                    { rank: 3, name: 'Sophie L.', xp: '0,9k', me: false }
                  ].map((entry) => (
                    <div key={entry.rank} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${entry.me ? 'bg-red-600 text-white scale-105 shadow-xl shadow-red-500/20' : 'text-white/40 hover:bg-white/5'}`}>
                       <span className="text-xs font-black opacity-40">#{entry.rank}</span>
                       <div className="h-8 w-8 rounded-full bg-white/10 overflow-hidden border border-white/10 shrink-0">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt="" />
                       </div>
                       <span className="flex-1 font-black uppercase text-xs tracking-tighter truncate">{entry.me ? 'Moi' : entry.name}</span>
                       <span className="text-[10px] font-black opacity-60">{entry.xp} XP</span>
                    </div>
                  ))}
               </div>
               
               <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors border border-white/10 rounded-2xl">
                  Voir tout le classement
               </button>
             </div>
          </section>
        </aside>

      </main>
    </PageWrapper>
  );
}
