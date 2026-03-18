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
      <Header title="Parcours SP" />
      
      <main className="flex flex-col gap-10 px-5 py-8 relative">
        <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Vos Modules</h2>

        {/* Style Duolingo Path: Ligne de connexion */}
        <div className="absolute left-[33px] top-[140px] bottom-0 w-1.5 bg-gray-100 z-0" />

        <div className="flex flex-col gap-10 z-10 relative">
          {categories.map((mod, i) => (
            <div key={mod.id} className="flex gap-4 group">
              {/* Point de la timeline */}
              <div className="relative z-10">
                <div 
                  className={`mt-4 flex h-10 w-10 items-center justify-center rounded-full border-4 shadow-xl transition-all ${mod.locked ? 'bg-gray-100 border-gray-100 text-gray-300' : 'bg-white border-[#CC1A1A] text-[#CC1A1A] active:scale-90'}`}
                  style={{ borderColor: !mod.locked ? mod.theme_header : '#e5e7eb' }}
                >
                  {mod.locked ? <Lock size={14} strokeWidth={4} /> : <div className="h-3 w-3 rounded-full" style={{ backgroundColor: mod.theme_header }} />}
                </div>
              </div>

              {/* Contenu du module */}
              <Card 
                className={`flex-1 transition-all rounded-[2rem] border-none shadow-2xl overflow-hidden ${mod.locked ? 'opacity-80 pointer-events-none filter grayscale-[80%]' : 'active:scale-[0.98]'}`}
                style={{ backgroundColor: mod.theme_bg }}
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div 
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg text-white`}
                        style={{ backgroundColor: mod.theme_header }}
                      >
                         <Shield size={28} />
                      </div>
                      <div>
                        <h3 className="font-black text-[#1A1A2E] text-xl leading-tight uppercase tracking-tighter italic">{mod.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Module théorique</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'action / état */}
                  {!mod.locked ? (
                    <button 
                      className="flex w-full items-center justify-center gap-3 rounded-[1.2rem] py-4 font-black uppercase tracking-widest text-xs transition-all shadow-xl group-active:scale-95"
                      style={{ backgroundColor: mod.theme_header, color: 'white' }}
                    >
                      <PlayCircle size={20} />
                      S'entraîner
                    </button>
                  ) : (
                    <button disabled className="flex w-full items-center justify-center gap-3 rounded-[1.2rem] bg-black/5 py-4 font-black uppercase tracking-widest text-xs text-gray-400 border border-dashed border-black/10">
                      <Lock size={20} />
                      Niveau insuffisant
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Trophée de fin */}
        <div className="flex gap-4 mt-4 z-10 relative">
          <div className="relative z-10">
            <div className={`mt-4 flex h-10 w-10 items-center justify-center rounded-full border-4 bg-gray-100 border-gray-200 text-gray-300 shadow-xl`}>
              <Trophy size={16} strokeWidth={4} />
            </div>
          </div>
          <Card className="flex-1 rounded-[2.5rem] border-4 border-dashed border-gray-100 bg-transparent flex items-center justify-center p-8 grayscale opacity-50 cursor-not-allowed shadow-none">
            <p className="font-black text-gray-400 text-center text-xs uppercase tracking-widest leading-relaxed">Terminez les modules pour l'examen de garde</p>
          </Card>
        </div>
      </main>
    </PageWrapper>
  );
}
