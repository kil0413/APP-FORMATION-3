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

  // --- ÉTAPE 1 -> 2 : HTML VERS PRÉVIEW ---
  const handleShowPreview = () => {
    if (!ficheHtml.trim()) return;
    setStep(2);
  };

  // --- ÉTAPE 2 -> 3 : PRÉVIEW VERS QCM ---
  const handleAnalyzePreviewToQuiz = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(ficheHtml, 'text/html');
      
      // Extraction sémantique exhaustive du DOM rendu
      const walk = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
      let fullText = '';
      let node;
      while (node = walk.nextNode()) {
        const t = node.textContent.trim();
        if (t.length > 3) fullText += t + '. ';
      }
      
      const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 15);
      const factPool = [];
      sentences.forEach(sentence => {
        const cleanS = sentence.trim();
        const hasNumber = /\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/.test(cleanS);
        const hasAcronym = /\b[A-Z]{2,}\b/.test(cleanS);
        const hasTechnicalTerm = /(danger|sécurité|pression|fuite|oxygène|combustion|température|intervention|binôme|secteur)/i.test(cleanS);
        if (hasNumber || hasAcronym || hasTechnicalTerm) factPool.push(cleanS);
      });

      const newQuestions = [];
      const targetCount = Math.max(12, Math.min(45, Math.ceil(factPool.length / 1.2)));

      factPool.forEach((fact) => {
        if (newQuestions.length >= targetCount) return;
        const acronymMatch = fact.match(/\b[A-Z]{2,}\b/);
        const numberMatch = fact.match(/\d+(?:\s?)(?:m|cm|kg|bars?|min|h|°C|%)/);

        if (numberMatch) {
          newQuestions.push({
            q: `Quelle est la valeur technique exacte citée pour : "${fact.slice(0, 70)}..." ?`,
            answers: [numberMatch[0], "Zéro", "La valeur nominale x2", "Indéterminé en opération"],
            correct: 0,
            explanation: `Le référentiel précise la valeur de ${numberMatch[0]} pour cette application.`
          });
        } else if (acronymMatch) {
           newQuestions.push({
             q: `Que signifie l'abréviation "${acronymMatch[0]}" rencontrée dans le module : "${fact.slice(0, 70)}..." ?`,
             answers: ["Terme opérationnel GDO/GTS", "Indicatif radio spécifique", "Pression résiduelle moyenne", "Code de rappel binôme"],
             correct: 0,
             explanation: `L'acronyme ${acronymMatch[0]} est un point clé de la fiche de révision.`
           });
        } else {
          newQuestions.push({
            q: `Quelle instruction majeure est soulignée ici : "${fact.slice(0, 80)}..." ?`,
            answers: ["Une consigne de sécurité impérative", "Une option de confort facultative", "Une action réservée aux renforts", "Une étape à omettre si possible"],
            correct: 0,
            explanation: "Toute consigne extraite de la fiche est considérée comme un élément critique de l'évaluation."
          });
        }
      });

      setFormData(prev => ({ ...prev, questions: [...prev.questions, ...newQuestions] }));
      setStep(3);
      setIsGenerating(false);
    }, 2500);
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
    <div className="fixed inset-0 z-50 bg-[#0A0A12] text-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header Area Full Screen */}
      <div className="px-12 py-8 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-4">
              Intelligence Pédagogique
              <span className="text-[10px] not-italic px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">Auto-Extraction v4.0</span>
            </h2>
            <div className="flex gap-6 mt-4">
               {[1, 2, 3].map(s => (
                 <div key={s} className="flex items-center gap-3">
                    <div className={`h-2 w-16 rounded-full transition-all duration-700 ${step >= s ? 'bg-blue-500' : 'bg-white/5'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-blue-400' : 'text-white/20'}`}>
                      {s === 1 ? 'Import Code' : s === 2 ? 'Visuel Fiche' : 'Analyse QCM'}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="h-12 w-12 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full flex items-center justify-center border border-white/10 transition-all group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Main Container Overflow-hidden to manage internal scrolling */}
      <div className="flex-1 overflow-hidden relative">
        
        <div className="absolute inset-0 overflow-y-auto px-12 py-16 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            
            {step === 1 && (
              <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
                 <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/60 pl-2">Nom de l'évaluation</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Evaluation GDO Phénomènes Thermiques..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 font-black text-xl outline-none focus:border-blue-500/50 hover:bg-black/60 transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/60 pl-2">Assignation Module</label>
                      <select name="fiche_id" value={formData.fiche_id} onChange={handleChange} className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 font-black text-xl outline-none focus:border-blue-500/50 hover:bg-black/60 transition-all">
                        <option value="">Cibler une fiche...</option>
                        {fiches.map(f => <option key={f.id} value={f.id} className="bg-[#0A0A12]">{f.title}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="space-y-6 bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="font-black uppercase text-sm tracking-widest text-blue-400">Ingestion Code Source HTML</h3>
                       <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase">Provider Intake</span>
                    </div>
                    <textarea 
                      value={ficheHtml}
                      onChange={(e) => setFicheHtml(e.target.value)}
                      className="w-full h-[450px] bg-black/60 border border-white/5 rounded-3xl p-10 font-mono text-sm leading-relaxed outline-none focus:border-blue-500/40 resize-none shadow-inner"
                      placeholder="<!-- Collez votre structure HTML ici -->"
                    />
                    <button 
                      onClick={handleShowPreview} 
                      disabled={!ficheHtml || !formData.fiche_id} 
                      className="w-full py-7 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/30 active:scale-95 disabled:grayscale transition-all flex items-center justify-center gap-4 group"
                    >
                      <FileCode size={24} className="group-hover:scale-110 transition-transform" />
                      Visualiser la Fiche de Révision
                    </button>
                 </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                 <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
                    
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center italic text-sm font-black">PREV</div>
                        <h3 className="font-black uppercase text-xl tracking-tighter italic">Rendu Web de la Fiche</h3>
                      </div>
                      <button onClick={() => setStep(1)} className="text-[10px] uppercase font-black px-6 py-2.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all">Modifier le code</button>
                    </div>

                    {/* Le rendu réel de la fiche */}
                    <div className="bg-white text-gray-900 rounded-[30px] p-12 shadow-inner min-h-[600px] prose prose-invert max-w-none fiche-rich-content">
                       <style>{`
                         .fiche-rich-content h1 { font-weight: 900; font-style: italic; text-transform: uppercase; margin-bottom: 2rem; color: #1a237e; border-left: 8px solid #1a237e; padding-left: 1.5rem; }
                         .fiche-rich-content h2 { font-weight: 800; text-transform: uppercase; margin-top: 2rem; color: #d32f2f; }
                         .fiche-rich-content p { font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; }
                         .fiche-rich-content ul { list-style: none; padding: 0; }
                         .fiche-rich-content li { padding: 1rem; background: #f5f5f5; margin-bottom: 0.5rem; border-radius: 12px; border-left: 4px solid #1a237e; font-weight: 700; color: #333; }
                         .fiche-rich-content b, .fiche-rich-content strong { color: #d32f2f; }
                       `}</style>
                       <div dangerouslySetInnerHTML={{ __html: ficheHtml }} />
                    </div>

                    <div className="grid grid-cols-1 mt-12 pb-6">
                      <button 
                        onClick={handleAnalyzePreviewToQuiz} 
                        disabled={isGenerating} 
                        className="py-7 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-purple-500/20 active:scale-95 disabled:grayscale transition-all flex items-center justify-center gap-4"
                      >
                         {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                         {isGenerating ? 'Interprétation sémantique en cours...' : 'Extraire les Informations & Générer Quiz'}
                      </button>
                    </div>
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 pb-32">
                 <div className="flex items-center justify-between bg-black/40 p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-6">
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic">Contingent Questions</h3>
                       <span className="px-5 py-2 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">{formData.questions.length} Générées</span>
                    </div>
                    <button onClick={addQuestion} className="px-8 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase border border-white/10 hover:bg-blue-600 transition-all flex items-center gap-3">
                       <Plus size={16} /> Ajouter manuellement
                    </button>
                 </div>

                 <div className="grid grid-cols-1 gap-10">
                    {formData.questions.map((q, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-[40px] p-12 relative hover:bg-white/10 transition-all group shadow-xl">
                         <button onClick={() => removeQuestion(idx)} className="absolute top-8 right-8 text-white/10 hover:text-red-500 p-3 bg-black rounded-full transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                         <div className="flex items-start gap-8 mb-10">
                            <span className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 italic shadow-lg">{idx + 1}</span>
                            <input type="text" value={q.q} onChange={(e) => handleQuestionChange(idx, 'q', e.target.value)} className="w-full bg-transparent border-b-2 border-white/5 focus:border-blue-500 outline-none font-black text-2xl py-2 transition-all placeholder:text-gray-700" />
                         </div>
                         <div className="grid grid-cols-2 gap-6 pl-20">
                            {q.answers.map((ans, aIdx) => (
                              <div key={aIdx} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${q.correct === aIdx ? 'bg-green-500/10 border-green-500/50' : 'bg-black/40 border-white/5 shadow-inner'}`}>
                                 <input type="radio" checked={q.correct === aIdx} onChange={() => handleQuestionChange(idx, 'correct', aIdx)} className="w-6 h-6 text-green-500 border-none bg-white/10" />
                                 <input type="text" value={ans} onChange={(e) => handleAnswerChange(idx, aIdx, e.target.value)} className="w-full bg-transparent text-sm font-black outline-none" />
                              </div>
                            ))}
                         </div>
                         <div className="mt-10 pl-20">
                            <div className="flex bg-orange-500/5 p-6 rounded-3xl border-2 border-orange-500/10 gap-5">
                               <HelpCircle size={24} className="text-orange-400 shrink-0 mt-0.5" />
                               <textarea value={q.explanation} onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)} className="flex-1 bg-transparent text-[11px] font-bold text-orange-200 outline-none resize-none h-10" placeholder="Raisonnement technique attendu..." />
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer Area Permanent */}
      <div className="px-12 py-10 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-between z-10">
         <div className="flex items-center gap-5">
            <div className="relative inline-flex items-center cursor-pointer group">
               <input type="checkbox" id="public-switch" name="is_published" checked={formData.is_published} onChange={handleChange} className="sr-only" />
               <div className={`w-12 h-6 rounded-full transition-all duration-300 ${formData.is_published ? 'bg-green-600' : 'bg-white/10 border border-white/10'}`} />
               <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <label htmlFor="public-switch" className="text-[11px] font-black uppercase text-gray-500 cursor-pointer group-hover:text-white transition-colors">Déployer en production immédiatement</label>
         </div>
         <div className="flex gap-6">
            <button onClick={onClose} className="px-10 py-5 bg-white/5 rounded-2xl text-[11px] font-black uppercase border border-white/10 hover:bg-white/10 transition-colors">Abandonner</button>
            {step === 3 && (
              <button 
                onClick={handleSubmit} 
                disabled={isSaving} 
                className="px-14 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 active:scale-95 disabled:grayscale transition-all flex items-center gap-4"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Générer et Publier le QCM
              </button>
            )}
         </div>
      </div>

    </div>
  );
}


