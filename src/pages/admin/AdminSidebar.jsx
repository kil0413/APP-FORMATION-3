import { LayoutDashboard, FileText, Users, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin' },
    { id: 'fiches', label: 'Gestion des Fiches', icon: FileText, path: '/admin/fiches' },
    { id: 'users', label: 'Utilisateurs', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col h-full shrink-0 shadow-2xl z-20 transition-all">
      {/* Logo */}
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#CC1A1A] rounded-lg shadow-lg shadow-red-500/20 flex items-center justify-center">
            <span className="font-black text-xs italic">SP</span>
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter">Console Admin</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sapeurs-Pompiers</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-[#CC1A1A] text-white shadow-lg shadow-red-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'group-hover:text-white'} />
            <span className="font-bold text-sm">{item.label}</span>
            {isActive(item.path) && <ChevronRight size={14} className="ml-auto opacity-50" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>

        <div className="mt-4 px-4 py-3 bg-white/5 rounded-2xl flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">A</div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-black truncate uppercase tracking-tighter">Administrateur</p>
            <p className="text-[9px] text-gray-500 truncate">admin@sdis.fr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
