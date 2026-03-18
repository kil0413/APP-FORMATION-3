import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';

export default function AdminHeader({ title, onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 max-w-xl relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un document, un élève..."
            className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#CC1A1A]/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
          <Bell size={20} />
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
          <Sun size={20} />
        </button>
        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 py-1.5 px-3 rounded-xl transition-all">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-tighter text-[#1A1A2E]">SDIS Console</p>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">En ligne</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-[#CC1A1A]/10 text-[#CC1A1A] flex items-center justify-center font-black">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
