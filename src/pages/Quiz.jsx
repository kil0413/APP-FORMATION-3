import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Award, Flame, Heart, Zap, Info, ArrowRight, Star, Trophy, RefreshCcw, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXp, loseLife, user } = useAuthStore();
  const { fiches, quizzes } = useFicheStore();

  const currentFiche = fiches.find(f => f.id === id);
  const quiz = useMemo(() => quizzes.find(q => q.fiche_id === id), [quizzes, id]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [direction, setDirection] = useState(1);

  if (!quiz) {
    return (
      <div className="flex bg-[#1A1A2E] h-[100dvh] w-full items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-8">
           <div className="h-24 w-24 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-12">
              <Zap size={48} className="text-white" />
           </div>
           <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-white uppercase italic">Quiz en cours de création...</h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Revenez bientôt pour tester vos connaissances !</p>
           </div>
           <button onClick={() => navigate(-1)} className="px-10 py-5 bg-white text-[#1A1A2E] rounded-full font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
              Retour au répertoire
           </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentStep];
  const progress = ((currentStep + 1) / quiz.questions.length) * 100;

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
      // Vibration haptique simlée
      if ("vibrate" in navigator) navigator.vibrate(200);
    }
  };

  const nextStep = () => {
    if (currentStep < quiz.questions.length - 1) {
      setDirection(1);
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
    const xpGained = finalScore * 5; // 5 XP par bonne réponse
    addXp(xpGained);
    setIsFinished(true);
  };

  if (isFinished) {
    const successRate = (score / quiz.questions.length);
    const perfectScore = score === quiz.questions.length;

    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center p-8 bg-[#1A1A2E] text-center overflow-hidden relative">
        {/* Confetti simulation (Emojis) */}
        {perfectScore && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, x: Math.random() * 400 - 200, rotate: 0 }}
            animate={{ y: 800, x: Math.random() * 400 - 200, rotate: 360 }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-4xl pointer-events-none"
          >
            {['🔥', '🚒', '✨', '⭐', '🚒'][i % 5]}
          </motion.div>
        ))}

        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mb-10 relative"
        >
          <div className="absolute inset-0 bg-yellow-400 blur-[80px] opacity-20 scale-150 animate-pulse" />
          <div className="relative h-40 w-40 bg-white rounded-[3rem] flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
             <Trophy size={80} className={successRate > 0.8 ? "text-yellow-500" : "text-gray-300"} />
          </div>
          <div className="absolute -top-4 -right-4 h-16 w-16 bg-[#CC1A1A] rounded-full flex items-center justify-center border-4 border-[#1A1A2E] text-white shadow-xl">
              <Star size={32} className="fill-current" />
          </div>
        </motion.div>
        
        <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter text-white">
           {perfectScore ? 'PERFECT !' : successRate > 0.7 ? 'BIEN JOUÉ !' : 'ENTRAÎNE-TOI !'}
        </h2>
        <p className="text-white/40 font-bold mb-10 uppercase tracking-widest text-xs">Ton aptitude opérationnelle s'améliore.</p>
        
        <div className="flex flex-col gap-4 w-full max-w-sm mb-12">
          <div className="flex gap-4">
             <div className="flex-1 bg-white/[0.03] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="text-4xl font-black text-white mb-1 leading-none">{score}/{quiz.questions.length}</div>
                <div className="text-[10px] uppercase font-black text-white/30 tracking-widest leading-none">Précision</div>
             </div>
             <div className="flex-1 bg-white/[0.03] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="text-4xl font-black text-[#CC1A1A] mb-1 leading-none">+{score * 5}</div>
                <div className="text-[10px] uppercase font-black text-white/30 tracking-widest leading-none">Points XP</div>
             </div>
          </div>
          
          <div className="bg-[#CC1A1A]/10 p-6 rounded-[2rem] border border-[#CC1A1A]/20 flex items-center justify-between px-8">
             <div className="flex items-center gap-4">
                <Flame size={24} className="text-[#CC1A1A] fill-[#CC1A1A]" />
                <div className="flex flex-col items-start">
                   <span className="text-white font-black leading-none">{user.streak_days} JOURS</span>
                   <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Série actuelle</span>
                </div>
             </div>
             <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-[80%]" />
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm relative z-10">
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-white text-[#1A1A2E] py-6 rounded-3xl font-black uppercase shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all text-sm tracking-widest"
          >
            Quitter le centre
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-white/5 text-white/40 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:text-white transition-colors"
          >
            <RefreshCcw size={14} />
            Recommencer le quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-[#F8F9FD] font-['Inter']">
      {/* HEADER QUIZ */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between bg-white shadow-sm border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="text-gray-300 p-2 hover:text-[#1A1A2E] transition-colors rounded-full hover:bg-gray-50">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="flex-1 px-8">
           <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ type: "spring", stiffness: 50, damping: 20 }}
               className="h-full bg-[#CC1A1A] rounded-full shadow-lg shadow-red-500/20" 
             />
           </div>
        </div>
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-2xl border border-red-100 shadow-sm animate-in fade-in slide-in-from-right duration-500">
           <Heart size={18} className="text-red-500 fill-red-500" />
           <span className="text-sm font-black text-[#CC1A1A]">{user.lives}</span>
        </div>
      </header>

      {/* QUESTION AREA */}
      <main className="flex-1 px-6 md:px-12 pt-10 pb-32 overflow-y-auto no-scrollbar relative w-full max-w-4xl mx-auto">
        <div className="mb-10">
          <Badge className="bg-[#1A1A2E] text-white border-none font-black text-[9px] px-3 py-1.5 mb-4 tracking-widest uppercase">
             {currentFiche?.title || 'ÉVALUATION'}
          </Badge>
          <h2 className="text-3xl font-black text-[#1A1A2E] leading-tight italic tracking-tighter">
             {currentQuestion.q}
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = currentQuestion.correct === index;
            
            let cardStyle = "bg-white border-4 border-gray-50 text-[#1A1A2E] shadow-[0_5px_15px_rgba(0,0,0,0.02)]";
            if (isConfirmed) {
              if (isCorrect) cardStyle = "bg-green-50 border-green-500 text-green-700 shadow-green-500/10";
              else if (isSelected) cardStyle = "bg-red-50 border-red-500 text-red-700 shadow-red-500/10";
            } else if (isSelected) {
              cardStyle = "bg-white border-[#CC1A1A] text-[#1A1A2E] shadow-2xl -translate-y-1";
            }

            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(index)}
                className={`w-full text-left p-6 md:p-8 rounded-[2rem] font-bold text-lg md:text-xl transition-all duration-300 flex items-center justify-between relative group overflow-hidden ${cardStyle}`}
              >
                <div className="flex items-center gap-6 relative z-10">
                   <span className={cn(
                     "h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                     isSelected ? "bg-[#CC1A1A] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                   )}>
                      {String.fromCharCode(65 + index)}
                   </span>
                   <span className="flex-1">{answer}</span>
                </div>
                
                {isConfirmed && isCorrect && (
                  <div className="bg-green-500 text-white p-2 rounded-full relative z-10 animate-bounce">
                     <Check size={20} strokeWidth={4} />
                  </div>
                )}
                {isConfirmed && isSelected && !isCorrect && (
                   <div className="bg-red-500 text-white p-2 rounded-full relative z-10 animate-shake">
                     <X size={20} strokeWidth={4} />
                  </div>
                )}

                {/* Selection indicator bubble */}
                {!isConfirmed && isSelected && (
                  <div className="absolute top-0 right-0 h-20 w-20 bg-red-600/5 rounded-bl-[4rem]" />
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={cn(
                "mt-10 p-8 rounded-[2.5rem] border-4 shadow-2xl relative overflow-hidden",
                selectedAnswer === currentQuestion.correct ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'
              )}
            >
              <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className={cn("p-2 rounded-xl", selectedAnswer === currentQuestion.correct ? 'bg-green-100' : 'bg-red-100')}>
                  <Info size={20} className={selectedAnswer === currentQuestion.correct ? 'text-green-600' : 'text-red-600'} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  Explications de l'instructeur
                </span>
              </div>
              <p className="text-sm md:text-base font-bold leading-relaxed relative z-10 italic">"{currentQuestion.explanation}"</p>
              
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-current opacity-5 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER BUTTON - Floating Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full p-6 md:p-8 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] md:rounded-t-[3rem] z-50 flex justify-center">
        <div className="w-full max-w-4xl">
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className={cn(
                "w-full py-5 md:py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm md:text-base transition-all active:scale-95 shadow-2xl",
                selectedAnswer !== null 
                  ? 'bg-[#1A1A2E] text-white hover:bg-black' 
                  : 'bg-gray-100 text-gray-300 pointer-events-none'
              )}
            >
              VÉRIFIER LA RÉPONSE
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="w-full bg-[#CC1A1A] text-white py-5 md:py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm md:text-base transition-all active:scale-95 flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(204,26,26,0.3)] animate-in slide-in-from-bottom duration-300"
            >
              {currentStep < quiz.questions.length - 1 ? 'QUESTION SUIVANTE' : 'VOIR MES RÉSULTATS'}
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
