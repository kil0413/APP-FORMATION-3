import { Settings, Award, Clock, BookOpen, ChevronRight, LogOut, Download, Smartphone, Flame, Star, Trophy, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFicheStore } from '../store/useFicheStore';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';

export default function Profil() {
  const { user, logout, installPrompt, setInstallPrompt } = useAuthStore();
  const { fiches, categories } = useFicheStore();
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

  const getLevel = (xp) => {
    if (xp >= 300) return 3;
    if (xp >= 150) return 2;
    if (xp >= 50) return 1;
    return 0;
  };
  
  const xp = user?.xp_total || 0;
  const currentLevel = getLevel(xp);

  // Compute completed fiches on 'incendie' theme
  const incendieCategory = categories?.find(c => c.name.toLowerCase().includes('incendie'));
  const incendieCategoryId = incendieCategory ? incendieCategory.id : null;
  const completedIncendieFiches = (user?.completed_fiches || []).filter(fc => {
     const ficheId = fc.includes('|') ? fc.split('|')[0] : fc;
     const fiche = fiches?.find(f => f.id === ficheId);
     return fiche && fiche.category_id === incendieCategoryId;
  });
  const incendieCount = completedIncendieFiches.length;
  const streak = user?.streak_days || 0;

  const badges = [
    {
       id: 'apprentissage',
       name: 'Badge d\'apprentissage',
       icon: BookOpen,
       color: 'text-blue-500',
       bg: 'bg-blue-500',
       unlocked: streak >= 5,
       description: '5 jours d\'affilée'
    },
    {
       id: 'perseverance',
       name: 'Badge de persévérance',
       icon: ShieldCheck,
       color: 'text-purple-500',
       bg: 'bg-purple-500',
       unlocked: streak >= 10,
       description: '10 jours d\'affilée'
    },
    {
       id: 'ultime',
       name: 'Révision ultime',
       icon: Award,
       color: 'text-yellow-500',
       bg: 'bg-yellow-500',
       unlocked: streak >= 30,
       description: '30 jours d\'affilée'
    },
    {
       id: 'fire1',
       name: 'FIRE 1',
       icon: Flame,
       color: 'text-red-500',
       bg: 'bg-red-500',
       unlocked: incendieCount >= 5,
       description: '5 fiches Incendie'
    }
  ];

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
               <span className="text-sm md:text-lg font-black">{currentLevel}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{user?.display_name || 'Sapeur'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="text-[#CC1A1A] font-black uppercase tracking-widest text-[10px] md:text-xs bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">{user?.grade || 'Sapeur'}</span>
              <span className="text-gray-400 font-black uppercase tracking-widest text-[10px] md:text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10">Matricule: #829{user?.id?.slice(0, 3) || '000'}</span>
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
               <div className="bg-[#1E293B]/20 p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                  <div className="h-16 w-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-400 mb-4 shadow-xl">
                    <Award size={32} />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">{xp}</p>
                  <p className="text-[10px] md:text-xs font-black uppercase text-white/40 tracking-widest mt-2">Points XP</p>
               </div>
               <div className="bg-[#1E293B]/20 p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                  <div className="h-16 w-16 bg-green-500/10 rounded-[1.5rem] flex items-center justify-center text-green-400 mb-4 shadow-xl">
                    <BookOpen size={32} />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">{user?.completed_fiches?.length || 0}</p>
                  <p className="text-[10px] md:text-xs font-black uppercase text-white/40 tracking-widest mt-2">Dossiers</p>
               </div>
               <div className="hidden md:flex bg-[#1E293B]/20 p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                  <div className="h-16 w-16 bg-orange-500/10 rounded-[1.5rem] flex items-center justify-center text-orange-400 mb-4 shadow-xl">
                    <Clock size={32} />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">{Math.floor(xp / 10)}h</p>
                  <p className="text-[10px] md:text-xs font-black uppercase text-white/40 tracking-widest mt-2">Temps total</p>
               </div>
            </div>

            {/* Badges Section */}
             <div className="bg-[#1E293B]/20 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/5">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-8 flex items-center gap-3">
                   <Award className="text-red-500" size={28} />
                   Récompenses du Sapeur
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                   {badges.map((badge, idx) => {
                      const Icon = badge.icon;
                      if (!badge.unlocked) {
                        return (
                          <div key={badge.id || idx} className="group relative aspect-square bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-help text-center p-2">
                             <Icon size={40} className="text-white/20 group-hover:text-white/50 transition-colors" strokeWidth={1.5} />
                             <span className="text-[9px] font-black uppercase text-white/40">{badge.name}</span>
                             <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{badge.description}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={badge.id || idx} className="group relative aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-2 transition-all cursor-help hover:scale-105 shadow-xl hover:shadow-2xl text-center p-2">
                           <div className={`p-3 rounded-full ${badge.bg}/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                             <Icon size={32} className={badge.color} strokeWidth={2} />
                           </div>
                           <span className="text-[9px] font-black uppercase text-white">{badge.name}</span>
                           <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">{badge.description}</span>
                        </div>
                      );
                   })}
                   {/* Pour combler et faire joli s'il y a de la place */}
                   {Array.from({ length: Math.max(0, 4 - badges.length) }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="group relative aspect-square bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 grayscale opacity-20">
                         <Star size={32} className="text-white/10" strokeWidth={1} />
                         <span className="text-[8px] font-black uppercase text-white/20">Secret</span>
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
                  className="w-full flex items-center justify-center gap-3 bg-blue-500/10 text-blue-400 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-500/20 transition-all active:scale-95"
                >
                  <Download size={20} />
                  Installer maintenant
                </button>
              </div>
            )}

             <div className="bg-[#1E293B]/20 p-8 rounded-[2.5rem] shadow-2xl border border-white/5">
                <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-6">Paramètres Compte</h3>
                <div className="space-y-4">
                   <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-left group">
                     <div className="flex items-center gap-3">
                        <Settings size={20} className="text-white/40 group-hover:text-red-500 transition-colors" />
                        <span className="font-bold text-sm text-white">Préférences</span>
                     </div>
                     <ChevronRight size={18} className="text-white/10" />
                   </button>
                   <button onClick={handleLogout} className="md:hidden w-full flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-colors text-left font-black uppercase text-[10px] tracking-widest">
                     <LogOut size={20} />
                     Déconnexion
                   </button>
                </div>
             </div>
          </div>

        </div>

        {/* Footer info center */}
         <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mt-10 italic">Fire Académie — Centre de Préparation Élite</p>
      </main>
    </PageWrapper>
  );
}
