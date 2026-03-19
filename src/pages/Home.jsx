import { Heart, Zap, Flame, Play, LayoutGrid, Brain, CheckCircle2, ChevronRight, Trophy, Star, Target, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';

export default function Home() {
  const navigate = useNavigate();
  const { categories, isLoading: isFichesLoading } = useFicheStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  if (isAuthLoading || isFichesLoading || !user) {
    return (
      <div className="flex bg-[#1A1A2E] h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="h-20 w-20 bg-[#CC1A1A] rounded-[2rem] flex items-center justify-center animate-bounce shadow-2xl shadow-red-500/40">
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
                <span className="px-3 py-1 bg-red-50 text-[#CC1A1A] text-[10px] font-black rounded-full uppercase tracking-widest border border-red-100 flex items-center gap-2">
                   <Sparkles size={12} className="fill-current" />
                   Niveau {Math.floor(user.xp_total / 1000) + 1}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tighter uppercase italic leading-none">Bonjour <span className="text-[#CC1A1A]">{user.display_name}</span></h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[11px]">Prêt pour tes {user.daily_goal - user.daily_xp > 0 ? user.daily_goal - user.daily_xp : 0} XP du jour ?</p>
            </div>

            {/* Streak Counter Mobile Only */}
            <div className="md:hidden flex items-center gap-4 bg-orange-50 p-4 rounded-[2rem] border border-orange-100 self-start">
               <Flame size={24} className="fill-orange-500 text-orange-500 animate-pulse" />
               <div className="flex flex-col">
                  <span className="text-xl font-black text-[#1A1A2E] leading-none">{user.streak_days}</span>
                  <span className="text-[9px] font-black uppercase text-orange-600 tracking-widest">Série</span>
               </div>
            </div>
          </section>

          {/* Module en cours - Premium Hero Card */}
          <section>
            <Card className="relative overflow-hidden bg-[#1A1A2E] text-white border-none shadow-[0_20px_50px_rgba(204,26,26,0.15)] group cursor-pointer" onClick={() => navigate('/fiche/f4')}>
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 -rotate-12 translate-x-1/4 -translate-y-1/4">
                 <Zap size={240} className="fill-white" />
              </div>
              
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between p-10 md:p-14 relative z-10 gap-8">
                <div className="flex flex-col gap-6 max-w-lg">
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-red-600 text-white border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest animate-pulse">
                       MODULE PRIORITAIRE
                    </Badge>
                    <Badge className="bg-white/10 text-white/70 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                       {nrbcCategory}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">RISQUE GAZ</h2>
                    <p className="text-sm md:text-lg text-white/50 font-bold uppercase tracking-widest">Étape 4 : Plage d'explosivité et BLEVE</p>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                     <span className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <span className="block h-full bg-red-600 w-[60%] shadow-lg shadow-red-600/50" />
                     </span>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">PROGRÈS 60%</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/fiche/f4'); }}
                  className="inline-flex items-center justify-center gap-4 rounded-[2rem] bg-white px-12 py-6 text-sm font-black uppercase tracking-widest text-[#1A1A2E] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                >
                  Continuer
                  <Play size={20} className="fill-current" />
                </button>
              </CardContent>
              
              {/* Animated BG patterns */}
              <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-red-600/20 blur-[100px]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A2E] via-transparent to-red-600/5" />
            </Card>
          </section>

          {/* Outils d'apprentissage - Grid Layout */}
          <section>
            <div className="mb-8 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="h-2 w-8 bg-[#CC1A1A] rounded-full" />
                 <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic leading-none">Outils de formation</h2>
               </div>
               <button onClick={() => navigate('/repertoire')} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#CC1A1A] flex items-center gap-2 group transition-colors">
                  Explorer le répertoire
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Bibliothèque', sub: 'Fiches de révision', icon: <LayoutGrid size={32} />, color: 'bg-purple-100 text-purple-600', route: '/repertoire' },
                { title: 'Auto-Quiz', sub: 'Tests de connaissances', icon: <Brain size={32} />, color: 'bg-blue-100 text-blue-600', route: '/repertoire' },
                { title: 'Quiz Surprise', sub: 'Défis chronométrés', icon: <Zap size={32} />, color: 'bg-orange-100 text-orange-600', route: '/repertoire' }
              ].map((tool, i) => (
                <Card 
                  key={i} 
                  className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all cursor-pointer group rounded-[2.5rem] overflow-hidden bg-white" 
                  onClick={() => navigate(tool.route)}
                >
                  <CardContent className="flex flex-col items-start gap-8 p-10">
                    <div className={`rounded-[1.5rem] ${tool.color} p-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-current/10`}>
                      {tool.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-black text-[#1A1A2E] uppercase tracking-tighter italic">{tool.title}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{tool.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Activités Récentes */}
          <section>
            <h2 className="mb-8 text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic flex items-center gap-3">
               <TrendingUp className="text-[#CC1A1A]" size={28} />
               Dernières Activités
            </h2>
            <div className="flex flex-col gap-5">
              {[
                { id: 1, title: 'Bilan vital', sub: 'Secourisme • 12/03', done: true, points: '+150 XP', icon: '❤️' },
                { id: 2, title: 'Pose d\'un garrot', sub: 'Procédure • 11/03', done: true, points: '+80 XP', icon: '🩸' },
                { id: 3, title: 'Protection et alerte', sub: 'Sécurité Civile • 10/03', done: false, points: '0 XP', icon: '⚠️' }
              ].map((item) => (
                <Card key={item.id} className="border-none shadow-[0_5px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[2rem]">
                  <CardContent className="flex items-center gap-6 p-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-2xl group-hover:rotate-6 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-tighter italic">{item.title}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.sub}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className={`text-[11px] font-black ${item.done ? 'text-green-500' : 'text-gray-300'}`}>{item.points}</span>
                       {item.done ? (
                         <CheckCircle2 size={24} className="text-green-500" />
                       ) : (
                         <div className="h-6 w-6 rounded-full border-2 border-dashed border-gray-200" />
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Space (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Points & Stats Card */}
          <section className="bg-white rounded-[3rem] p-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
             <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center justify-between">
                   <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Tableau de Bord</h2>
                   <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                      <Flame size={18} className="fill-orange-500 text-orange-500" />
                      <span className="font-black text-orange-600 text-sm">{user.streak_days}</span>
                   </div>
                </div>

                <div className="flex flex-col items-center py-6 gap-2">
                   <div className="relative">
                      <div className="h-32 w-32 rounded-full border-[12px] border-gray-50 flex items-center justify-center relative z-10">
                         <Star size={48} className="fill-yellow-400 text-yellow-400" />
                      </div>
                      <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                         <circle 
                           cx="64" cy="64" r="58" 
                           fill="transparent" 
                           stroke="#CC1A1A" 
                           strokeWidth="12" 
                           strokeDasharray={364} 
                           strokeDashoffset={364 * (1 - user.daily_xp / user.daily_goal)} 
                           strokeLinecap="round"
                         />
                      </svg>
                   </div>
                   <div className="text-center mt-4">
                      <span className="text-4xl font-black text-[#1A1A2E] leading-none">{user.daily_xp}</span>
                      <span className="text-gray-400 font-bold ml-1 uppercase text-[10px] tracking-widest">/ {user.daily_goal} XP</span>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">{user.daily_goal - user.daily_xp <= 0 ? 'Objectif atteint !' : `Encore ${user.daily_goal - user.daily_xp} XP`}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-6 rounded-[2rem] flex flex-col items-center gap-2">
                     <Heart size={24} className="fill-red-500 text-red-500" />
                     <span className="text-xl font-black text-[#1A1A2E]">{user.lives}</span>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Énergies</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[2rem] flex flex-col items-center gap-2">
                     <Trophy size={24} className="fill-yellow-500 text-yellow-500" />
                     <span className="text-xl font-black text-[#1A1A2E]">{Math.floor(user.xp_total / 100)}</span>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rank</span>
                  </div>
                </div>
             </div>
             
             {/* Subtle background decoration */}
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-red-500/5 pointer-events-none" />
          </section>

          {/* Leaderboard Preview */}
          <section className="bg-[#1A1A2E] rounded-[3rem] p-10 border-none shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Classement Général</h2>
                  <Target size={20} className="text-red-500" />
               </div>

               <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Lucas T.', xp: '4,2k', me: false },
                    { rank: 2, name: 'Jean P.', xp: '1,2k', me: true },
                    { rank: 3, name: 'Sophie L.', xp: '0,9k', me: false }
                  ].map((entry) => (
                    <div key={entry.rank} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${entry.me ? 'bg-red-600 text-white scale-105 shadow-xl shadow-red-500/20' : 'text-white/60 hover:bg-white/5'}`}>
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
