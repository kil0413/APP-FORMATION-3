import { useEffect } from 'react';
import { Heart, Zap, Flame, Play, LayoutGrid, Brain, CheckCircle2, ChevronRight, Trophy, Star, Target, TrendingUp, Sparkles, AlertTriangle, Radio, Shield, Siren, Car, Activity, Library, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import HeroEmbers from '../components/layout/HeroEmbers';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore, getLevelInfo } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { cn } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const { fiches, categories, isLoading: isFichesLoading } = useFicheStore();
  const { user, isLoading: isAuthLoading, leaderboard, fetchLeaderboard, isLoadingLeaderboard } = useAuthStore();

  useEffect(() => {
    if (user && fetchLeaderboard) {
      fetchLeaderboard();
    }
  }, [user, fetchLeaderboard]);

  if (isAuthLoading || isFichesLoading || !user) {
    return (
      <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-[#0F0A0A] overflow-hidden z-[9999]">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #EF4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
         
         <div className="relative z-10 flex flex-col items-center">
            <div className="h-28 w-28 relative group">
               <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse" />
               <img src="/logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-3">
               <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
               </div>
               <p className="text-white/40 font-black uppercase text-[9px] tracking-[0.5em] mt-2">Accès au centre d'entraînement...</p>
            </div>
         </div>
      </div>
    );
  }

  const nrbcCategory = categories?.find(c => c.id === 'c3')?.name || 'NRBC';
  
  // Trouver dynamiquement la fiche Risque Gaz dans le store (exclut les mocks si possible)
  const risqueGazFiche = fiches?.find(f => f.title.toUpperCase().includes('RISQUE GAZ'));
  const risqueGazId = risqueGazFiche?.id || 'f4'; // Fallback au cas où

  const xpTotal = user.xp_total || 0;
  const levelInfo = getLevelInfo(xpTotal);
  const xpProgressDisplay = xpTotal >= 300 ? 1 : Math.min(xpTotal / levelInfo.max, 1);

  // Modules count logic
  const totalModules = fiches?.length || 0;
  const completedModulesCount = (user?.completed_fiches || []).filter(fc => {
     const ficheId = fc.includes('|') ? fc.split('|')[0] : fc;
     return fiches?.some(f => f.id === ficheId);
  }).length;

  return (
    <PageWrapper>
      <HeroEmbers />
      
      {/* NOUVEAU BLOC HERO FOURNI PAR L'UTILISATEUR */}
      <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center z-10 overflow-hidden">
        <div className="text-center pointer-events-none relative z-10 w-full px-4 mt-6 md:mt-0">
          <div className="hero-line-top"></div>
          <div className="pre-title">Centre de Formation</div>
          <h1 className="hero-title">
            <span className="fire">FIRE</span>
            <span className="academie">ACADEMIE</span>
          </h1>
          <div className="hero-line-bottom"></div>
        </div>

        <div className="hero-scroll-hint pb-10">
          <span>Découvrir</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* DASHBOARD EXISTANT */}
      <main className="flex flex-col lg:grid lg:grid-cols-12 gap-10 px-4 pt-16 pb-32 md:px-12 md:py-16 relative z-10 max-w-full">
        
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          {/* Welcome Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-600/20 flex items-center gap-2">
                   <Sparkles size={12} className="fill-current" />
                   Niveau {levelInfo.level}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Bonjour <span className="text-red-500">{user.display_name}</span></h1>
                <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[11px]">{xpTotal >= 300 ? "Objectif Maximal Atteint !" : `Plus que ${levelInfo.max - xpTotal > 0 ? levelInfo.max - xpTotal : 0} XP pour le prochain niveau !`}</p>
              </div>
            </div>

            {/* Streak Counter Mobile Only */}
            <div className="md:hidden flex items-center gap-4 bg-orange-500/10 p-4 rounded-[2rem] border border-orange-500/20 self-start">
               <Flame size={24} className="fill-orange-500 text-orange-500 animate-pulse" />
               <div className="flex flex-col">
                  <span className="text-xl font-black text-white leading-none">{user.streak_days || 0}</span>
                  <span className="text-[9px] font-black uppercase text-orange-500 tracking-widest">Série</span>
               </div>
            </div>
          </section>

          {/* Progression par Thématique - Remplace l'en-tête Risque Gaz */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                <Activity className="text-red-500" size={18} />
                Ma Progression par Thème
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map(cat => {
                // Calcul du progrès pour cette catégorie
                const catFiches = fiches.filter(f => f.category_id === cat.id);
                const total = catFiches.length;
                const completed = (user?.completed_fiches || []).filter(cf => {
                  const fid = cf.includes('|') ? cf.split('|')[0] : cf;
                  return catFiches.some(f => f.id === fid);
                }).length;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                // Sélection de l'icône et de la couleur selon le thème
                let Icon = Target;
                let themeColor = "bg-red-500";
                let textColor = "text-red-500";
                let borderColor = "border-red-500/20";
                let shadowColor = "shadow-red-500/10";

                const name = cat.name.toUpperCase();
                if (name.includes('SUAP')) { Icon = Heart; themeColor = "bg-blue-500"; textColor = "text-blue-500"; borderColor = "border-blue-500/20"; shadowColor = "shadow-blue-500/10"; }
                else if (name.includes('INCENDIE')) { Icon = Flame; themeColor = "bg-red-500"; textColor = "text-red-500"; borderColor = "border-red-500/20"; shadowColor = "shadow-red-500/10"; }
                else if (name.includes('RISQUES PARTICULIERS')) { Icon = Zap; themeColor = "bg-yellow-500"; textColor = "text-yellow-500"; borderColor = "border-yellow-500/20"; shadowColor = "shadow-yellow-500/10"; }
                else if (name.includes('SECOURS ROUTIER')) { Icon = Car; themeColor = "bg-slate-400"; textColor = "text-slate-400"; borderColor = "border-slate-400/20"; shadowColor = "shadow-slate-400/10"; }
                else if (name.includes('PRÉVENTION')) { Icon = Shield; themeColor = "bg-orange-500"; textColor = "text-orange-500"; borderColor = "border-orange-500/20"; shadowColor = "shadow-orange-500/10"; }
                else if (name.includes('CULTURE ADMINISTRATIVE')) { Icon = Library; themeColor = "bg-purple-500"; textColor = "text-purple-500"; borderColor = "border-purple-500/20"; shadowColor = "shadow-purple-500/10"; }

                return (
                  <Card key={cat.id} className={cn("bg-[#1E293B]/20 border-white/5 group hover:bg-[#1E293B]/40 transition-all duration-300 rounded-3xl overflow-hidden", borderColor)}>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110 group-hover:rotate-6", textColor)}>
                            <Icon size={24} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">Thématique</span>
                            <span className="font-black text-white uppercase tracking-tighter italic text-sm">{cat.name}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={cn("text-xl font-black italic tracking-tighter", textColor)}>{percent}%</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={cn("h-full transition-all duration-1000 ease-out shadow-lg", themeColor, shadowColor)}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{completed} / {total} acquis</span>
                          {percent === 100 && (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] px-2 py-0.5 font-black uppercase">Terminé</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                user.completed_fiches.slice(-4).reverse().map((entry, index) => {
                  const entryId = entry.includes('|') ? entry.split('|')[0] : entry;
                  const entryDate = entry.includes('|') ? new Date(entry.split('|')[1]).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : 'Récent';
                  const fiche = fiches.find(f => f.id === entryId);
                  
                  if (!fiche) return null;
                  
                  return (
                    <Card key={`${entryId}-${index}`} onClick={() => navigate(`/fiche/${entryId}`)} className="border-white/5 bg-[#1E293B]/20 rounded-[2rem] hover:bg-[#1E293B]/40 transition-all cursor-pointer group">
                      <CardContent className="flex items-center gap-6 p-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#CC1A1A]/10 text-red-500 group-hover:rotate-6 transition-transform shadow-inner">
                          <CheckCircle2 size={28} />
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                          <h3 className="text-lg font-black text-white uppercase tracking-tighter italic line-clamp-1">{fiche.title}</h3>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            {categories.find(c => c.id === fiche.category_id)?.name || 'Module'} • {entryDate}
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
                      <span className="font-bold text-orange-500 text-sm">{user.streak_days || 0}</span>
                   </div>
                </div>

                <div className="flex flex-col items-center py-6 gap-2">
                   <div className="relative h-44 w-44">
                      <svg className="h-full w-full -rotate-90">
                        <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * xpProgressDisplay)} className="text-red-500 transition-all duration-1000 stroke-round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-black text-white italic">{xpTotal}</span>
                         <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">/ {xpTotal >= 300 ? 'MAX' : levelInfo.max} XP</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">XP TOTAL</p>
                      <p className="text-lg font-black text-white italic">{xpTotal.toLocaleString()}</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">MODULES</p>
                      <p className="text-lg font-black text-white italic">{completedModulesCount}/{totalModules}</p>
                   </div>
                </div>

                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-2 text-center w-full mt-2">
                   <Trophy size={32} className="text-yellow-500 mb-2" />
                   <span className="text-2xl font-black text-white">Niveau {levelInfo.level}</span>
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{xpTotal >= 300 ? 'Vous avez atteint le rang maximum' : 'Continuez pour augmenter votre rang'}</span>
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
                  {isLoadingLeaderboard ? (
                    <div className="text-center text-white/40 text-[10px] py-4 uppercase tracking-widest font-bold">Chargement du classement...</div>
                  ) : leaderboard?.length > 0 ? (
                    leaderboard.map((entry, idx) => {
                      const isMe = entry.id === user.id;
                      return (
                        <div key={entry.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isMe ? 'bg-red-600 text-white scale-105 shadow-xl shadow-red-500/20' : 'text-white/40 hover:bg-white/5'}`}>
                           <span className="text-xs font-black opacity-40">#{idx + 1}</span>
                           <div className="h-8 w-8 rounded-full bg-white/10 overflow-hidden border border-white/10 shrink-0">
                              <img src={entry.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.display_name}`} alt="" />
                           </div>
                           <span className="flex-1 font-black uppercase text-xs tracking-tighter truncate">{isMe ? 'Moi' : entry.display_name}</span>
                           <span className="text-[10px] font-black opacity-60">{entry.xp_total} XP</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-white/40 text-[10px] py-4 uppercase tracking-widest font-bold">Aucun joueur classé</div>
                  )}
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
