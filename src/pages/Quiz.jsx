import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Award, Flame, Heart, Zap, Info, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz() {
  const { id } = useParams(); // ID de la fiche
  const navigate = useNavigate();
  const { addXp, loseLife, user } = useAuthStore();
  const { fiches, quizzes } = useFicheStore();

  const currentFiche = fiches.find(f => f.id === id);
  const quiz = quizzes.find(q => q.fiche_id === id);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!quiz) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6 bg-[#F2F2F7] text-center">
        <h2 className="text-2xl font-black mb-4">Quiz non disponible</h2>
        <p className="text-gray-500 mb-8">Désolé, cette fiche n'a pas encore de quiz associé.</p>
        <button onClick={() => navigate(-1)} className="bg-[#CC1A1A] text-white px-8 py-3 rounded-full font-bold">Retour</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentStep];
  const progress = ((currentStep) / quiz.questions.length) * 100;

  const handleSelect = (index) => {
    if (isConfirmed) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    setIsConfirmed(true);
    setShowExplanation(true);

    if (selectedAnswer === currentQuestion.correct) {
      setScore(s => s + 1);
    } else {
      loseLife();
    }
  };

  const nextStep = () => {
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedAnswer(null);
      setIsConfirmed(false);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalScore = selectedAnswer === currentQuestion.correct ? score + 1 : score;
    const xpGained = finalScore * 25; // 25 XP par bonne réponse
    addXp(xpGained);
    setIsFinished(true);
  };

  if (isFinished) {
    const success = (score / quiz.questions.length) >= 0.5;
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 bg-[#F2F2F7] text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-8"
        >
          <Award size={100} className={success ? "text-yellow-500" : "text-gray-400"} />
        </motion.div>
        
        <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Quiz Terminé !</h2>
        <p className="text-gray-500 font-bold mb-8">Excellent effort, Sapeur.</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-gray-100">
            <div className="text-2xl font-black text-[#CC1A1A]">{score}/{quiz.questions.length}</div>
            <div className="text-[10px] uppercase font-black text-gray-400">Score</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-gray-100">
            <div className="text-2xl font-black text-blue-500">+{score * 25}</div>
            <div className="text-[10px] uppercase font-black text-gray-400">XP Gagné</div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="w-full max-w-sm bg-[#CC1A1A] text-white py-5 rounded-3xl font-black uppercase shadow-xl shadow-red-500/20 active:scale-95 transition-all"
        >
          Retour à la base
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F2F2F7] font-['Inter']">
      {/* HEADER QUIZ */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 p-2">
          <X size={24} />
        </button>
        <div className="flex-1 px-4">
           <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#CC1A1A]" />
           </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
           <Heart size={16} className="text-red-500 fill-red-500" />
           <span className="text-sm font-black">{user.lives}</span>
        </div>
      </header>

      {/* QUESTION AREA */}
      <main className="flex-1 px-6 pt-8 pb-24 overflow-y-auto no-scrollbar">
        <div className="mb-10">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Question {currentStep + 1} sur {quiz.questions.length}</span>
          <h2 className="text-2xl font-black text-[#1A1A2E] leading-tight italic">{currentQuestion.q}</h2>
        </div>

        <div className="flex flex-col gap-4">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = currentQuestion.correct === index;
            
            let cardClass = "bg-white border-2 border-gray-100 text-[#1A1A2E] shadow-sm";
            if (isConfirmed) {
              if (isCorrect) cardClass = "bg-green-100 border-green-500 text-green-700 shadow-green-200 ring-2 ring-green-100";
              else if (isSelected) cardClass = "bg-red-100 border-red-500 text-red-700 shadow-red-200 ring-2 ring-red-100";
            } else if (isSelected) {
              cardClass = "bg-blue-50 border-blue-500 text-blue-700 ring-4 ring-blue-50 scale-[1.02]";
            }

            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(index)}
                className={`w-full text-left p-5 rounded-[1.5rem] font-bold text-sm transition-all duration-200 flex items-center justify-between ${cardClass}`}
              >
                <span>{answer}</span>
                {isConfirmed && isCorrect && <Check size={20} className="text-green-600" />}
                {isConfirmed && isSelected && !isCorrect && <X size={20} className="text-red-600" />}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-6 rounded-3xl border-b-4 ${selectedAnswer === currentQuestion.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} className={selectedAnswer === currentQuestion.correct ? 'text-green-600' : 'text-red-600'} />
                <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedAnswer === currentQuestion.correct ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedAnswer === currentQuestion.correct ? 'Bonne réponse !' : 'Oups...'}
                </span>
              </div>
              <p className="text-xs font-bold leading-relaxed">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER BUTTON */}
      <footer className="fixed bottom-0 w-full max-w-[390px] p-6 bg-white/80 backdrop-blur-md border-t border-gray-100">
        {!isConfirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            className={`w-full py-5 rounded-3xl font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl ${
              selectedAnswer !== null ? 'bg-[#1A1A2E] text-white opacity-100 transform translate-y-0' : 'bg-gray-200 text-gray-400 pointer-events-none'
            }`}
          >
            VÉRIFIER
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="w-full bg-[#CC1A1A] text-white py-5 rounded-3xl font-[1000] uppercase tracking-tighter transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-red-500/20"
          >
            {currentStep < quiz.questions.length - 1 ? 'CONTINUER' : 'TERMINER'}
            <ArrowRight size={20} />
          </button>
        )}
      </footer>
    </div>
  );
}
