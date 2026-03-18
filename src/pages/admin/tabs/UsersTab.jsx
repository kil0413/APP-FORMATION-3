import { useState } from 'react';
import { Search, Mail, User, Shield, ShieldCheck, MoreVertical, Trash2, Edit2, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export default function UsersTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 1, name: 'Lucas Dupont', email: 'lucas.d@sdis.fr', role: 'student', status: 'active', progression: '82%', lastLogin: 'Il y a 2h' },
    { id: 2, name: 'Sarah Martin', email: 'sarah.m@sdis.fr', role: 'student', status: 'active', progression: '45%', lastLogin: 'Hier' },
    { id: 3, name: 'Julien Bernard', email: 'j.bernard@sdis.fr', role: 'admin', status: 'active', progression: '100%', lastLogin: 'En ligne' },
    { id: 4, name: 'Thomas Petit', email: 't.petit@sdis.fr', role: 'student', status: 'inactive', progression: '12%', lastLogin: 'Il y a 10j' },
    { id: 5, name: 'Emma Roux', email: 'e.roux@sdis.fr', role: 'student', status: 'active', progression: '67%', lastLogin: 'Il y a 5h' },
  ];

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Card className="p-6 border-none bg-white flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
             <User size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Personnel</p>
            <p className="text-2xl font-black text-[#1A1A2E] italic tracking-tighter">1,284</p>
          </div>
        </Card>
        <Card className="p-6 border-none bg-white flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
             <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actifs (24h)</p>
            <p className="text-2xl font-black text-[#1A1A2E] italic tracking-tighter">156</p>
          </div>
        </Card>
        <Card className="p-6 border-none bg-white flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
             <Award size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Certifiés Q-1</p>
            <p className="text-2xl font-black text-[#1A1A2E] italic tracking-tighter">89</p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
           <div className="flex-1 relative">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text"
               placeholder="Filtrer par nom ou email..."
               className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all">
             <Shield size={18} />
           </button>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-300">
              <th className="px-8 py-5">Personnel</th>
              <th className="px-8 py-5">Rôle</th>
              <th className="px-8 py-5">Progression</th>
              <th className="px-8 py-5">Statut</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {filteredUsers.map(user => (
              <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-[#1A1A2E] shadow-sm uppercase tracking-tighter">
                         {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                         <p className="font-black text-sm uppercase tracking-tighter italic text-[#1A1A2E] leading-none mb-1 group-hover:text-red-600 transition-colors">{user.name}</p>
                         <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                            <Mail size={10} />
                            {user.email}
                         </div>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                     user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                   }`}>
                      {user.role === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                      {user.role}
                   </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3 w-48">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${
                           parseInt(user.progression) > 80 ? 'bg-green-500' : 
                           parseInt(user.progression) > 40 ? 'bg-blue-500' : 'bg-amber-500'
                         }`} style={{ width: user.progression }} />
                      </div>
                      <span className="text-[11px] font-black text-[#1A1A2E]">{user.progression}</span>
                   </div>
                </td>
                <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${
                         user.status === 'active' ? 'text-green-500' : 'text-gray-400'
                       }`}>
                          {user.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {user.status === 'active' ? 'Connecté' : 'Inactif'}
                       </span>
                       <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1 leading-none ml-0.5">
                          <Clock size={10} />
                          {user.lastLogin}
                       </span>
                    </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm">
                        <Edit2 size={14} />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Trash2 size={14} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Affichage de {filteredUsers.length} sur {mockUsers.length} personnels</p>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 cursor-not-allowed">Précédent</button>
              <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-[#1A1A2E] hover:bg-gray-50 transition-all">Suivant</button>
           </div>
        </div>
      </Card>
    </div>
  );
}
