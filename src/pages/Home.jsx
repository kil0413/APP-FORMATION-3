import { Heart, Zap, Flame, Play, LayoutGrid, Brain, CheckCircle2, ChevronRight } from 'lucide-react';
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
      <div className="flex bg-[#CC1A1A] h-screen items-center justify-center">
        <div className="text-white font-black uppercase text-xl animate-pulse">
          PRÉPARATION...
        </div>
      </div>
    );
  }

  const nrbcCategory = categories?.find(c => c.id === 'c3')?.name || 'NRBC';

  return (
    <PageWrapper>
      <Header showLogo className="md:hidden" />
      
      <main className="flex flex-col lg:grid lg:grid-cols-12 gap-8 px-4 py-6 md:px-8 md:py-10">
        
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Welcome Desktop Only */}
          <section className="hidden md:flex flex-col gap-2">
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Bonjour {user.display_name} ! 👨‍🚒</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Bon courage pour tes révisions du jour.</p>
          </section>

          {/* Module en cours */}
          <section>
            <Card className="relative overflow-hidden bg-[#1A1A2E] text-white group cursor-pointer hover:shadow-2xl transition-all duration-300">
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 relative z-10">
                <div className="flex flex-col">
                  <div className="mb-4">
                    <Badge className="border-red-500/30 bg-red-500/20 text-[#CC1A1A] animate-pulse">
                      EN COURS
                    </Badge>
                  </div>
                  <h2 className="mb-2 text-2xl md:text-3xl font-black tracking-tighter uppercase italic">Risque Gaz</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{nrbcCategory} • Module 1</p>
                </div>
                
                <button 
                  onClick={() => navigate('/fiche/f4')}
                  className="mt-6 md:mt-0 inline-flex items-center justify-center gap-3 rounded-[1.5rem] bg-[#CC1A1A] px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/30"
                >
                  Reprendre
                  <Play size={18} className="fill-current" />
                </button>
              </CardContent>
              
              {/* Décoration BG */}
              <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-red-600/10 blur-[80px]" />
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            </Card>
          </section>

          {/* Outils d'apprentissage */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Outils de formation</h2>
              <button onClick={() => navigate('/repertoire')} className="text-[#CC1A1A] font-black text-xs uppercase tracking-widest hover:underline">Voir tout</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="hover:border-purple-500/30 transition-all hover:shadow-xl cursor-pointer group" onClick={() => navigate('/repertoire')}>
                <CardContent className="flex flex-col items-start gap-5 p-6 md:p-8">
                  <div className="rounded-2xl bg-purple-50 p-4 text-purple-600 transition-transform group-hover:scale-110">
                    <LayoutGrid size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1A1A2E] uppercase">Flashcards</h3>
                    <p className="text-xs text-[#8E8E93] font-bold uppercase tracking-widest mt-1">Réviser par thématique</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:border-blue-500/30 transition-all hover:shadow-xl cursor-pointer group" onClick={() => navigate('/quiz')}>
                <CardContent className="flex flex-col items-start gap-5 p-6 md:p-8">
                  <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 transition-transform group-hover:scale-110">
                    <Brain size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1A1A2E] uppercase">Entraînement</h3>
                    <p className="text-xs text-[#8E8E93] font-bold uppercase tracking-widest mt-1">Quiz de connaissances</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dernières leçons */}
          <section className="mb-4">
            <h2 className="mb-6 text-xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Dernières Activités</h2>
            <div className="flex flex-col gap-4">
              {[
                { id: 1, title: 'Bilan vital', sub: 'Secourisme', done: true, icon: '❤️' },
                { id: 2, title: 'Pose d\'un garrot', sub: 'Procédure', done: false, icon: '🩸' },
                { id: 3, title: 'Protection et alerte', sub: 'Sécurité Civile', done: false, icon: '⚠️' }
              ].map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="flex items-center gap-5 p-4 md:p-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-2xl group-hover:bg-gray-100 transition-colors">
                      {lesson.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-tight">{lesson.title}</h3>
                      <p className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest">{lesson.sub}</p>
                    </div>
                    <div>
                      {lesson.done ? (
                        <CheckCircle2 size={28} className="text-[#34C759]" />
                      ) : (
                        <ChevronRight size={28} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Space (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Stats Section */}
          <section className="flex flex-col gap-6 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm md:shadow-none">
             <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Mes Statistiques</h2>
             <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-5 bg-red-50 rounded-3xl border border-red-100">
                  <Heart size={32} className="fill-[#CC1A1A] text-[#CC1A1A]" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#1A1A2E] leading-none">{user.lives}</span>
                    <span className="text-[10px] font-bold text-[#CC1A1A] uppercase tracking-widest">Énergies</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-3xl border border-orange-100">
                  <Zap size={32} className="fill-[#FF9500] text-[#FF9500]" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#1A1A2E] leading-none">{user.xp_total}</span>
                    <span className="text-[10px] font-bold text-[#FF9500] uppercase tracking-widest">XP Total</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-yellow-50 rounded-3xl border border-yellow-100">
                  <Flame size={32} className="fill-[#FF9500] text-[#FF9500]" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#1A1A2E] leading-none">{user.streak_days}</span>
                    <span className="text-[10px] font-bold text-[#FF9500] uppercase tracking-widest">Jours de série</span>
                  </div>
                </div>
             </div>
          </section>

          {/* Goal Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm md:shadow-none">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Objectif quotidien</h2>
            <div className="mb-4 flex items-end justify-between">
              <span className="text-3xl font-black text-[#1A1A2E] leading-none">{user.daily_xp}</span>
              <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest">/ {user.daily_goal} XP</span>
            </div>
            <ProgressBar value={user.daily_xp} max={user.daily_goal} className="h-4 rounded-full" />
            <div className="mt-6 flex flex-col gap-1 p-4 bg-gray-50 rounded-2xl">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Encore {user.daily_goal - user.daily_xp} XP à gagner !</p>
              <p className="text-[10px] text-gray-400 font-medium">Tes progrès aujourd'hui sont excellents, continue !</p>
            </div>
          </section>
        </aside>

      </main>
    </PageWrapper>
  );
}
