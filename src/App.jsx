import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Parcours from './pages/Parcours';
import Repertoire from './pages/Repertoire';
import Profil from './pages/Profil';
import Fiche from './pages/Fiche';
import Procedure from './pages/Procedure';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';
import { useFicheStore } from './store/useFicheStore';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { fetchData } = useFicheStore();
  const { initAuth, isAuthenticated, isLoading, setInstallPrompt } = useAuthStore();

  useEffect(() => {
    initAuth();
    fetchData();

    // Capturer l'événement d'installation PWA
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, [fetchData, initAuth, setInstallPrompt]);

  // Écran de chargement rapide
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 h-screen items-center justify-center bg-[#0F0A0A] overflow-hidden relative">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #EF4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
         
         <div className="relative z-10 flex flex-col items-center">
            <div className="h-32 w-32 relative group">
               <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
               <img src="/logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-3">
               <h2 className="text-white font-black uppercase italic tracking-[0.4em] text-sm animate-in fade-in slide-in-from-bottom duration-1000">Fire Académie</h2>
               <div className="flex gap-1.5 mt-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
               </div>
            </div>
         </div>
         
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/10 font-black uppercase tracking-[0.8em] text-[8px] whitespace-nowrap">
            Initialisation Tactical Ops v3.1
         </div>
      </div>
    );
  }

  // App non connectée
  if (!isAuthenticated) {
    return (
      <Login />
    );
  }

  // App Connectée
  return (
    <Router>
      <div className="font-['Inter'] flex min-h-screen text-gray-900 bg-[#F2F2F7]">
        <Routes>
          {/* Admin Dashboard - Always take full screen on its own */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* User App - Responsive Layout */}
          <Route path="*" element={
            <div className="flex w-full min-h-screen">
              <div className="mx-auto w-full flex relative">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/parcours" element={<Parcours />} />
                    <Route path="/repertoire" element={<Repertoire />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/fiche/:id" element={<Fiche />} />
                    <Route path="/quiz/:id" element={<Quiz />} />
                    <Route path="/procedure/:id" element={<Procedure />} />
                    <Route path="/quiz-general" element={<Quiz />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ErrorBoundary>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
