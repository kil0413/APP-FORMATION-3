import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Lock, X, ChevronLeft, Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardTab from './tabs/DashboardTab';
import FichesTab from './tabs/FichesTab';
import QuizzesTab from './tabs/QuizzesTab';
import UsersTab from './tabs/UsersTab';
import SettingsTab from './tabs/SettingsTab';
import { useFicheStore } from '../../store/useFicheStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithEmail, isLoading: authLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const { fetchData } = useFicheStore();
  const { fetchProfiles } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
       fetchData();
       fetchProfiles();
    }
  }, [isAuthenticated, isAdmin, fetchData, fetchProfiles]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await loginWithEmail(email, pwd);
      // Le useEffect gérera la suite une fois l'auth réussie
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/profil');
  };

  // En attente du chargement initial
  if (authLoading) {
    return <div className="h-screen w-full bg-[#0F0F1A] flex items-center justify-center text-white">Initialisation...</div>;
  }

  // Écran de login si non authentifié ou pas admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-screen bg-[#0F0F1A] items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] -translate-y-1/2 translate-x-1/3 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] translate-y-1/2 -translate-x-1/3 rounded-full" />

        <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500">
          <header className="text-center mb-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-[#1A1A2E] to-[#0A0A15] text-white shadow-2xl mb-6 border border-white/5">
              <Lock size={32} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic drop-shadow-sm">Console <span className="text-[#CC1A1A]">Admin</span></h1>
            {isAuthenticated && !isAdmin && (
               <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-xs font-bold uppercase tracking-widest">
                  Accès Refusé : Vous n'êtes pas administrateur.
               </div>
            )}
            <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Identifiez-vous pour gérer la plateforme</p>
          </header>
          
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email</label>
                <input 
                  type="email" 
                  placeholder="votre.nom@sdis.fr"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 font-bold text-white outline-none focus:border-red-500/50"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Mot de passe</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 font-bold text-white outline-none focus:border-red-500/50"
                  value={pwd} onChange={e => setPwd(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full mt-4 bg-gradient-to-r from-[#CC1A1A] to-[#991414] text-white rounded-[1.5rem] py-5 font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-sm disabled:opacity-50"
              >
                {isLoggingIn ? 'Connexion...' : 'Se connecter au panel'}
              </button>
              <button type="button" onClick={() => navigate('/profil')} className="text-gray-400 text-xs font-bold mt-6 uppercase tracking-widest w-full text-center hover:text-white transition-colors">
                ← Retour au profil 
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#FAFAFB] overflow-hidden text-[#1A1A2E]">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block">
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* Sidebar for Mobile */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
          <div className="relative w-64 h-full animate-in slide-in-from-left duration-300">
            <AdminSidebar onLogout={handleLogout} />
            <button 
              onClick={() => setShowMobileSidebar(false)}
              className="absolute top-4 -right-12 h-10 w-10 flex items-center justify-center bg-white rounded-xl text-black shadow-xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setShowMobileSidebar(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<DashboardTab />} />
            <Route path="/fiches" element={<FichesTab />} />
            <Route path="/quizzes" element={<QuizzesTab />} />
            <Route path="/users" element={<UsersTab />} />
            <Route path="/settings" element={<SettingsTab />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
