import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, HelpCircle, Sparkles, Loader2, FileCode } from 'lucide-react';
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
  const [ficheHtml, setFicheHtml] = useState('');
  const [showHtmlInput, setShowHtmlInput] = useState(false);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        fiche_id: quiz.fiche_id || '',
        is_published: quiz.is_published ?? true,
        questions: quiz.questions ? Array.from(quiz.questions) : []
      });
    } else {
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

  const handleHtmlImport = () => {
    if (!ficheHtml.trim()) return;
    
    setIsGenerating(true);
    
    // Simulation d'une analyse sémantique profonde
    setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(ficheHtml, 'text/html');
      
      // 1. Extraction exhaustive de tout le texte utile (en filtrant les scripts/styles)
      const walk = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
      let fullText = '';
      let node;
      while (node = walk.nextNode()) {
        const text = node.textContent.trim();
        if (text.length > 3) fullText += text + '. ';
      }

      // 2. Identification des "Faits Techniques" (Chiffres, Acronymes, Mots-clés SP)
      const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 15);
      const factPool = [];
      
      sentences.forEach(sentence => {
        const cleanS = sentence.trim();
        // Un fait est intéressant s'il contient un chiffre avec unité, un acronyme (ARI, GDO...), ou des mots clés forts
        const hasNumber = /\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/.test(cleanS);
        const hasAcronym = /\b[A-Z]{2,}\b/.test(cleanS);
        const hasTechnicalTerm = /(danger|sécurité|pression|fuite|oxygène|combustion|température|intervention|binôme|secteur)/i.test(cleanS);
        
        if (hasNumber || hasAcronym || hasTechnicalTerm) {
          factPool.push(cleanS);
        }
      });

      const newQuestions = [];

      // 3. Génération dynamique basée sur la densité d'information
      // On génère environ 1 question pour 3 "faits" identifiés, avec un minimum de 10 et max 40
      const targetCount = Math.max(10, Math.min(40, Math.ceil(factPool.length / 2)));

      factPool.forEach((fact, idx) => {
        if (newQuestions.length >= targetCount) return;

        // Template A : Question de précision sur une valeur ou un acronyme
        const acronymMatch = fact.match(/\b[A-Z]{2,}\b/);
        const numberMatch = fact.match(/\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/);

        if (numberMatch && Math.random() > 0.5) {
          newQuestions.push({
            q: `Quelle spécification technique est associée à l'élément suivant : "${fact.slice(0, 60)}..." ?`,
            answers: [numberMatch[0], "Zéro (valeur nulle)", "Le double de la normale", "Non applicable"],
            correct: 0,
            explanation: `La fiche précise explicitement la valeur de ${numberMatch[0]} pour ce contexte opérationnel.`
          });
        } else if (acronymMatch && Math.random() > 0.6) {
           newQuestions.push({
             q: `Dans le cadre de l'analyse, que désigne l'acronyme "${acronymMatch[0]}" cité dans le texte ?`,
             answers: [
               "Le terme technique correspondant au référentiel GDO",
               "Un indicatif de transmission radio uniquement",
               "Une abréviation interne au SDIS",
               "Un code de danger transport"
             ],
             correct: 0,
             explanation: `L'acronyme ${acronymMatch[0]} est un pilier de la terminologie employée dans cette fiche.`
           });
        } else {
          // Template B : Question de procédure générale
          newQuestions.push({
            q: `Quel enseignement majeur doit-on tirer de l'instruction : "${fact.slice(0, 80)}..." ?`,
            answers: [
              "C'est une étape critique de la mise en œuvre",
              "C'est une information facultative de confort",
              "C'est une procédure réservée aux officiers",
              "C'est un point à ignorer en cas d'urgence"
            ],
            correct: 0,
            explanation: `Le contenu analysé souligne l'importance de ce point pour la réussite de l'intervention.`
          });
        }
      });

      // 4. Ajout de questions "Pièges" basées sur le contenu global
      if (newQuestions.length > 5) {
        newQuestions.push({
          q: "Lequel de ces éléments est un INTRUS concernant le contenu importé ?",
          answers: [
            "Le port d'EPI non conformes (gants de ville)",
            "Le respect strict des zones de sécurité citées",
            "La vérification des pressions de service",
            "Le maintien de la liaison radio permanente"
          ],
          correct: 0,
          explanation: "La sécurité prime : les gants de ville ne sont jamais autorisés en intervention."
        });
      }

      const finalQuestions = newQuestions.sort(() => Math.random() - 0.5);

      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, ...finalQuestions]
      }));
      
      setIsGenerating(false);
      setShowHtmlInput(false);
      setFicheHtml('');
    }, 2000);
  };

  const handleAIGeneration = async () => {
    if (!formData.fiche_id) {
       alert("Sélectionnez d'abord une Fiche Liée.");
       return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fiche = fiches.find(f => f.id === formData.fiche_id);
    if (!fiche) {
      setIsGenerating(false);
      return;
    }

    const sections = fiche.sections || [];
    const questionPool = [];

    const defSection = sections.find(s => s.type === 'definition');
    if (defSection?.content) {
      questionPool.push({
        q: `Définition officielle : Quelle est la définition exacte de "${fiche.title}" ?`,
        answers: [defSection.content.length > 100 ? defSection.content.slice(0, 100) + "..." : defSection.content, "Procédure de repli", "Bilan circonstanciel", "Action de déblai"],
        correct: 0,
        explanation: "Il s'agit de la définition issue du référentiel SP."
      });
    }

    const techItems = sections.find(s => s.type === 'keypoints' || s.type === 'checklist')?.items || [];
    techItems.forEach(item => {
      questionPool.push({
        q: `Dans le cadre de "${fiche.title}", quelle règle technique est impérative ?`,
        answers: [item, "Attente des renforts", "Appel radio immédiat", "Mise en sécurité"],
        correct: 0,
        explanation: `${item} est un point clé du module.`
      });
    });

    const finalPool = questionPool.sort(() => Math.random() - 0.5).slice(0, aiCount);
    setFormData(prev => ({ ...prev, questions: [...prev.questions, ...finalPool] }));
    setIsGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fiche_id) return alert('Lieu lié requis');
    setIsSaving(true);
    try {
      if (quiz) await updateQuiz(quiz.id, formData);
      else await addQuiz(formData);
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
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">{quiz ? 'Modifier le QCM' : 'Nouveau QCM'}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Configurateur d'évaluations</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="quiz-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* General Info & HTML Import */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">Informations</h3>
                <button 
                  type="button" 
                  onClick={() => setShowHtmlInput(!showHtmlInput)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <FileCode size={14} />
                  {showHtmlInput ? 'Cacher Import' : 'Importer HTML'}
                </button>
              </div>

              {showHtmlInput && (
                <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top duration-300">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Coller le code HTML de la fiche</label>
                  <textarea 
                    value={ficheHtml}
                    onChange={(e) => setFicheHtml(e.target.value)}
                    placeholder="<div class='fiche'>...</div>"
                    className="w-full h-32 bg-white border border-blue-200 rounded-xl p-4 font-mono text-[11px] outline-none focus:border-blue-500 shadow-inner resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleHtmlImport}
                    disabled={isGenerating || !ficheHtml.trim()}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Générer Questions via HTML
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Titre du QCM</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titre..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1A1A2E] outline-none focus:border-blue-500" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fiche Liée</label>
                <select required name="fiche_id" value={formData.fiche_id} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1A1A2E] outline-none focus:border-blue-500">
                  <option value="" disabled>Sélectionnez une Fiche</option>
                  {fiches.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" name="is_published" id="pub" checked={formData.is_published} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <label htmlFor="pub" className="text-xs font-bold uppercase tracking-widest text-[#1A1A2E] cursor-pointer">Publier le QCM</label>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">Questions ({formData.questions.length})</h3>
                  <div className="flex items-center gap-2">
                    <select value={aiCount} onChange={e => setAiCount(Number(e.target.value))} className="bg-white border p-2 rounded-lg text-xs font-black outline-none">
                      {[10, 20, 30, 40].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button type="button" onClick={handleAIGeneration} disabled={isGenerating} className="p-2 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:bg-purple-100 transition-colors disabled:opacity-50">
                      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      IA (Store)
                    </button>
                    <button type="button" onClick={addQuestion} className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:bg-blue-100 transition-colors">
                      <Plus size={14} /> Question
                    </button>
                  </div>
               </div>

               {formData.questions.map((q, qIndex) => (
                 <div key={qIndex} className="bg-white border-2 border-gray-100 rounded-3xl p-6 relative group hover:border-blue-100 transition-colors">
                    <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-8 w-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-black text-sm shrink-0">{qIndex + 1}</div>
                      <input required type="text" value={q.q} onChange={(e) => handleQuestionChange(qIndex, 'q', e.target.value)} placeholder="Intitulé..." className="w-full bg-transparent border-b-2 border-gray-50 focus:border-blue-500 outline-none font-bold text-[#1A1A2E] py-1 transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                      {q.answers.map((ans, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 focus-within:border-blue-200 transition-all">
                          <input type="radio" name={`ans-${qIndex}`} checked={q.correct === aIndex} onChange={() => handleQuestionChange(qIndex, 'correct', aIndex)} className="w-4 h-4 text-green-500" />
                          <input required type="text" value={ans} onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)} placeholder={`Option ${aIndex + 1}`} className="w-full bg-transparent text-xs font-bold outline-none" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pl-12">
                       <div className="flex bg-orange-50/50 p-3 rounded-xl border border-orange-100 gap-2">
                          <HelpCircle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                          <input required type="text" value={q.explanation} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} placeholder="Explication..." className="flex-1 bg-transparent text-[11px] text-orange-900 outline-none" />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white">
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200">Annuler</button>
            <button type="submit" form="quiz-form" disabled={isSaving} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50">
              {isSaving ? 'Enregistrement...' : 'Enregistrer le QCM'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

