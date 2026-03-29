import { Flame, Bell, ChevronLeft, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header({ title, backButton = false, rightElement, showLogo = false }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 flex h-20 w-full items-center justify-between bg-[#0A0A12]/80 px-6 backdrop-blur-2xl border-b border-white/5">
      <div className="flex flex-1 items-center">
        {backButton ? (
          <button 
            onClick={() => navigate(-1)} 
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white border border-white/10 shadow-xl transition-all active:scale-95"
          >
            <ChevronLeft size={28} />
          </button>
        ) : showLogo ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] overflow-hidden shadow-2xl shadow-red-600/30 bg-black/20 border border-white/5 relative">
            <img src="/logo.png" alt="Logo" className="w-[120%] h-[120%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        ) : (
          <div className="w-12 h-12" />
        )}
      </div>

      <div className="flex flex-2 justify-center text-center items-center">
        {title ? (
          <h1 className="text-xl font-black text-white truncate px-4 uppercase tracking-tighter italic">
            {title}
            <span className="text-[8px] text-white/20 ml-2 not-italic font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">V4.2 M-ELITE</span>
          </h1>
        ) : (
          <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">
            Fire Académie <span className="text-[8px] text-white/20 ml-2 not-italic font-black tracking-widest">V4.2</span>
          </h1>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {rightElement ? rightElement : (
          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/40 border border-white/10 shadow-xl transition-all active:scale-95 hover:text-white">
            <Bell size={24} />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-600 ring-4 ring-[#0A0A12]"></span>
          </button>
        )}
      </div>
    </div>
  );
}
