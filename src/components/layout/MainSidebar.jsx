import { Home, BookOpen, FolderOpen, User, LogOut, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../ui/ProgressBar';

export function MainSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Parcours', path: '/parcours', icon: BookOpen },
    { name: 'Répertoire', path: '/repertoire', icon: FolderOpen },
    { name: 'Profil', path: '/profil', icon: User },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="hidden md:flex w-80 h-screen sticky top-0 bg-[#05050A] border-r border-white/5 flex-col py-10 px-8 transition-all duration-500 overflow-hidden relative">
      
      {/* Decorative BG pattern */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-red-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-red-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Brand - Modern Vertical Layout */}
      <div className="flex flex-col gap-6 mb-16 relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-14 w-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(204,26,26,0.3)] group-hover:rotate-6 transition-transform duration-500">
            <span className="font-black text-white italic text-2xl">SP</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-white tracking-tighter uppercase italic text-2xl leading-none">Fire Académie</h1>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-1.5">
               <Sparkles size={10} className="text-red-500" />
               Sapeurs-Pompiers
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-10 overflow-y-auto no-scrollbar relative z-10">
        <div className="flex flex-col gap-2">
           <p className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Navigation</p>
           {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             const Icon = item.icon;
             return (
               <button
                 key={item.name}
                 onClick={() => navigate(item.path)}
                 className={cn(
                   "group w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-300 relative overflow-hidden",
                   isActive 
                     ? "bg-red-600 text-white shadow-[0_15px_35px_rgba(204,26,26,0.25)]" 
                     : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                 )}
               >
                 <Icon size={22} className={cn("transition-all duration-500 group-hover:scale-110", isActive ? "text-white shadow-xl" : "text-white/30")} />
                 <span className="font-black text-sm uppercase tracking-widest italic">{item.name}</span>
                 {isActive && (
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white/20 rounded-l-full" />
                 )}
               </button>
             );
           })}
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2">
            <p className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-[#CC1A1A] mb-2">Instructeur</p>
            <button
              onClick={() => navigate('/admin')}
              className={cn(
                "group w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-300",
                location.pathname.startsWith('/admin') ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <ShieldCheck size={22} className={cn("transition-all", location.pathname.startsWith('/admin') ? "text-red-500" : "text-white/30")} />
              <span className="font-black text-sm uppercase tracking-widest italic">Console Admin</span>
            </button>
          </div>
        )}
      </nav>

      {/* User Stats Card in Sidebar */}
      <div className="mt-8 mb-8 p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 relative z-10">
         <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={14} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Progression</span>
         </div>
         <div className="flex items-end justify-between mb-2">
            <span className="text-lg font-black text-white italic">{user?.xp_total} XP</span>
            <span className="text-[9px] font-black text-white/20 uppercase">Niveau {Math.floor(user?.xp_total / 1000) + 1}</span>
         </div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 w-[65%]" />
         </div>
      </div>

      {/* Footer Profile */}
      <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4 px-2 cursor-pointer group" onClick={() => navigate('/profil')}>
          <div className="h-14 w-14 rounded-2xl border-2 border-white/5 shadow-2xl overflow-hidden bg-white/10 shrink-0 group-hover:scale-105 transition-transform duration-500">
             <img 
               src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
               alt="" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-black text-white truncate italic uppercase tracking-tighter leading-none">{user?.display_name}</span>
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1.5">{user?.grade || 'SAPEUR'}</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full py-5 text-[10px] font-black text-white/20 hover:text-white bg-white/[0.02] hover:bg-red-600/20 rounded-[1.5rem] transition-all uppercase tracking-[0.3em] group"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
