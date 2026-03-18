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
      <Header showLogo />
      
      <main className="flex flex-col gap-6 px-4 py-6">
        {/* Stats Bar */}
        <section className="flex items-center justify-between gap-3">
          <Card className="flex flex-1 items-center justify-center py-3">
            <div className="flex items-center gap-1.5 font-bold text-[#1A1A2E]">
              <Heart size={20} className="fill-[#CC1A1A] text-[#CC1A1A]" />
              <span className="text-lg tracking-tight">{user.lives}</span>
            </div>
          </Card>
          <Card className="flex flex-1 items-center justify-center py-3">
            <div className="flex items-center gap-1.5 font-bold text-[#1A1A2E]">
              <Zap size={20} className="fill-[#FF9500] text-[#FF9500]" />
              <span className="text-lg tracking-tight">{user.xp_total}</span>
            </div>
          </Card>
          <Card className="flex flex-1 items-center justify-center py-3">
            <div className="flex items-center gap-1.5 font-bold text-[#1A1A2E]">
              <Flame size={20} className="fill-[#FF9500] text-[#FF9500]" />
              <span className="text-lg tracking-tight">{user.streak_days}</span>
            </div>
          </Card>
        </section>

        {/* Objectif Quotidien */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A1A2E]">Objectif quotidien</h2>
            <span className="text-sm font-semibold text-[#8E8E93]">{user.daily_xp} / {user.daily_goal} XP</span>
          </div>
          <ProgressBar value={user.daily_xp} max={user.daily_goal} className="h-3" />
          <p className="mt-2 text-sm text-[#8E8E93]">Continue comme ça ! Plus que 350 XP aujourd'hui.</p>
        </section>

        {/* Module en cours */}
        <section>
          <Card className="relative overflow-hidden bg-[#1A1A2E] text-white">
            <CardContent className="flex flex-col p-6">
              <div className="mb-4">
                <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-[#CC1A1A] backdrop-blur-sm">
                  EN COURS
                </Badge>
              </div>
              <h2 className="mb-2 text-xl font-bold tracking-tight">Risque Gaz</h2>
              <p className="mb-6 text-sm text-gray-400 font-medium">{nrbcCategory} • Module 1</p>
              
              <button 
                onClick={() => navigate('/fiche/f4')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC1A1A] px-6 py-3.5 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                Reprendre le cours
                <Play size={16} className="fill-current" />
              </button>
            </CardContent>
            
            {/* Décoration BG */}
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          </Card>
        </section>

        {/* Outils d'apprentissage */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#1A1A2E] tracking-tight">Outils d'apprentissage</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="transition-transform active:scale-95 cursor-pointer" onClick={() => navigate('/repertoire')}>
              <CardContent className="flex flex-col items-start gap-4 p-5">
                <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A2E]">Flashcards</h3>
                  <p className="text-xs text-[#8E8E93] font-medium mt-1">Révisez par thème</p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-transform active:scale-95 cursor-pointer" onClick={() => navigate('/quiz')}>
              <CardContent className="flex flex-col items-start gap-4 p-5">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A2E]">Quiz Rapide</h3>
                  <p className="text-xs text-[#8E8E93] font-medium mt-1">Testez-vous</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dernières leçons */}
        <section className="mb-4">
          <h2 className="mb-4 text-xl font-bold text-[#1A1A2E] tracking-tight">Dernières leçons</h2>
          <div className="flex flex-col gap-3">
            {[
              { id: 1, title: 'Bilan vital', sub: 'Secourisme', done: true, icon: '❤️' },
              { id: 2, title: 'Pose d\'un garrot', sub: 'Procédure', done: false, icon: '🩸' },
              { id: 3, title: 'Protection et alerte', sub: 'Sécurité Civile', done: false, icon: '⚠️' }
            ].map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer transition-transform active:scale-[0.98]">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl">
                    {lesson.icon}
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-[#1A1A2E]">{lesson.title}</h3>
                    <p className="text-xs font-medium text-[#8E8E93]">{lesson.sub}</p>
                  </div>
                  <div>
                    {lesson.done ? (
                      <CheckCircle2 size={24} className="text-[#34C759]" />
                    ) : (
                      <ChevronRight size={24} className="text-gray-300" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
