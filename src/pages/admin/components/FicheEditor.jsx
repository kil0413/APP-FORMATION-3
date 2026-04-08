import { useState, useEffect } from 'react';
import { X, UploadCloud, Save, Plus, Trash2, FileText, Layout, Type, List as ListIcon, AlertCircle, ChevronRight, Eye } from 'lucide-react';
import { useFicheStore } from '../../../store/useFicheStore';

export default function FicheEditor({ fiche, onClose }) {
  const { categories, addFiche, updateFiche } = useFicheStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category_id: 'c1',
    difficulty: 'Débutant',
    type: 'classic', // classic, media, code, interactive
    file_data: null,
    file_type: null,
    content_html: '',
    sections: [
      { type: 'definition', title: 'Définition', content: '' },
      { type: 'keypoints', title: 'Points clés', items: [''] }
    ]
  });

  useEffect(() => {
    if (fiche) {
      setFormData(fiche);
      // Fetch missing file_data dynamically so it isn't lost on save
      if (fiche.type === 'media' && !fiche.file_data && fiche.id && typeof fiche.id !== 'string' || (typeof fiche.id === 'string' && !fiche.id.startsWith('f') && !fiche.id.startsWith('tmp'))) {
         const fetchMedia = async () => {
            try {
               const { supabase } = await import('../../../lib/supabase');
               const { data } = await supabase.from('fiches').select('file_data').eq('id', fiche.id).single();
               if (data && data.file_data) {
                  setFormData(prev => ({ ...prev, file_data: data.file_data }));
               }
            } catch (e) {
               console.error("Failed to load existing media for editing", e);
            }
         };
         fetchMedia();
      }
    }
  }, [fiche]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Fichier trop volumineux ! La taille maximale est de 5 Mo.");
        return;
      }
      const isPdf = file.type === 'application/pdf';
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          type: 'media',
          file_data: reader.result,
          file_type: isPdf ? 'pdf' : 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (fiche?.id) {
        await updateFiche(fiche.id, formData);
      } else {
        await addFiche(formData);
      }
      onClose();
    } catch (err) {
      alert('Erreur lors de la sauvegarde: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type) => {
    const newSection = type === 'keypoints' 
      ? { type, title: 'Nouvelle section', items: [''] }
      : { type, title: 'Nouvelle section', content: '' };
    setFormData({ ...formData, sections: [...formData.sections, newSection] });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full max-h-[850px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center bg-[#CC1A1A] text-white rounded-xl shadow-lg shadow-red-500/10">
                 <FileText size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#1A1A2E]">
                   {fiche ? 'Modifier Document' : 'Nouveau Document'}
                 </h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Éditeur de contenu SP</p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
           >
             <X size={20} />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: General Info */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#CC1A1A] flex items-center gap-2">
                       <Layout size={14} /> Informations Globales
                    </h3>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Titre de la fiche</label>
                      <input 
                        required
                        placeholder="Ex: Secours Routier"
                        className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 font-black uppercase italic tracking-tighter text-sm focus:ring-4 focus:ring-red-500/10 focus:bg-white focus:border-red-500/20 transition-all outline-none"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Thématique</label>
                        <select 
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-xs outline-none cursor-pointer"
                          value={formData.category_id}
                          onChange={e => setFormData({...formData, category_id: e.target.value})}
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Difficulté</label>
                          <select 
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-[10px] outline-none cursor-pointer"
                            value={formData.difficulty}
                            onChange={e => setFormData({...formData, difficulty: e.target.value})}
                          >
                            <option>Débutant</option>
                            <option>Intermédiaire</option>
                            <option>Avancé</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Format</label>
                          <select 
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-[10px] outline-none cursor-pointer"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                          >
                            <option value="classic">Sections</option>
                            <option value="media">Média</option>
                            <option value="code">HTML</option>
                          </select>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Media Upload (Conditional) */}
                  {formData.type === 'media' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[#CC1A1A] flex items-center gap-2">
                          <UploadCloud size={14} /> Support Média
                       </h3>
                       <label className={`block border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-300 ${
                         formData.file_data ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-100 hover:border-red-200'
                       }`}>
                           <input 
                             type="file" 
                             accept=".pdf, .jpg, .jpeg, .png" 
                             className="hidden" 
                             onChange={handleFileUpload}
                           />
                           <div className={`mx-auto h-16 w-16 flex items-center justify-center rounded-2xl mb-4 ${
                              formData.file_data ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-400'
                           }`}>
                              <UploadCloud size={32} />
                           </div>
                           {formData.file_data ? (
                             <div className="space-y-1">
                                <p className="text-xs font-black uppercase text-blue-600">Document {formData.file_type?.toUpperCase()}</p>
                                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Cliquez pour remplacer</p>
                             </div>
                           ) : (
                             <div className="space-y-1">
                                <p className="text-xs font-black uppercase text-gray-800 tracking-tighter">PDF ou Image (JPEG/PNG)</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Max 10Mo</p>
                             </div>
                           )}
                       </label>
                    </div>
                  )}

                  {formData.type === 'code' && (
                    <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                       <AlertCircle className="text-amber-400 shrink-0" size={20} />
                       <p className="text-[10px] font-bold text-amber-600 uppercase leading-relaxed tracking-wider">
                         Mode Expert : Saisissez votre code HTML/Tailwind complet. Il sera rendu en plein écran.
                       </p>
                    </div>
                  )}

                  {formData.type === 'classic' && (
                    <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex items-start gap-4">
                       <AlertCircle className="text-red-400 shrink-0" size={20} />
                       <p className="text-[10px] font-bold text-red-500 uppercase leading-relaxed tracking-wider">
                         Utilisez le constructeur à droite pour structurer votre fiche en sections distinctes.
                       </p>
                    </div>
                  )}
              </div>

              {/* Right Column: Content Builder or Code Editor */}
              <div className="lg:col-span-8 space-y-6 bg-gray-50/50 rounded-[2.5rem] p-8 border border-white">
                  {formData.type === 'code' ? (
                     <div className="h-full flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#CC1A1A] flex items-center gap-2">
                             <Layout size={14} /> Éditeur de Code HTML
                          </h3>
                        </div>
                        <textarea 
                          className="flex-1 w-full bg-[#1A1A2E] text-blue-300 font-mono text-xs p-6 rounded-3xl border-none focus:ring-4 focus:ring-red-500/10 min-h-[500px]"
                          placeholder="<!DOCTYPE html>..."
                          value={formData.content_html}
                          onChange={e => setFormData({...formData, content_html: e.target.value})}
                        />
                     </div>
                  ) : (
                    <>
                       <div className="flex items-center justify-between mb-2">
                         <h3 className="text-xs font-black uppercase tracking-widest text-[#CC1A1A] flex items-center gap-2">
                            <Type size={14} /> Structure du contenu
                         </h3>
                         <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => addSection('definition')}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-black hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                               <Plus size={14} /> Texte
                            </button>
                            <button 
                              type="button"
                              onClick={() => addSection('keypoints')}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-black hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                               <ListIcon size={14} /> Liste
                            </button>
                         </div>
                       </div>
                 <div className="space-y-4">
                    {formData.sections.map((section, idx) => (
                      <div key={idx} className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-red-100 relative">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                               <div className="h-4 w-1 bg-red-500 rounded-full" />
                               <input 
                                 className="bg-transparent border-none text-xs font-black uppercase italic tracking-tighter text-[#1A1A2E] focus:ring-0 w-64"
                                 value={section.title}
                                 onChange={(e) => updateSection(idx, 'title', e.target.value)}
                               />
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeSection(idx)}
                              className="opacity-0 group-hover:opacity-100 h-8 w-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                         </div>
                         
                         {section.type === 'keypoints' ? (
                           <div className="space-y-2 pl-4">
                              {section.items.map((item, iIdx) => (
                                <div key={iIdx} className="flex gap-2">
                                   <div className="h-4 w-4 rounded-md bg-gray-50 flex items-center justify-center shrink-0 mt-2">
                                     <div className="h-1.5 w-1.5 rounded-full bg-red-300" />
                                   </div>
                                   <input 
                                     className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 py-2"
                                     value={item}
                                     onChange={(e) => {
                                       const newItems = [...section.items];
                                       newItems[iIdx] = e.target.value;
                                       updateSection(idx, 'items', newItems);
                                     }}
                                   />
                                   <button 
                                     type="button"
                                     onClick={() => {
                                       const newItems = section.items.filter((_, i) => i !== iIdx);
                                       updateSection(idx, 'items', newItems);
                                     }}
                                     className="h-8 w-8 text-gray-300 hover:text-red-500"
                                   >
                                     <X size={14} />
                                   </button>
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => updateSection(idx, 'items', [...section.items, ''])}
                                className="mt-2 text-[9px] font-black uppercase text-gray-400 hover:text-red-500"
                              >
                                + Ajouter une ligne
                              </button>
                           </div>
                         ) : (
                           <textarea 
                             className="w-full bg-gray-50/50 rounded-2xl p-4 text-sm font-medium border-none focus:ring-0 min-h-[100px]"
                             placeholder="Contenu de la section..."
                             value={section.content}
                             onChange={(e) => updateSection(idx, 'content', e.target.value)}
                           />
                         )}
                      </div>
                    ))}
                 </div>
                    </>
                  )}
              </div>
           </form>
        </div>

        <footer className="px-8 py-6 border-t border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400">
             <Eye size={16} />
             <span>Aperçu automatique activé</span>
           </div>
           
           <div className="flex gap-3">
             <button 
               type="button"
               onClick={onClose}
               className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#1A1A2E] hover:bg-gray-100 transition-all border border-gray-100"
             >
               Annuler
             </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#1A1A2E] text-white flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 hover:bg-red-600 transition-all group disabled:opacity-50"
              >
                <Save size={18} className={isSaving ? "animate-spin" : "group-hover:translate-y-[-2px] transition-transform"} />
                {isSaving ? 'Publication...' : 'Publier les changements'}
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
}
