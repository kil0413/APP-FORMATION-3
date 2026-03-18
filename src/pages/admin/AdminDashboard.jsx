import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Users, FileText, Settings, Plus, LayoutDashboard, Brain, Trash2, Edit2, Save, X, ChevronLeft, BarChart3, List, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { useFicheStore } from '../../store/useFicheStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  
  const { fiches, categories, addFiche, updateFiche, deleteFiche } = useFicheStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newFiche, setNewFiche] = useState({ 
    title: '', 
    category_id: 'c1', 
    difficulty: 'Débutant',
    file_data: null,
    file_type: null,
    sections: [] 
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@sdis.fr' && pwd === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants incorrects.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isPdf = file.type === 'application/pdf';
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFiche({
           ...newFiche, 
           file_data: reader.result, 
           file_type: isPdf ? 'pdf' : 'image',
           // Vider les anciennes sections si on utilise un PDF/Image
           sections: []
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditor = (fiche = null) => {
    if (fiche) {
      setNewFiche(fiche);
    } else {
      setNewFiche({ 
        title: '', 
        category_id: 'c1', 
        difficulty: 'Débutant', 
        file_data: null,
        file_type: null,
        sections: [
          { type: 'definition', title: 'Définition', content: 'Contenu par défaut...' },
          { type: 'keypoints', title: 'Points clés', items: ['Point important 1'] }
        ] 
      });
    }
    setIsAdding(true);
  };

  const handleSaveFiche = (e) => {
    e.preventDefault();
    if (newFiche.id) {
       updateFiche(newFiche.id, newFiche);
    } else {
       addFiche(newFiche);
    }
    setIsAdding(false);
  };

  // Écran de Connexion Mobile
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col bg-[#F2F2F7]">
        <header className="pt-12 pb-8 px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A2E] text-white shadow-xl mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Console Admin</h1>
        </header>
        
        <main className="px-6 flex-1">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Administrateur</label>
              <input 
                type="email" 
                placeholder="admin@sdis.fr"
                className="w-full rounded-2xl bg-white border-none p-5 font-bold shadow-sm"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-2xl bg-white border-none p-5 font-bold shadow-sm"
                value={pwd} onChange={e => setPwd(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full mt-4 bg-[#CC1A1A] text-white rounded-2xl py-5 font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
            >
              Connexion
            </button>
            <button type="button" onClick={() => navigate('/profil')} className="text-gray-400 text-xs font-bold mt-4 uppercase tracking-widest cursor-pointer w-full text-center">Retour au profil</button>
          </form>
        </main>
      </div>
    );
  }

  // Dashboard Mobile
  return (
    <div className="flex h-screen flex-col bg-[#F2F2F7] overflow-hidden">
      
      {/* Header Mobile */}
      <header className="bg-white pt-10 pb-4 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-[#CC1A1A] rounded-sm" />
            <span className="font-black text-xs uppercase tracking-tighter">Admin <span className="text-red-500">SP</span></span>
         </div>
         <button onClick={() => setIsAuthenticated(false)} className="h-8 w-8 flex items-center justify-center rounded-full bg-red-50 text-red-500"><X size={16}/></button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Stats Globales</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                 <Users className="text-blue-500 mb-2" size={24} />
                 <p className="text-2xl font-black text-[#1A1A2E]">1.2k</p>
                 <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Élèves</p>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                 <FileText className="text-red-500 mb-2" size={24} />
                 <p className="text-2xl font-black text-[#1A1A2E]">{fiches.length}</p>
                 <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Cours</p>
              </div>
            </div>

            <Card className="rounded-3xl bg-[#1A1A2E] text-white p-6 border-none shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Activité Récente</h3>
                  <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center gap-3 text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span className="font-bold opacity-70 italic text-[10px]">Utilisateur #432{i} a validé "Risque Gaz"</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-5"><BarChart3 size={100} /></div>
            </Card>
          </div>
        )}

        {activeTab === 'fiches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Catalogue</h2>
              <button 
                onClick={() => openEditor(null)}
                className="h-10 w-10 flex items-center justify-center bg-[#CC1A1A] text-white rounded-full shadow-lg active:scale-90 transition-transform"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {fiches.map(fiche => (
                <div key={fiche.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group">
                   <div className="overflow-hidden mr-2">
                      <p className="font-black text-[#1A1A2E] text-sm truncate uppercase tracking-tighter italic">{fiche.title}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {categories.find(c => c.id === fiche.category_id)?.name} • {fiche.difficulty}
                      </p>
                   </div>
                   <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => openEditor(fiche)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 active:bg-gray-800 active:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('Supprimer ?')) deleteFiche(fiche.id) }} 
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 active:bg-red-500 active:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation Basse Mobile */}
      <nav className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-gray-100 flex items-center justify-around py-4 pb-6 z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-[#CC1A1A]' : 'text-gray-300'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[9px] font-black uppercase">Stats</span>
        </button>
        <button onClick={() => setActiveTab('fiches')} className={`flex flex-col items-center gap-1 ${activeTab === 'fiches' ? 'text-[#CC1A1A]' : 'text-gray-300'}`}>
          <List size={20} />
          <span className="text-[9px] font-black uppercase">Cours</span>
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center gap-1 ${activeTab === 'users' ? 'text-[#CC1A1A]' : 'text-gray-300'}`}>
          <Users size={20} />
          <span className="text-[9px] font-black uppercase">Élèves</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-[#CC1A1A]' : 'text-gray-300'}`}>
          <Settings size={20} />
          <span className="text-[9px] font-black uppercase">App</span>
        </button>
      </nav>

      {/* Modal Fullscreen de Création / Édition */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-white pt-10 px-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-10">
           <header className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                {newFiche.id ? 'Modifier Document' : 'Nouveau Document'}
              </h2>
              <button onClick={() => setIsAdding(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100"><X size={20}/></button>
           </header>

           <form onSubmit={handleSaveFiche} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] ml-2">Titre</label>
                <input 
                  required
                  placeholder="Ex: Secours Routier"
                  className="w-full bg-gray-50 rounded-2xl p-4 font-bold border-none"
                  value={newFiche.title}
                  onChange={e => setNewFiche({...newFiche, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] ml-2">Thème</label>
                  <select 
                    className="w-full bg-gray-50 rounded-2xl p-4 font-bold border-none text-xs"
                    value={newFiche.category_id}
                    onChange={e => setNewFiche({...newFiche, category_id: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] ml-2">Niveau</label>
                  <select 
                    className="w-full bg-gray-50 rounded-2xl p-4 font-bold border-none text-xs"
                    value={newFiche.difficulty}
                    onChange={e => setNewFiche({...newFiche, difficulty: e.target.value})}
                  >
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </div>
              </div>

              {/* Upload de média (PDF ou JPEG) */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] ml-2">Joindre un PDF ou une image</label>
                 <label className="block bg-gray-50 border-2 border-dashed border-gray-200 rounded-[1.5rem] p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf, .jpg, .jpeg, .png" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                    <UploadCloud className="mx-auto text-gray-400 mb-2" size={28} />
                    {newFiche.file_data ? (
                      <p className="text-xs font-bold text-blue-600">Document attaché : {newFiche.file_type.toUpperCase()}</p>
                    ) : (
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tocquez pour ajouter (.pdf, .jpg)</p>
                    )}
                 </label>
              </div>

              {!newFiche.file_data && (
                <div className="bg-red-50 p-6 rounded-[1.5rem] border-2 border-dashed border-red-100 text-center">
                   <p className="text-[10px] font-black text-red-300 uppercase leading-tight">Aucun fichier fourni : Le contenu texte par défaut sera généré.</p>
                </div>
              )}

              <button type="submit" className="w-full bg-[#1A1A2E] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform mt-4">
                 {newFiche.id ? 'Enregistrer modifs' : 'Publier la fiche'}
              </button>
           </form>
        </div>
      )}

    </div>
  );
}
