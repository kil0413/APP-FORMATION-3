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
  const [step, setStep] = useState(1);
  const [cleanedText, setCleanedText] = useState('');

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

  // --- ÉTAPE 1 -> 2 : HTML VERS TEXTE ---
  const handleTransformHtmlToText = () => {
    if (!ficheHtml.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(ficheHtml, 'text/html');
      const walk = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
      let text = '';
      let node;
      while (node = walk.nextNode()) {
        const t = node.textContent.trim();
        if (t.length > 3) text += t + '. ';
      }
      setCleanedText(text);
      setStep(2);
      setIsGenerating(false);
    }, 1000);
  };

  // --- ÉTAPE 2 -> 3 : TEXTE VERS QCM ---
  const handleAnalyzeTextToQuiz = () => {
    if (!cleanedText.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 15);
      const factPool = [];
      
      sentences.forEach(sentence => {
        const cleanS = sentence.trim();
        const hasNumber = /\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/.test(cleanS);
        const hasAcronym = /\b[A-Z]{2,}\b/.test(cleanS);
        const hasTechnicalTerm = /(danger|sécurité|pression|fuite|oxygène|combustion|température|intervention|binôme|secteur)/i.test(cleanS);
        if (hasNumber || hasAcronym || hasTechnicalTerm) factPool.push(cleanS);
      });

      const newQuestions = [];
      const targetCount = Math.max(10, Math.min(40, Math.ceil(factPool.length / 1.5)));

      factPool.forEach((fact) => {
        if (newQuestions.length >= targetCount) return;
        const acronymMatch = fact.match(/\b[A-Z]{2,}\b/);
        const numberMatch = fact.match(/\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/);

        if (numberMatch) {
          newQuestions.push({
            q: `Quelle est la valeur prescrite pour l'instruction suivante : "${fact.slice(0, 70)}..." ?`,
            answers: [numberMatch[0], "Zéro", "La valeur nominale x2", "ZED (Zone d'Évitement Danger)"],
            correct: 0,
            explanation: `Le référentiel indique précisément la valeur de ${numberMatch[0]}.`
          });
        } else if (acronymMatch) {
           newQuestions.push({
             q: `Que signifie "${acronymMatch[0]}" dans le contexte opérationnel suivant : "${fact.slice(0, 70)}..." ?`,
             answers: ["Terme technique GDO", "Identité de bord", "Pression de service", "Code de rappel"],
             correct: 0,
             explanation: `L'acronyme ${acronymMatch[0]} est central dans cette procédure.`
           });
        } else {
          newQuestions.push({
            q: `Quelle est la consigne clé concernant : "${fact.slice(0, 80)}..." ?`,
            answers: ["Priorité sécurité et procédure", "Information de confort", "Étape à ignorer en urgence", "Action facultative"],
            correct: 0,
            explanation: "Toute consigne technique est indispensable pour la validation de l'échelon."
          });
        }
      });

      setFormData(prev => ({ ...prev, questions: [...prev.questions, ...newQuestions] }));
      setStep(3);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fiche_id) return alert('Source requise');
    setIsSaving(true);
    try {
      if (quiz) await updateQuiz(quiz.id, formData);
      else await addQuiz(formData);
      onClose();
    } catch (err) { alert("Erreur: " + err.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A12] text-white flex flex-col animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="px-12 py-8 bg-black/40 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Configurateur Expert QCM</h2>
            <div className="flex gap-4 mt-2">
               {[1, 2, 3].map(s => (
                 <div key={s} className="flex items-center gap-2">
                    <div className={`h-1.5 w-12 rounded-full ${step >= s ? 'bg-blue-500' : 'bg-white/10'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s ? 'text-blue-400' : 'text-white/20'}`}>
                      {s === 1 ? 'Import' : s === 2 ? 'Analyse' : 'Revision'}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="h-10 w-10 bg-white/5 hover:bg-red-500/20 rounded-full flex items-center justify-center border border-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500">Nom du QCM</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titre..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 font-bold outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500">Fiche Cible</label>
                    <select name="fiche_id" value={formData.fiche_id} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 font-bold outline-none focus:border-blue-500">
                      <option value="">Sélectionner...</option>
                      {fiches.map(f => <option key={f.id} value={f.id} className="bg-[#0A0A12]">{f.title}</option>)}
                    </select>
                  </div>
               </div>

               <div className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black uppercase text-xs tracking-widest text-blue-400">Code Source HTML</h3>
                    <span className="text-[10px] text-gray-500 italic">Veuillez coller le code HTML complet de la fiche</span>
                  </div>
                  <textarea 
                    value={ficheHtml}
                    onChange={(e) => setFicheHtml(e.target.value)}
                    className="w-full h-80 bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs outline-none focus:border-blue-500/50 resize-none shadow-inner"
                    placeholder="<div class='fiche'>...</div>"
                  />
                  <button onClick={handleTransformHtmlToText} disabled={isGenerating || !ficheHtml || !formData.fiche_id} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <FileCode size={18} />}
                    Transformer en Texte de Référence
                  </button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="bg-white/5 p-10 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black uppercase text-sm tracking-widest text-blue-400">Vérification de l'Analyse</h3>
                    <button onClick={() => setStep(1)} className="text-[10px] uppercase font-black text-white/30 hover:text-white transition-colors">Modifier Source</button>
                  </div>
                  <textarea 
                    value={cleanedText}
                    onChange={(e) => setCleanedText(e.target.value)}
                    className="w-full h-96 bg-black/40 border border-white/5 rounded-2xl p-8 font-bold text-lg leading-relaxed outline-none focus:border-blue-500/50 resize-none"
                  />
                  <div className="grid grid-cols-1 mt-8">
                    <button onClick={handleAnalyzeTextToQuiz} disabled={isGenerating} className="py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                       {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                       Lancer la Génération IA du QCM
                    </button>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 pb-20">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">Validation des Questions ({formData.questions.length})</h3>
                  <button onClick={addQuestion} className="px-5 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-blue-600 transition-all">Ajouter manuellement</button>
               </div>

               <div className="space-y-8">
                  {formData.questions.map((q, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 relative hover:bg-white/10 transition-colors group">
                       <button onClick={() => removeQuestion(idx)} className="absolute top-6 right-6 text-white/20 hover:text-red-500 p-2 bg-black rounded-full transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                       <div className="flex items-start gap-5 mb-6">
                          <span className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shrink-0 italic">{idx + 1}</span>
                          <input type="text" value={q.q} onChange={(e) => handleQuestionChange(idx, 'q', e.target.value)} className="w-full bg-transparent border-b border-white/5 focus:border-blue-500 outline-none font-bold text-xl py-1 transition-all" />
                       </div>
                       <div className="grid grid-cols-2 gap-4 pl-12">
                          {q.answers.map((ans, aIdx) => (
                            <div key={aIdx} className={`flex items-center gap-3 p-3 rounded-xl border ${q.correct === aIdx ? 'bg-green-500/10 border-green-500/30' : 'bg-black/20 border-white/5 shadow-inner'}`}>
                               <input type="radio" checked={q.correct === aIdx} onChange={() => handleQuestionChange(idx, 'correct', aIdx)} className="w-4 h-4 text-green-500" />
                               <input type="text" value={ans} onChange={(e) => handleAnswerChange(idx, aIdx, e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none" />
                            </div>
                          ))}
                       </div>
                       <div className="mt-6 pl-12">
                          <div className="flex bg-orange-500/5 p-3 rounded-xl border border-orange-500/10 gap-3">
                             <HelpCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                             <input type="text" value={q.explanation} onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)} className="flex-1 bg-transparent text-[10px] text-orange-200 outline-none" placeholder="Explication..." />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Area */}
      <div className="px-12 py-8 bg-black border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <input type="checkbox" id="p" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-5 h-5 rounded border-white/10 bg-white/5" />
            <label htmlFor="p" className="text-[10px] font-black uppercase text-gray-500 cursor-pointer hover:text-white transition-colors">Rendre ce QCM immédiatement disponible en ligne</label>
         </div>
         <div className="flex gap-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-white/10 transition-colors">Fermer</button>
            {step === 3 && (
              <button 
                onClick={handleSubmit} 
                disabled={isSaving} 
                className="px-10 py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Déployer Evaluation
              </button>
            )}
         </div>
      </div>

    </div>
  );
}


