import { useState } from 'react';
import { Search, Mail, User, Shield, ShieldCheck, MoreVertical, Trash2, Edit2, CheckCircle2, XCircle, Clock, Award, Filter } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useAuthStore } from '../../../store/useAuthStore';

export default function UsersTab() {
  const { profiles, deleteProfile, updateProfile } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = profiles.filter(u => {
    const nameMatch = (u.display_name || 'Sans nom').toLowerCase().includes(searchTerm.toLowerCase()) || 
                     (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = filterRole === 'all' || u.role === filterRole;
    return nameMatch && roleMatch;
  });

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      deleteProfile(id);
    }
  };

  const handleToggleAdmin = (user) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    updateProfile(user.id, { role: newRole });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tighter uppercase italic">Gestion des Effectifs</h2>
          <p className="text-sm font-medium text-gray-400 mt-1">Supervisez les accès et la progression des personnels de formation</p>
        </div>
        <button className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 hover:bg-[#CC1A1A] transition-all">
          Nouvel Utilisateur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none bg-white flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
             <User size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Personnel</p>
            <p className="text-2xl font-black text-[#1A1A2E] italic tracking-tighter">{profiles.length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none bg-white flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
             <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actifs (24h)</p>
            <p className="text-2xl font-black text-[#1A1A2E] italic tracking-tighter">{profiles.filter(p => !p.role || p.role === 'student').length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none bg-white flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
             <Award size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">XP Total Cumulé</p>
            <p className="text-2xl font-black text-[#1A1A2E] italic tracking-tighter">
              {profiles.reduce((acc, p) => acc + (p.xp_total || 0), 0).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center gap-4">
           <div className="flex-1 relative w-full">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text"
               placeholder="Filtrer par nom ou email..."
               className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-full md:w-auto">
            <Filter size={14} className="text-gray-400" />
            <select 
              className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-[#1A1A2E] outline-none cursor-pointer flex-1 md:flex-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="student">Élèves</option>
              <option value="admin">Administrateurs</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-300">
                <th className="px-8 py-5">Personnel</th>
                <th className="px-8 py-5">Rôle</th>
                <th className="px-8 py-5">XP / Progression</th>
                <th className="px-8 py-5">Identifiant Unique</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-[#1A1A2E] shadow-sm uppercase tracking-tighter">
                          {(user.display_name || 'P').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tighter italic text-[#1A1A2E] leading-none mb-1 group-hover:text-red-600 transition-colors">{user.display_name || 'Pompier anonyme'}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                              <Mail size={10} />
                              {user.email || 'Aucun email'}
                          </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => handleToggleAdmin(user)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-200'
                    }`}>
                        {user.role === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                        {user.role || 'student'}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[11px] font-black text-[#1A1A2E] flex items-center gap-2">
                         <span className="text-red-500">{user.xp_total || 0}</span> XP 
                         <span className="text-gray-300 font-medium">• {user.grade || 'Sapeur'}</span>
                       </span>
                       <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (user.xp_total || 0) / 10)}%` }} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">
                        {user.id.substring(0, 12)}...
                      </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm">
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
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
                    <User size={48} className="mx-auto mb-4 opacity-10" />
                    Aucun personnel trouvé pour cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Affichage de {filteredUsers.length} sur {profiles.length} personnels</p>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 cursor-not-allowed">Précédent</button>
              <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-[#1A1A2E] hover:bg-gray-50 transition-all">Suivant</button>
           </div>
        </div>
      </Card>
    </div>
  );
}
