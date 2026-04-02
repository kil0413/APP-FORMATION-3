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
    const keywords = [];
    sections.forEach(s => {
      if (s.title) keywords.push(s.title);
      if (typeof s.content === 'string') {
        const words = s.content.split(' ').filter(w => w.length > 5);
        keywords.push(...words.slice(0, 10));
      }
      if (Array.isArray(s.items)) {
        keywords.push(...s.items);
      }
    });

    const ficheTitle = fiche.title;
    
    // On va générer des questions plus robustes en utilisant le contenu de la fiche
    const questionPool = [
      { 
        q: `Selon la fiche "${ficheTitle}", quelle est la définition principale ?`, 
        answers: [
          sections.find(s => s.type === 'definition')?.content?.slice(0, 80) + '...' || "La procédure standard d'opération.",
          "Une technique de repli rapide.",
          "Un protocole de communication radio.",
          "Une mesure de protection individuelle."
        ], 
        correct: 0, 
        explanation: `La définition correcte selon le cours est : ${sections.find(s => s.type === 'definition')?.content?.slice(0, 100) || 'Définit par le SDIS'}` 
      }
    ];

    // Générer dynamiquement des questions à partir des items/points clés
    const keypoints = sections.find(s => s.type === 'keypoints' || s.type === 'checklist')?.items || [];
    if (keypoints.length > 0) {
      keypoints.forEach((point, idx) => {
        questionPool.push({
          q: `Lequel de ces éléments est un point clé de "${ficheTitle}" ?`,
          answers: [
            point,
            "L'attente des renforts systématique",
            "La coupure immédiate du réseau",
            "Le retrait tactique sans ordre"
          ],
          correct: 0,
          explanation: `${point} est spécifiquement cité dans les points de vigilance de la fiche.`
        });
      });
    }

    // Ajouter des questions thématiques prédéfinies basées sur le titre
    const lowTitle = ficheTitle.toLowerCase();
    if (lowTitle.includes('gaz')) {
      questionPool.push(
        { q: 'Quelle est la densité du Méthane par rapport à l\'air ?', answers: ['Plus léger (< 1)', 'Plus lourd (> 1)', 'Identique', 'Inconnue'], correct: 0, explanation: 'Le méthane est plus léger et s\'accumule en partie haute.' },
        { q: 'Que signifie LIE ?', answers: ['Limite Inférieure d\'Explosivité', 'Largeur Interne Élastique', 'Ligne d\'Intervention Élite'], correct: 0, explanation: 'C\'est la concentration minimale de gaz dans l\'air pour une explosion.' }
      );
    } else if (lowTitle.includes('incendie') || lowTitle.includes('feu')) {
      questionPool.push(
        { q: 'Où se situe la zone de fumées la plus chaude ?', answers: ['Au plafond (partie haute)', 'Au sol', 'Au milieu de la pièce'], correct: 0, explanation: 'Les gaz chauds montent par convection (stratification).' },
        { q: 'Quel est l\'agent extincteur principal pour un feu de solide (Classe A) ?', answers: ['L\'eau', 'Le CO2', 'La poudre'], correct: 0, explanation: 'L\'eau agit par refroidissement sur les braises.' }
      );
    }

    // Mélanger le pool et s'assurer de l'unicité
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    const uniquePool = Array.from(new Set(questionPool.map(q => JSON.stringify(q)))).map(s => JSON.parse(s));
    const shuffled = shuffle(uniquePool);

    // Sélectionner le nombre demandé
    const selected = shuffled.slice(0, aiCount);

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
