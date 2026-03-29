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
      <div className="flex flex-col gap-6 h-screen items-center justify-center bg-[#0b0a0d]">
         <div className="h-24 w-24 relative animate-pulse">
            <img src="/logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
