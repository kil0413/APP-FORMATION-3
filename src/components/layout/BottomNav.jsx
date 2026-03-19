import { Home, BookOpen, FolderOpen, User, Flame, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Parcours', path: '/parcours', icon: BookOpen },
    { name: 'Répertoire', path: '/repertoire', icon: FolderOpen },
    { name: 'Profil', path: '/profil', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <div className="flex items-center justify-between bg-[#1A1A2E]/90 backdrop-blur-2xl p-3 px-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 relative overflow-hidden">
        
        {/* Animated Background Highlight */}
        {tabs.map((tab, idx) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-4 transition-all duration-500",
                isActive ? "text-white scale-110" : "text-white/30 hover:text-white/60"
              )}
            >
              <div className="relative z-10">
                <Icon size={22} className={cn("transition-all duration-500", isActive ? "fill-white/10" : "")} />
                
                {/* Active Indicator Dot */}
                {isActive && (
                   <motion.div 
                     layoutId="bottom-nav-dot"
                     className="absolute -top-1 -right-1 h-2 w-2 bg-[#CC1A1A] rounded-full shadow-[0_0_10px_#CC1A1A]"
                   />
                )}
              </div>
              
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest mt-1.5 transition-all duration-500 relative z-10",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}>
                {tab.name}
              </span>

              {/* Background pill animation */}
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 bg-white/5 rounded-2xl -z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
