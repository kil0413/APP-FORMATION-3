import { useState } from 'react';
import { useFicheStore } from '../../../store/useFicheStore';
import { Plus, Search, Filter, Edit2, Trash2, Eye, FileText, ChevronRight, LayoutGrid, List as ListIcon, MoreVertical, UploadCloud, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Card } from '../../../components/ui/Card';
import FicheEditor from '../components/FicheEditor';

export default function FichesTab() {
  const { fiches, categories, deleteFiche, realFichesCount, fetchData } = useFicheStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [editingFiche, setEditingFiche] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isTestingDB, setIsTestingDB] = useState(false);

  const testConnection = async () => {
    setIsTestingDB(true);
    try {
      const isReal = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');
      if (!isReal) {
        alert('⚠️ ERREUR : La connexion Supabase n est pas configurée dans votre fichier .env (URL placeholder detectée).');
        setIsTestingDB(false);
        return;
      }

      // Tentative de lecture
      const { data: testRead, error: readError } = await supabase.from('fiches').select('id').limit(1);
      if (readError) throw new Error('LECTURE ECHOUEE : ' + readError.message);

      // Tentative d-insertion test
      const testFiche = { 
        title: 'TEST CONNEXION - ' + new Date().toLocaleTimeString(),
        category_id: 'c1',
        type: 'classic',
        is_published: false
      };
      
      const { data: testInsert, error: insertError } = await supabase.from('fiches').insert([testFiche]).select();
      if (insertError) throw new Error('INSERTION ECHOUEE : ' + insertError.message);

      alert('✅ SUCCÈS : La lecture et l écriture fonctionnent sur Supabase ! Les données sont bien enregistrées en base.');
      await fetchData();
      window.location.reload(); 
    } catch (err) {
      alert('❌ ERREUR DB : ' + err.message + '\n\nConseil : Verifiez que vous avez bien execute les scripts SQL et desactive le RLS sur Supabase.');
    } finally {
      setIsTestingDB(false);
    }
  };

  const filteredFiches = fiches.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || f.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (fiche) => {
    setEditingFiche(fiche);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingFiche(null);
    setIsEditorOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche ? Cette action est irréversible.')) {
      deleteFiche(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Catalogue de Formation</h2>
          <div className="flex items-center gap-4 mt-1">
             <p className="text-sm font-medium text-gray-400">Gérez vos modules de cours</p>
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
               <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${realFichesCount > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]">📂 DB: {realFichesCount || 0}</span>
               </div>
               <div className="h-2 w-px bg-gray-300" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">📦 MOCK: {fiches.length - (realFichesCount || 0)}</span>
             </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={testConnection}
            disabled={isTestingDB}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${isTestingDB ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100'}`}
          >
            {isTestingDB ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
            {isTestingDB ? 'Test...' : 'Debug DB'}
          </button>
          <button 
            onClick={handleAddNew}
            className="bg-[#CC1A1A] text-white flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20 active:scale-95 hover:bg-black transition-all"
          >
            <Plus size={18} />
            Nouveau Document
          </button>
        </div>
      </div>

      <Card className="p-6 border-none shadow-sm flex flex-col md:flex-row md:items-center gap-4 bg-white/50 backdrop-blur-sm">
        <div className="flex-1 relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par titre..."
            className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2">
            <Filter size={14} className="text-gray-400" />
            <select 
              className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-[#1A1A2E] outline-none cursor-pointer"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Toutes Sécurités</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="h-10 w-px bg-gray-100 hidden md:block mx-1"></div>
          <div className="flex items-center p-1 bg-gray-100 rounded-xl">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
             >
               <LayoutGrid size={16} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
             >
               <ListIcon size={16} />
             </button>
          </div>
        </div>
      </Card>

      {viewMode === 'list' ? (
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">Titre du document</th>
                <th className="px-8 py-5">Thématique</th>
                <th className="px-8 py-5">Niveau</th>
                <th className="px-8 py-5">Format</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFiches.length > 0 ? filteredFiches.map((fiche) => (
                <tr key={fiche.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-[#1A1A2E] group-hover:bg-[#CC1A1A]/10 group-hover:text-[#CC1A1A] transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tighter italic text-[#1A1A2E]">{fiche.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Dernière modification: 12/03</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-black uppercase text-gray-500">
                      {categories.find(c => c.id === fiche.category_id)?.name || 'Inconnu'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      fiche.difficulty === 'Débutant' ? 'bg-green-50 text-green-600' :
                      fiche.difficulty === 'Intermédiaire' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {fiche.difficulty}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       {fiche.file_data ? (
                         <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-500 rounded-lg text-[10px] font-black uppercase">
                           <Eye size={12} />
                           {fiche.file_type || 'PDF'}
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase italic">
                           TXT Brut
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(fiche)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(fiche.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    <FileText size={48} className="mx-auto mb-4 opacity-10" />
                    Aucun document trouvé pour cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredFiches.map(fiche => (
             <Card key={fiche.id} className="group border-none shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
               <div className="h-40 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20" />
                  <FileText size={64} className="text-[#1A1A2E]/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-black uppercase tracking-widest text-red-600 shadow-sm border border-white/20">
                      {categories.find(c => c.id === fiche.category_id)?.name}
                    </div>
                  </div>
               </div>
               <div className="p-6 bg-white">
                  <h3 className="font-black text-[#1A1A2E] uppercase italic tracking-tighter truncate mb-1">{fiche.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-widest">
                     <span>{fiche.difficulty}</span>
                     <span>•</span>
                     <span>5 sections</span>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => handleEdit(fiche)}
                       className="flex-1 bg-gray-50 text-[#1A1A2E] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                     >
                       Modifier
                     </button>
                     <button 
                       onClick={() => handleDelete(fiche.id)}
                       className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
               </div>
             </Card>
           ))}
        </div>
      )}

      {isEditorOpen && (
        <FicheEditor 
          fiche={editingFiche} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}
    </div>
  );
}
