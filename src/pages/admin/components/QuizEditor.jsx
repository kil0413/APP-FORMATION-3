import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { useFicheStore } from '../../../store/useFicheStore';

export default function QuizEditor({ quiz, onClose }) {
  const { addQuiz, updateQuiz, fiches } = useFicheStore();
  
  const [formData, setFormData] = useState({
    title: '',
    fiche_id: '',
    is_published: true,
    questions: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCount, setAiCount] = useState(10);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        fiche_id: quiz.fiche_id || '',
        is_published: quiz.is_published ?? true,
        questions: quiz.questions ? Array.from(quiz.questions) : []
      });
    } else {
       // Si nouveau QCM, par défaut on propose la première fiche
       setFormData(prev => ({ ...prev, fiche_id: fiches[0]?.id || '' }));
    }
  }, [quiz, fiches]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...formData.questions];
    const newAnswers = [...newQuestions[qIndex].answers];
    newAnswers[aIndex] = value;
    newQuestions[qIndex].answers = newAnswers;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { q: '', answers: ['', '', '', ''], correct: 0, explanation: '' }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (window.confirm('Retirer cette question ?')) {
       const newQuestions = [...formData.questions];
       newQuestions.splice(index, 1);
       setFormData(prev => ({ ...prev, questions: newQuestions }));
    }
  };

  const handleAIGeneration = async () => {
    if (!formData.fiche_id) {
       alert("Veuillez d'abord sélectionner une Fiche Liée pour générer les questions.");
       return;
    }
    
    setIsGenerating(true);
    
    // Simulation d'un délai de calcul IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fiche = fiches.find(f => f.id === formData.fiche_id);
    if (!fiche) {
      setIsGenerating(false);
      return;
    }

    const sections = fiche.sections || [];
    const ficheTitle = fiche.title;
    const questionPool = [];

    // --- LOGIQUE GÉNÉRATION TYPE CONCOURS ---

    // 1. Question sur la Définition exacte (Terminologie SP)
    const defSection = sections.find(s => s.type === 'definition');
    if (defSection?.content) {
      questionPool.push({
        q: `Selon le GDO/GTS, quelle est la définition exacte rattachée à "${ficheTitle}" ?`,
        answers: [
          defSection.content.length > 100 ? defSection.content.slice(0, 100) + "..." : defSection.content,
          "Une action de reconnaissance immédiate sans binôme.",
          "Une procédure de sauvegarde des biens uniquement.",
          "Une technique d'extinction par étouffement total."
        ],
        correct: 0,
        explanation: "La terminologie opérationnelle est stricte : il s'agit de la définition officielle du référentiel SP."
      });
    }

    // 2. Questions sur les points clés / Checklist (Technique)
    const technicalItems = sections.find(s => s.type === 'keypoints' || s.type === 'checklist')?.items || [];
    if (technicalItems.length > 0) {
      technicalItems.forEach((item) => {
        // Template : Quel élément est préconisé ?
        questionPool.push({
          q: `Dans le cadre de "${ficheTitle}", quelle prescription technique est impérative ?`,
          answers: [
            item,
            "Le port du lot de sauvetage en systématique",
            "L'établissement d'une LDV 1000 en protection",
            "La coupure du courant au DIS"
          ],
          correct: 0,
          explanation: `${item} est une mesure de sécurité ou une étape technique cruciale citée dans la fiche.`
        });

        // Template : Quel est l'intrus ?
        if (technicalItems.length >= 2) {
           questionPool.push({
             q: `Lequel de ces éléments NE FAIT PAS partie des points de vigilance pour "${ficheTitle}" ?`,
             answers: [
               "Le port des gants de ménage standard",
               technicalItems[0],
               technicalItems[Math.floor(technicalItems.length/2)],
               "Le respect de la zone de sécurité"
             ],
             correct: 0,
             explanation: "Les gants de ménage ne sont pas des EPI conformes. Les autres points sont bien listés dans le référentiel."
           });
        }
      });
    }

    // 3. Génération basée sur les chiffres / Valeurs numériques (Type Concours)
    const contentText = sections.map(s => s.content).join(' ');
    const numbers = contentText.match(/\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/g) || [];
    if (numbers.length > 0) {
      numbers.forEach(num => {
        questionPool.push({
          q: `Quelle valeur numérique est associée à la mise en œuvre de "${ficheTitle}" dans ce contexte ?`,
          answers: [
            num,
            "La valeur par défaut du CODIS",
            "Le double de la valeur nominale",
            "Zéro"
          ],
          correct: 0,
          explanation: `La précision chiffrée (${num}) est essentielle pour la réussite du concours et la sécurité en intervention.`
        });
      });
    }

    // 4. Questions thématiques expertes (GNR/GDO)
    const lowTitle = ficheTitle.toLowerCase();
    if (lowTitle.includes('gaz')) {
      questionPool.push(
        { q: 'Quelle est la Zone de Danger Immédiat (ZDI) lors d\'une Fuite de Gaz Enflammée (FGE) ?', answers: ['Périmètre de 50 mètres', 'Périmètre de 100 mètres', 'Zone d\'exclusion totale'], correct: 0, explanation: 'En FGE, on établit une ZDI de 50m minimum en attendant le barrage.' },
        { q: 'Que signifie le code danger 23 sur une plaque d\'immatriculation de transport de matières dangereuses ?', answers: ['Gaz inflammable', 'Gaz toxique', 'Solide inflammable'], correct: 0, explanation: '2 = Gaz, 3 = Inflammable.' }
      );
    } else if (lowTitle.includes('incendie') || lowTitle.includes('combustion')) {
      questionPool.push(
        { q: 'Quel phénomène survient lors de l\'inflammation brutale des gaz de pyrolyse accumulés sous le plafond ?', answers: ['Le Flashover', 'Le Backdraft', 'Le Roll-over'], correct: 0, explanation: 'Le Flashover est le passage d\'un feu localisé à un embrasement généralisé.' },
        { q: 'Quelle est la concentration d\'O2 minimale pour entretenir une combustion vive ?', answers: ['15%', '21%', '5%', '10%'], correct: 0, explanation: 'En dessous de 15% d\'O2, la combustion s\'atténue ou s\'arrête.' }
      );
    } else if (lowTitle.includes('ari')) {
      questionPool.push(
        { q: 'À quelle pression retentit le sifflet de fin de charge sur un ARI standard ?', answers: ['55 bars (+/- 5 bars)', '30 bars', '100 bars'], correct: 0, explanation: 'Le sifflet prévient l\'utilisateur qu\'il doit quitter la zone immédiatement.' }
      );
    }

    // --- FIN LOGIQUE CONCOURS ---

    // Mélanger le pool et s'assurer de l'unicité des questions par intitulé
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    
    // Filtrage pour éviter les doublons de question même avec des réponses différentes
    const uniqueQuestionsMap = new Map();
    questionPool.forEach(item => {
      if (!uniqueQuestionsMap.has(item.q)) {
        uniqueQuestionsMap.set(item.q, item);
      }
    });

    const finalPool = shuffle(Array.from(uniqueQuestionsMap.values()));

    // Sélectionner le nombre demandé
    const selected = finalPool.slice(0, aiCount);

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, ...selected]
    }));
    
    setIsGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fiche_id) {
       alert('Sélectionnez une fiche à lier');
       return;
    }
    setIsSaving(true);

    try {
      if (quiz) {
        await updateQuiz(quiz.id, formData);
      } else {
        await addQuiz(formData);
      }
      onClose();
    } catch (err) {
      alert("Erreur: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-blue-50 to-white">
          <div>
            <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">
              {quiz ? 'Modifier le QCM' : 'Nouveau QCM'}
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Configurateur d'évaluations</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm transition-colors border border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="quiz-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest border-b border-gray-200 pb-2">Informations Générales</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Titre du QCM</label>
                <input 
                  required
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Quiz Général, Évaluation N1..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1A1A2E] outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fiche Liée (ID)</label>
                <select 
                  required
                  name="fiche_id"
                  value={formData.fiche_id}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1A1A2E] outline-none focus:border-blue-500"
                >
                  <option value="" disabled>Sélectionnez une Fiche</option>
                  {fiches.map(f => (
                    <option key={f.id} value={f.id}>{f.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  name="is_published"
                  id="qx_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="qx_published" className="text-[12px] font-bold uppercase tracking-widest text-[#1A1A2E] cursor-pointer">
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">Questions ({formData.questions.length})</h3>
                 <div className="flex items-center gap-3">
                   <select 
                     value={aiCount} 
                     onChange={e => setAiCount(Number(e.target.value))}
                     className="bg-white border border-gray-200 rounded-lg outline-none font-bold text-xs p-2 uppercase tracking-widest text-[#1A1A2E]"
                   >
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={40}>40</option>
                   </select>
                   <button 
                     type="button" 
                     onClick={handleAIGeneration}
                     disabled={isGenerating}
                     className="text-purple-600 bg-purple-50 hover:bg-purple-100 p-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors uppercase tracking-widest disabled:opacity-50 border border-purple-200"
                   >
                     {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                     {isGenerating ? 'Génération...' : 'Générer avec l\'IA'}
                   </button>
                   <button 
                     type="button" 
                     onClick={addQuestion}
                     className="text-blue-500 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors uppercase tracking-widest"
                   >
                     <Plus size={16} /> Ajouter
                   </button>
                 </div>
              </div>

              {formData.questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white border-2 border-gray-100 rounded-3xl p-6 relative group focus-within:border-blue-500/30 transition-colors">
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="flex items-start gap-3 mb-4 pr-10">
                     <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0">{qIndex + 1}</span>
                     <div className="flex-1">
                        <input
                          required
                          type="text"
                          value={q.q}
                          onChange={(e) => handleQuestionChange(qIndex, 'q', e.target.value)}
                          placeholder="Intitulé de la question..."
                          className="w-full bg-transparent border-b-2 border-gray-100 font-bold text-lg text-[#1A1A2E] px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                        />
                     </div>
                  </div>

                  <div className="space-y-3 pl-11 mb-4">
                     {q.answers.map((ans, aIndex) => (
                       <div key={aIndex} className="flex items-center gap-3">
                         <input 
                           type="radio" 
                           name={`correct-${qIndex}`} 
                           checked={q.correct === aIndex}
                           onChange={() => handleQuestionChange(qIndex, 'correct', aIndex)}
                           className="w-4 h-4 text-green-500 focus:ring-green-500"
                         />
                         <input
                           required
                           type="text"
                           value={ans}
                           onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                           placeholder={`Option ${aIndex + 1}`}
                           className={`flex-1 border-b px-2 py-1 text-sm outline-none transition-colors ${q.correct === aIndex ? 'border-green-300 bg-green-50/50 font-bold text-green-900' : 'border-gray-100 bg-gray-50'}`}
                         />
                       </div>
                     ))}
                  </div>

                  <div className="pl-11">
                    <div className="flex bg-orange-50 rounded-xl p-3 border border-orange-100 gap-3">
                       <HelpCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                       <input
                         required
                         type="text"
                         value={q.explanation}
                         onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                         placeholder="Explication de la réponse correcte..."
                         className="flex-1 bg-transparent border-none text-xs text-orange-900 outline-none placeholder:text-orange-300"
                       />
                    </div>
                  </div>
                </div>
              ))}

            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white z-10">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="quiz-form"
              disabled={isSaving}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-[#378ADD] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <span className="animate-pulse">Sauvegarde...</span>
              ) : (
                <>
                  <Save size={18} />
                  Enregistrer ce QCM
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
