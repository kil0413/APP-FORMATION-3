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
      <main className="flex flex-col gap-10 px-5 py-8 md:px-12 md:py-16 max-w-5xl mx-auto w-full">
        
        {/* Profil Header Responsive */}
        <section className="bg-[#1A1A2E] text-white p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="h-28 w-28 md:h-40 md:w-40 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border-4 md:border-8 border-[#CC1A1A] p-1 shadow-2xl relative shrink-0 transition-transform hover:scale-105 duration-500">
            <img 
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.display_name || 'Felix'}`}
              alt="Avatar" 
              className="w-full h-full rounded-[2rem] md:rounded-[3rem] bg-gray-50 object-cover"
            />
            <div className="absolute -bottom-4 -right-4 h-10 w-10 md:h-14 md:w-14 bg-[#CC1A1A] rounded-full flex items-center justify-center text-white border-4 md:border-8 border-[#1A1A2E] shadow-xl">
               <span className="text-sm md:text-lg font-black">{user?.level || 1}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{user?.display_name || 'Sapeur'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="text-[#CC1A1A] font-black uppercase tracking-widest text-[10px] md:text-xs bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">{user?.grade || 'Sapeur'}</span>
              <span className="text-gray-400 font-black uppercase tracking-widest text-[10px] md:text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10">Matricule: #829{user?.id?.slice(0, 3)}</span>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-4 items-end">
             <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-white/5">
                <LogOut size={18} />
                Quitter
             </button>
          </div>

          {/* Décoration BG */}
          <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Col Gauche - Stats (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                 <div className="h-16 w-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-4 shadow-inner">
                   <Award size={32} />
                 </div>
                 <p className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tighter leading-none">{user?.xp_total || 0}</p>
                 <p className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest mt-2">Points XP</p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                 <div className="h-16 w-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-500 mb-4 shadow-inner">
                   <BookOpen size={32} />
                 </div>
                 <p className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tighter leading-none">{user?.completed_fiches?.length || 0}</p>
                 <p className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest mt-2">Dossiers</p>
              </div>
              <div className="hidden md:flex bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                 <div className="h-16 w-16 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-orange-500 mb-4 shadow-inner">
                   <Clock size={32} />
                 </div>
                 <p className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tighter leading-none">{Math.floor((user?.xp_total || 0) / 10)}h</p>
                 <p className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest mt-2">Temps total</p>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100">
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#1A1A2E] mb-8 flex items-center gap-3">
                  <Award className="text-[#CC1A1A]" size={28} />
                  Récompenses du Sapeur
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(badge => (
                     <div key={badge} className="group relative aspect-square bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                        <Award size={48} className="text-gray-300 group-hover:text-yellow-500 transition-colors" strokeWidth={1} />
                        <span className="text-[8px] font-black uppercase text-gray-400">Verrouillé</span>
                     </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Col Droite - PWA & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-10">
            {installPrompt && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/30">
                <h3 className="text-lg font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                    <Smartphone size={24} />
                    Mobile App
                </h3>
                <p className="text-sm opacity-80 font-medium mb-8 leading-relaxed">Installez l'application sur votre écran d'accueil pour un accès instantané même sans connexion.</p>
                <button 
                  onClick={handleInstallApp}
                  className="w-full flex items-center justify-center gap-3 bg-white text-blue-700 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  <Download size={20} />
                  Installer maintenant
                </button>
              </div>
            )}

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Paramètres Compte</h3>
               <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left group">
                    <div className="flex items-center gap-3">
                       <Settings size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                       <span className="font-bold text-sm text-[#1A1A2E]">Préférences</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button onClick={handleLogout} className="md:hidden w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-colors text-left font-black uppercase text-[10px] tracking-widest">
                    <LogOut size={20} />
                    Déconnexion
                  </button>
               </div>
            </div>
          </div>

        </div>

        {/* Footer info center */}
        <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-10">Application de Formation - Version 2.0.0 Cloudflare</p>
      </main>
    </PageWrapper>
  );
}
