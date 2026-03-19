import { Home, BookOpen, FolderOpen, User, LogOut, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

export function MainSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Parcours', path: '/parcours', icon: BookOpen },
    { name: 'Répertoire', path: '/repertoire', icon: FolderOpen },
    { name: 'Mon Profil', path: '/profil', icon: User },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="hidden md:flex w-72 h-screen sticky top-0 bg-white border-r border-gray-200 flex-col py-8 px-6 transition-all duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
        <div className="h-10 w-10 bg-[#CC1A1A] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
          <span className="font-black text-white italic text-lg">SP</span>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-[#1A1A2E] leading-none uppercase tracking-tighter text-lg">Formation</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Sapeurs-Pompiers</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1">Menu Principal</p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={cn(
                "group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-[#CC1A1A] text-white shadow-lg shadow-red-500/20" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400")} />
              <span className="font-bold text-[15px] tracking-tight">{item.name}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white/30 rounded-l-full" />
              )}
            </button>
          );
        })}

        {isAdmin && (
          <div className="mt-8">
            <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#CC1A1A] mb-4 ml-1">Administration</p>
            <button
              onClick={() => navigate('/admin')}
              className="group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-red-50 hover:text-[#CC1A1A] transition-all duration-300"
            >
              <ShieldCheck size={20} className="text-gray-400 group-hover:text-[#CC1A1A]" />
              <span className="font-bold text-[15px] tracking-tight text-red-600">Console Admin</span>
            </button>
          </div>
        )}
      </nav>

      {/* Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100">
             <img 
               src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
               alt="Avatar" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-[#1A1A2E] truncate">{user?.display_name}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{user?.grade}</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-4 text-sm font-black text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
