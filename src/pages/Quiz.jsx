import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Trophy, Flame } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ProgressBar } from '../components/ui/ProgressBar';

const mockQuiz = {
  title: 'Bilans secouristes',
  questions: [
    { q: 'Quel bilan est prioritaire ?', answers: ['Circonstanciel', 'Vital', 'Lésionnel', 'Complémentaire'], correct: 1, explanation: 'Le bilan vital permet d\'identifier les détresses menaçant la vie immédiatement.' },
    { q: 'Que signifie PLS ?', answers: ['Position Latérale de Sécurité', 'Protection Légale de Secours', 'Poste Local Sanitaire', 'Premiers Lieux Sauvés'], correct: 0, explanation: 'La PLS maintient les voies aériennes libres.' },
    { q: 'Combien de temps vérifier la respiration ?', answers: ['3 secondes', '5 secondes', '10 secondes au maximum', '15 secondes'], correct: 2, explanation: 'La vérification de la respiration normale ne doit pas excéder 10 secondes (Regarder, Écouter, Sentir).' }
  ]
};

export default function Quiz() {
  const navigate = useNavigate();
  const { addXp, loseLife, user } = useAuthStore();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const q = mockQuiz.questions[currentIdx];
  const isAnswered = selectedIdx !== null;
  const isCorrect = selectedIdx === q.correct;

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    if (idx === q.correct) {
      setScore(s => s + 1);
    } else {
      loseLife();
    }
  };

  const handleNext = () => {
    if (currentIdx < mockQuiz.questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedIdx(null);
    } else {
      setFinished(true);
      const isPerfect = score === mockQuiz.questions.length;
      addXp(50 + (isPerfect ? 25 : 0));
    }
  };

  if (finished) {
    const isPerfect = score === mockQuiz.questions.length;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F2F2F7] px-6 text-center">
        <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-yellow-100 shadow-[0_0_40px_rgba(255,215,0,0.3)] border-4 border-yellow-400">
          <Trophy size={64} className="text-yellow-500 max-w-full scale-110" />
        </div>
        <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">Quiz Terminé !</h1>
        <p className="mt-2 text-lg font-medium text-[#8E8E93]">Score: <strong className="text-[#CC1A1A]">{score}</strong> / {mockQuiz.questions.length}</p>
        
        <div className="mt-8 flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-sm w-full font-bold">
          <div className="text-gray-500">XP Gagné</div>
          <div className="text-4xl text-[#FF9500]">+ {50 + (isPerfect ? 25 : 0)} XP ⚡</div>
          {isPerfect && <div className="mt-2 text-sm text-[#34C759]">Bonus Perfect: +25 XP</div>}
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 w-full rounded-2xl bg-[#CC1A1A] py-4 font-bold text-white shadow-md shadow-red-500/20 active:scale-95"
        >
          Continuer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col pt-10 px-5 relative pb-24">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 active:scale-95">
          <X size={28} className="text-[#8E8E93]" />
        </button>
        <ProgressBar value={(currentIdx / mockQuiz.questions.length) * 100} className="w-2/3 h-3 bg-gray-200" colorClass="bg-[#34C759]" />
        <div className="flex items-center gap-1 font-bold text-[#CC1A1A] text-lg">
          <span className="text-2xl pt-1">❤️</span> {user.lives}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-black text-[#1A1A2E] leading-tight tracking-tight mb-8">
          {q.q}
        </h2>

        <div className="flex flex-col gap-3">
          {q.answers.map((ans, idx) => {
            let stateClass = "bg-white border-2 border-transparent text-[#1A1A2E] shadow-sm";
            if (isAnswered) {
              if (idx === q.correct) stateClass = "bg-green-50 border-2 border-[#34C759] text-green-700 shadow-md shadow-green-500/10";
              else if (idx === selectedIdx) stateClass = "bg-red-50 border-2 border-[#CC1A1A] text-[#CC1A1A] shadow-md shadow-red-500/10";
              else stateClass = "bg-white opacity-50";
            }

            return (
              <button 
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`flex items-center justify-between rounded-2xl p-5 text-left font-bold transition-all active:scale-[0.98] ${stateClass}`}
              >
                <span className="text-[16px] leading-tight pr-4">{ans}</span>
                {isAnswered && idx === q.correct && <Check size={28} className="text-[#34C759] stroke-[3px]" />}
                {isAnswered && idx === selectedIdx && idx !== q.correct && <X size={28} className="text-[#CC1A1A] stroke-[3px]" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Zone */}
        {isAnswered && (
          <div className={`mt-8 rounded-2xl p-5 border shadow-sm animate-[fadeUp_0.4s_ease-out_forwards] ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`text-xl font-black mb-2 flex items-center gap-2 ${isCorrect ? 'text-[#34C759]' : 'text-[#CC1A1A]'}`}>
              {isCorrect ? <><Check strokeWidth={4} /> Excellent !</> : <><X strokeWidth={4} /> Incorrect</>}
            </h3>
            <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full max-w-[390px] bg-white p-4 border-t border-gray-100 safe-area-bottom pb-6">
        <button
          disabled={!isAnswered}
          onClick={handleNext}
          className="w-full rounded-2xl bg-[#CC1A1A] py-4 font-bold text-lg text-white disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-95 shadow-md shadow-red-500/20"
        >
          {currentIdx === mockQuiz.questions.length - 1 ? 'Terminer' : 'Continuer'}
        </button>
      </div>
    </div>
  );
}
