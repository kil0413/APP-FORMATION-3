import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

const mockProcedure = {
  id: 'p1', title: 'Pose d\'un garrot tactique',
  steps: [
    { title: 'Évaluation', description: 'Identifier que l\'hémorragie nécessite un garrot. S\'assurer que la zone est sécurisée.', imgColor: 'bg-red-100' },
    { title: 'Mise en place', description: 'Positionner le garrot à 5cm au-dessus de la plaie, au-dessus du vêtement si possible.', imgColor: 'bg-orange-100' },
    { title: 'Serrage', description: 'Serrer la sangle au maximum puis tourner la tige jusqu\'à l\'arrêt du saignement.', imgColor: 'bg-yellow-100' },
    { title: 'Verrouillage', description: 'Bloquer la tige dans le clip de verrouillage et sécuriser avec la sangle.', imgColor: 'bg-green-100' },
    { title: 'Heure', description: 'Noter l\'heure de pose visiblement (H sur le front, ou sur la sangle).', imgColor: 'bg-blue-100' }
  ]
};

export default function Procedure() {
  const navigate = useNavigate();
  const { addXp } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showXPFeedback, setShowXPFeedback] = useState(null);

  const handleNext = () => {
    if (currentStep < mockProcedure.steps.length - 1) {
      setCurrentStep(curr => curr + 1);
      // Partial XP
      addXp(5);
      setShowXPFeedback(5);
      setTimeout(() => setShowXPFeedback(null), 1500);
    } else {
      setCompleted(true);
      addXp(10); // Final XP
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  if (completed) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#F2F2F7] flex-col gap-6 px-6 relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-[#34C759] shadow-xl animate-bounce">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">Procédure terminée !</h1>
        <div className="rounded-2xl bg-white p-6 shadow-sm w-full">
          <p className="text-center font-bold text-lg text-gray-500">Gains totaux</p>
          <p className="text-center font-bold text-4xl text-[#FF9500] mt-2">+35 XP ⚡</p>
        </div>
        <button 
          onClick={() => navigate('/quiz')}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white bg-[#CC1A1A] mt-8 shadow-md shadow-red-500/20 active:scale-95"
        >
          Lancer le Quiz
        </button>
        <button className="text-[#8E8E93] font-bold mt-2 hover:text-[#1A1A2E]" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const step = mockProcedure.steps[currentStep];

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      {/* Header compact */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-white z-10 w-full max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 active:scale-95">
          <ChevronLeft size={28} />
        </button>
        <ProgressBar value={(currentStep / mockProcedure.steps.length) * 100} className="w-2/3 h-2 bg-gray-100" />
        <span className="text-sm font-bold text-[#8E8E93]">{currentStep + 1}/{mockProcedure.steps.length}</span>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Mock Image Zone */}
        <div className={`w-full aspect-square ${step.imgColor} flex items-center justify-center transition-colors duration-500 overflow-hidden relative shadow-inner`}>
          <span className="text-6xl opacity-30 font-bold mix-blend-overlay">IMG {currentStep + 1}</span>
          
          {showXPFeedback && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF9500] text-white px-4 py-2 rounded-full font-bold text-lg animate-[fadeUp_1.5s_ease-out_forwards]">
              +{showXPFeedback} XP
            </div>
          )}
        </div>

        {/* Text Zone */}
        <div className="flex-1 px-6 md:px-12 py-8 flex flex-col items-center text-center bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] -mt-6 z-20 overflow-y-auto no-scrollbar">
          <Badge className="mb-4 bg-gray-100 text-[#1A1A2E]">{mockProcedure.title}</Badge>
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A2E] tracking-tight">{step.title}</h2>
          <p className="mt-4 text-[16px] md:text-lg text-[#8E8E93] font-medium leading-relaxed max-w-2xl px-4">
            {step.description}
          </p>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="p-6 md:p-8 pb-safe flex items-center justify-between gap-4 bg-white z-20 shadow-[0_-1px_10px_rgba(0,0,0,0.02)] max-w-5xl mx-auto w-full">
        <button 
          onClick={handlePrev} 
          disabled={currentStep === 0}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-[#1A1A2E] disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-95"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#CC1A1A] text-white font-bold text-lg shadow-md shadow-red-500/20 transition-transform active:scale-[0.98]"
        >
          {currentStep === mockProcedure.steps.length - 1 ? 'Terminer' : 'Suivant'}
          {currentStep !== mockProcedure.steps.length - 1 && <ChevronRight size={24} />}
        </button>
      </div>
    </div>
  );
}
