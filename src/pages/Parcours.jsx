import { Lock, Map, BookOpen, ChevronRight, PlayCircle, Trophy, Flag, Shield, Flame, CheckCircle2, Star, Zap, Target, MousePointer2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useFicheStore } from '../store/useFicheStore';
import { useNavigate } from 'react-router-dom';

export default function Parcours() {
  const { categories, fiches } = useFicheStore();
  const navigate = useNavigate();

  // On sépare les catégories en "Unités" de formation
  const units = [
    { 
      id: 'u1', 
      title: 'UNITÉ 1 : LES FONDAMENTAUX', 
      desc: 'Maîtrisez les bases du secours à personne et des incendies urbains.',
      categoryIds: ['c1', 'c2'] 
    },
    { 
      id: 'u2', 
      title: 'UNITÉ 2 : RISQUES SPÉCIFIQUES', 
      desc: 'Intervention en milieu périlleux et risques NRBC.',
      categoryIds: ['c3', 'c6'] 
    },
    { 
      id: 'u3', 
      title: 'UNITÉ 3 : LEADERSHIP & COM', 
      desc: 'Gestion des transmissions et commandement opérationnel.',
      categoryIds: ['c4', 'c5'] 
    }
  ];

  return (
    <PageWrapper>
      <Header title="Mon Parcours" className="md:hidden" />
      
      <main className="flex flex-col gap-16 px-5 py-8 md:px-10 md:py-16 relative max-w-4xl mx-auto w-full mb-20">
        
        {/* Header Parcours */}
        <section className="flex flex-col items-center text-center gap-6 mb-8 mt-4">
          <div className="h-24 w-24 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-500/20 rotate-3">
            <Map size={48} className="text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Mon <span className="text-[#CC1A1A]">Odyssée</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Parcours de progression opérationnel</p>
          </div>
          
          <div className="w-full max-w-xs bg-gray-100 h-3 rounded-full overflow-hidden mt-4 p-0.5 border border-gray-200">
             <div className="h-full bg-[#CC1A1A] rounded-full w-[35%] shadow-sm" />
          </div>
          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Global : 35% de la formation complétée</p>
        </section>

        {units.map((unit, unitIdx) => (
          <div key={unit.id} className="flex flex-col gap-12 relative">
            
            {/* Unit Header */}
            <div className={`p-8 rounded-[3rem] shadow-xl border-4 border-white ${unitIdx === 0 ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-400 opacity-60'}`}>
              <div className="flex flex-col gap-2">
                 <h2 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase">{unit.title}</h2>
                 <p className="text-xs font-bold opacity-60 uppercase tracking-widest leading-relaxed">{unit.desc}</p>
              </div>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center gap-20 relative pt-10">
              {/* Vertical Path Line (Vrai Zig-Zag possible via SVG, ici simule) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gray-100 -z-10" />

              {unit.categoryIds.map((catId, idx) => {
                const cat = categories.find(c => c.id === catId);
                if (!cat) return null;

                // Calcul du décalage pour le zig-zag
                const sideShift = idx % 2 === 0 ? '-translate-x-12 md:-translate-x-12' : 'translate-x-12 md:translate-x-12';
                const isLocked = unitIdx > 0 || (unitIdx === 0 && idx > 1); // Simulation de lock

                return (
                  <div key={cat.id} className={`flex flex-col items-center gap-4 relative transition-all ${sideShift}`}>
                    
                    {/* Level Badge / Node */}
                    <div className="relative group">
                       <div 
                         onClick={() => !isLocked && navigate('/repertoire')}
                         className={`h-24 w-24 md:h-28 md:w-28 rounded-full flex items-center justify-center border-8 transition-all relative z-10 cursor-pointer ${
                           isLocked 
                           ? 'bg-gray-100 border-gray-200 text-gray-300' 
                           : 'bg-white shadow-2xl active:scale-90 hover:scale-105'
                         }`}
                         style={{ borderColor: isLocked ? '#e5e7eb' : cat.theme_header }}
                       >
                         {isLocked ? (
                           <Lock size={32} className="opacity-40" />
                         ) : (
                           <div 
                             className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg"
                             style={{ backgroundColor: cat.theme_header }}
                           >
                             <Shield size={32} />
                           </div>
                         )}
                         
                         {/* Progress Mini-Circle overlay */}
                         {!isLocked && (
                           <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg border border-gray-100">
                             <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                               <CheckCircle2 size={18} />
                             </div>
                           </div>
                         )}
                       </div>

                       {/* Hover Label Desktop */}
                       <div className="absolute top-1/2 -translate-y-1/2 left-full ml-10 hidden md:flex flex-col opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <span className="font-black text-xs uppercase tracking-widest text-gray-400">Étape {idx + 1}</span>
                          <span className="font-black text-xl uppercase tracking-tighter italic text-[#1A1A2E]">{cat.name}</span>
                       </div>
                    </div>

                    {/* Label Mobile / All */}
                    <div className="text-center flex flex-col gap-1 mt-2">
                       <span className={`font-black text-lg md:text-xl uppercase tracking-tighter italic ${isLocked ? 'text-gray-300' : 'text-[#1A1A2E]'}`}>{cat.name}</span>
                       {idx === 0 && unitIdx === 0 && (
                         <div className="flex items-center gap-1 justify-center">
                           <Star size={10} className="fill-yellow-400 text-yellow-400" />
                           <Star size={10} className="fill-yellow-400 text-yellow-400" />
                           <Star size={10} className="fill-gray-200 text-gray-200" />
                         </div>
                       )}
                    </div>

                    {/* Side Icon Decorative */}
                    <div className={`absolute top-0 opacity-10 pointer-events-none ${idx % 2 === 0 ? '-right-32' : '-left-32'}`}>
                       <Shield size={120} />
                    </div>
                  </div>
                );
              })}

              {/* Boss / Quiz Level */}
              <div className="flex flex-col items-center gap-4 py-8 relative">
                 <div className={`h-32 w-32 md:h-40 md:w-40 rounded-[3rem] border-8 flex items-center justify-center transition-all bg-[#CC1A1A] border-[#1A1A2E] rotate-6 shadow-2xl relative z-10 ${unitIdx === 0 ? 'cursor-pointer active:scale-95' : 'opacity-40 grayscale pointer-events-none'}`}>
                    <Trophy size={64} className="text-white" />
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-[#1A1A2E] px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl rotate-12">
                      BIG QUIZ
                    </div>
                 </div>
                 <h3 className="font-black text-lg uppercase tracking-tight text-[#1A1A2E]">ÉVALUATION UNITÉ {unitIdx + 1}</h3>
              </div>
            </div>

            {/* Connector Lines (SVG style between units) */}
            {unitIdx < units.length - 1 && (
               <div className="h-32 flex flex-col items-center relative">
                  <div className="w-1.5 h-full bg-gradient-to-b from-gray-100 to-gray-200" />
                  <div className="absolute -bottom-4 bg-gray-200 p-2 rounded-full">
                     <Lock size={16} className="text-white" />
                  </div>
               </div>
            )}
          </div>
        ))}

        {/* Final Exam Section */}
        <section className="mt-20 flex flex-col items-center gap-12 text-center">
           <div className="h-40 w-40 bg-gray-50 border-8 border-dashed border-gray-100 rounded-full flex items-center justify-center grayscale opacity-50 relative">
              <div className="absolute inset-0 rounded-full animate-pulse bg-gray-100/30" />
              <Flag size={64} className="text-gray-300" />
           </div>
           <div className="flex flex-col gap-4 max-w-sm">
             <h4 className="text-2xl font-black uppercase tracking-tighter italic text-gray-300">EXAMEN DE GARDE</h4>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Terminez toutes les unités pour devenir opérationnel et débloquer ton certificat de fin de parcours.</p>
           </div>
        </section>
      </main>
    </PageWrapper>
  );
}
