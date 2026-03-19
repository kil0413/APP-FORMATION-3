import { Lock, Map, BookOpen, ChevronRight, PlayCircle, Trophy, Flag, Shield, Flame } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useFicheStore } from '../store/useFicheStore';

export default function Parcours() {
  const { categories } = useFicheStore();

  return (
    <PageWrapper>
      <Header title="Parcours SP" className="md:hidden" />
      
      <main className="flex flex-col gap-10 px-5 py-8 md:px-10 md:py-12 relative max-w-4xl mx-auto w-full">
        {/* Title Desktop */}
        <div className="hidden md:flex flex-col gap-3 mb-4">
          <h1 className="text-4xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Mon <span className="text-[#CC1A1A]">Avancement</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Suis ton parcours de formation étape par étape.</p>
        </div>

        <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic md:hidden">Vos Modules</h2>

        {/* Style Duolingo Path: Ligne de connexion */}
        <div className="absolute left-[33px] md:left-[53px] top-[140px] md:top-[220px] bottom-0 w-1.5 bg-gray-100 z-0" />

        <div className="flex flex-col gap-10 z-10 relative">
          {categories.map((mod, i) => (
            <div key={mod.id} className="flex gap-4 md:gap-8 group">
              {/* Point de la timeline */}
              <div className="relative z-10">
                <div 
                  className={`mt-4 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full border-4 shadow-xl transition-all ${mod.locked ? 'bg-gray-100 border-gray-100 text-gray-300' : 'bg-white border-[#CC1A1A] text-[#CC1A1A] active:scale-90 group-hover:scale-110'}`}
                  style={{ borderColor: !mod.locked ? mod.theme_header : '#e5e7eb' }}
                >
                  {mod.locked ? <Lock size={14} strokeWidth={4} /> : <div className="h-3 w-3 md:h-5 md:w-5 rounded-full" style={{ backgroundColor: mod.theme_header }} />}
                </div>
              </div>

              {/* Contenu du module */}
              <Card 
                className={`flex-1 transition-all rounded-[2.5rem] border-none shadow-2xl overflow-hidden hover:shadow-red-500/10 ${mod.locked ? 'opacity-80 pointer-events-none filter grayscale-[80%]' : 'hover:-translate-y-1'}`}
                style={{ backgroundColor: mod.theme_bg }}
              >
                <CardContent className="flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-10">
                  <div className="flex-1 flex gap-6">
                    <div 
                      className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-[1.5rem] md:rounded-[2rem] shadow-lg text-white shrink-0`}
                      style={{ backgroundColor: mod.theme_header }}
                    >
                       <Shield size={32} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-black text-[#1A1A2E] text-2xl leading-tight uppercase tracking-tighter italic">{mod.name}</h3>
                      <p className="text-[11px] font-black uppercase tracking-widest mt-1 opacity-50">Module théorique de base</p>
                    </div>
                  </div>

                  {/* Bouton d'action / état */}
                  {!mod.locked ? (
                    <button 
                      className="flex md:w-48 items-center justify-center gap-3 rounded-[1.5rem] py-5 md:py-6 font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:brightness-110 active:scale-95"
                      style={{ backgroundColor: mod.theme_header, color: 'white' }}
                    >
                      <PlayCircle size={24} />
                      Reprendre
                    </button>
                  ) : (
                    <button disabled className="flex md:w-48 items-center justify-center gap-3 rounded-[1.5rem] bg-black/5 py-5 md:py-6 font-black uppercase tracking-widest text-xs text-gray-400 border border-dashed border-black/10">
                      <Lock size={20} />
                      Verrouillé
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Trophée de fin */}
        <div className="flex gap-4 md:gap-8 mt-4 z-10 relative">
          <div className="relative z-10">
            <div className={`mt-4 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full border-4 bg-gray-100 border-gray-200 text-gray-300 shadow-xl`}>
              <Trophy size={20} strokeWidth={4} />
            </div>
          </div>
          <Card className="flex-1 rounded-[3rem] border-4 border-dashed border-gray-100 bg-transparent flex items-center justify-center p-12 md:p-20 grayscale opacity-50 cursor-not-allowed shadow-none">
            <div className="flex flex-col items-center gap-4">
               <Flag size={48} className="text-gray-300" />
               <p className="font-black text-gray-400 text-center text-sm uppercase tracking-widest leading-relaxed max-w-xs">Terminez tous les modules pour accéder à l'examen de garde final</p>
            </div>
          </Card>
        </div>
      </main>
    </PageWrapper>
  );
}
