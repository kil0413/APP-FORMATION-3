import { Home, BookOpen, FolderOpen, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

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
    <div className="md:hidden fixed bottom-0 z-50 w-full bg-white pt-2 pb-6 px-6 ring-1 ring-gray-200">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={cn(
                "group flex flex-col items-center justify-center space-y-1 w-16 transition-colors",
                isActive ? "text-[#CC1A1A]" : "text-[#8E8E93]"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                  isActive ? "bg-red-50" : "bg-transparent group-active:bg-gray-100"
                )}
              >
                <Icon size={24} className={isActive ? "fill-[#CC1A1A]/20" : ""} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-300",
                isActive ? "text-[#CC1A1A]" : "text-[#8E8E93]"
              )}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
