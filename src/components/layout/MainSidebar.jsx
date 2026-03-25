import { Home, BookOpen, FolderOpen, User, LogOut, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';
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
    { name: 'Profil', path: '/profil', icon: User },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="hidden md:flex w-80 h-screen sticky top-0 bg-[#0A0A12] border-r border-white/5 flex-col py-10 px-8 transition-all duration-500 overflow-hidden relative">
      
      {/* Decorative BG pattern - Faint Red Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-red-600/[0.03] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-red-600/[0.02] blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Brand - Modern Vertical Layout */}
      <div className="flex flex-col gap-6 mb-16 relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-14 w-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_40px_rgba(239,68,68,0.2)] group-hover:rotate-6 transition-transform duration-700">
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
           <p className="px-5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Poste de Commandement</p>
           {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             const Icon = item.icon;
             return (
               <button
                 key={item.name}
                 onClick={() => navigate(item.path)}
                 className={cn(
                   "group w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden text-left",
                   isActive 
                     ? "bg-red-500/[0.08] text-white border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" 
                     : "text-white/40 hover:bg-white/[0.03] hover:text-white border border-transparent"
                 )}
               >
                 <Icon size={22} className={cn("transition-all duration-700 group-hover:scale-110", isActive ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "text-white/20")} />
                 <span className="font-black text-sm uppercase tracking-widest italic">{item.name}</span>
                 {isActive && (
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 blur-[1px] rounded-l-full" />
                 )}
               </button>
             );
           })}
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2">
            <p className="px-5 text-[10px] font-black uppercase tracking-[0.4em] text-red-500/40 mb-4">Instructeur</p>
            <button
              onClick={() => navigate('/admin')}
              className={cn(
                "group w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden text-left",
                location.pathname.startsWith('/admin') 
                  ? "bg-white/10 text-white border border-white/10" 
                  : "text-white/40 hover:bg-white/[0.03] hover:text-white border border-transparent"
              )}
            >
              <ShieldCheck size={22} className={cn("transition-all duration-700 group-hover:rotate-12", location.pathname.startsWith('/admin') ? "text-red-500" : "text-white/30")} />
              <span className="font-black text-sm uppercase tracking-widest italic">Console Admin</span>
            </button>
          </div>
        )}
      </nav>

      {/* User Stats Card in Sidebar - Elite Design */}
      <div className="mt-8 mb-8 p-6 bg-white/[0.02] rounded-[2.5rem] border border-white/5 relative z-10 group cursor-pointer hover:bg-white/[0.04] transition-all duration-500">
         <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={14} className="text-red-500 group-hover:translate-y-[-2px] transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Niveau de Service</span>
         </div>
         <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white italic leading-none">{user?.xp_total.toLocaleString()}</span>
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em] mt-1">XP ACQUIS</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
               <span className="text-xs font-black text-red-500">{Math.floor(user?.xp_total / 1000) + 1}</span>
            </div>
         </div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
            <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-1000" style={{ width: `${(user?.xp_total % 1000) / 10}%` }} />
         </div>
      </div>

      {/* Footer Profile - Premium Elite Styling */}
      <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4 px-2 cursor-pointer group" onClick={() => navigate('/profil')}>
          <div className="h-14 w-14 rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-white/5 shrink-0 group-hover:scale-105 group-hover:border-red-600/30 transition-all duration-700">
             <img 
               src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
               alt="" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-black text-white truncate italic uppercase tracking-tighter leading-none group-hover:text-red-500 transition-colors">{user?.display_name}</span>
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">{user?.grade || 'SAPEUR-POMPIER'}</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full py-5 text-[10px] font-black text-white/20 hover:text-white bg-white/[0.01] hover:bg-red-600/10 border border-white/5 hover:border-red-600/20 rounded-[1.5rem] transition-all uppercase tracking-[0.4em] group"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          Quitter l'App
        </button>
      </div>
    </aside>
  );
}
