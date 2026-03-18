import { Flame, Bell, ChevronLeft, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header({ title, backButton = false, rightElement, showLogo = false }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[#F2F2F7]/90 px-4 backdrop-blur-md">
      <div className="flex flex-1 items-center">
        {backButton ? (
          <button 
            onClick={() => navigate(-1)} 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm transition-transform active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
        ) : showLogo ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CC1A1A] text-white shadow-md shadow-red-500/20">
            <Flame size={24} fill="currentColor" />
          </div>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      <div className="flex-2 flex justify-center text-center">
        {title ? (
          <h1 className="text-lg font-bold text-[#1A1A2E] truncate px-2">{title}</h1>
        ) : (
          <h1 className="text-lg font-bold text-[#1A1A2E]">Formation Pompiers</h1>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {rightElement ? rightElement : (
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-transform active:scale-95">
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#CC1A1A] ring-2 ring-white"></span>
          </button>
        )}
      </div>
    </div>
  );
}
