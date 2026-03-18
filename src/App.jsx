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
      <div className="flex h-screen items-center justify-center bg-[#CC1A1A]">
         <div className="text-white font-black uppercase text-xl animate-pulse">Chargement SP...</div>
      </div>
    );
  }

  // App non connectée
  if (!isAuthenticated) {
    return (
      <div className="font-['Inter'] flex min-h-screen text-gray-900 bg-black">
        <div className="mx-auto w-full max-w-[390px] shadow-2xl relative bg-[#F2F2F7] overflow-x-hidden md:my-4 md:h-[844px] md:rounded-[40px] md:border-[8px] md:border-black ring-1 ring-gray-900/5">
          <Login />
        </div>
      </div>
    );
  }

  // App Connectée
  return (
    <Router>
      <div className="font-['Inter'] flex min-h-screen text-gray-900 bg-black">
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={
            <div className="mx-auto w-full max-w-[390px] shadow-2xl relative bg-[#F2F2F7] overflow-x-hidden md:my-4 md:h-[844px] md:rounded-[40px] md:border-[8px] md:border-black ring-1 ring-gray-900/5">
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
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
