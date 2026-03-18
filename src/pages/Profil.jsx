import { Settings, Award, Clock, BookOpen, ChevronRight, LogOut, Download, Smartphone } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';

export default function Profil() {
  const { user, logout, installPrompt, setInstallPrompt } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <PageWrapper title="Profil" hideHeader>
      
      {/* Profil Header */}
      <div className="bg-[#1A1A2E] pt-12 pb-8 px-6 rounded-b-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
           <button onClick={() => navigate('/admin')} className="text-white/50 hover:text-white transition-colors">
              <Settings size={24} />
           </button>
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <div className="h-24 w-24 rounded-[2rem] bg-white border-4 border-[#CC1A1A] p-1 shadow-xl relative">
            <img 
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.display_name || 'Felix'}`}
              alt="Avatar" 
              className="w-full h-full rounded-[1.5rem] bg-gray-50"
            />
            <div className="absolute -bottom-3 -right-3 h-8 w-8 bg-[#CC1A1A] rounded-full flex items-center justify-center text-white border-4 border-[#1A1A2E]">
               <span className="text-xs font-black">{user?.level || 1}</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white mt-4 tracking-tighter uppercase italic">{user?.display_name || 'Sapeur'}</h1>
          <p className="text-[#CC1A1A] font-black uppercase tracking-widest text-[10px] bg-red-500/10 px-3 py-1 rounded-full mt-2 border border-red-500/20">{user?.grade || 'Sapeur'}</p>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        
        {/* Stats Rapides */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <div className="h-12 w-12 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-3">
               <Award size={24} />
             </div>
             <p className="text-2xl font-black text-[#1A1A2E] tracking-tighter">{user?.xp_total || 0}</p>
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Points XP</p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <div className="h-12 w-12 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-500 mb-3">
               <BookOpen size={24} />
             </div>
             <p className="text-2xl font-black text-[#1A1A2E] tracking-tighter">{user?.completed_fiches?.length || 0}</p>
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Doc. lus</p>
          </div>
        </div>

        {/* Section Application / Installation */}
        {installPrompt ? (
          <div>
            <h3 className="text-sm font-black uppercase italic tracking-tighter text-[#1A1A2E] mb-4 flex items-center gap-2">
                <span className="h-4 w-1 bg-[#CC1A1A] rounded-full" />
                Application
            </h3>
            <button 
              onClick={handleInstallApp}
              className="w-full flex items-center justify-between bg-blue-600 text-white p-5 rounded-[2rem] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Download size={22} />
                </div>
                <div>
                   <p className="font-black uppercase tracking-tighter text-sm italic">Installer l'Appli</p>
                   <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest leading-none">Accès direct écran d'accueil</p>
                </div>
              </div>
              <ChevronRight size={20} className="opacity-50" />
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
             <Smartphone className="text-gray-400 shrink-0" size={20} />
             <p className="text-[10px] font-bold text-gray-400 uppercase italic leading-tight">
               L'application est détectée comme installée ou demande une installation manuelle (Partage &gt; "Sur l'écran d'accueil" sur iPhone).
             </p>
          </div>
        )}

        {/* Section Médailles/Badges */}
        <div>
           <h3 className="text-sm font-black uppercase italic tracking-tighter text-[#1A1A2E] mb-4 flex items-center gap-2">
              <span className="h-4 w-1 bg-[#CC1A1A] rounded-full" />
              Récompenses
           </h3>
           <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(badge => (
                 <div key={badge} className="aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center grayscale opacity-30">
                    <Award size={32} className="text-gray-400" />
                 </div>
              ))}
           </div>
        </div>
        
        {/* Déconnexion */}
        <div className="pt-4 pb-20">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-500 p-4 rounded-2xl uppercase font-black text-xs tracking-widest border border-red-100 hover:bg-red-100 transition-colors active:scale-95"
           >
             <LogOut size={16} />
             Déconnexion Google
           </button>
        </div>

      </div>
    </PageWrapper>
  );
}
