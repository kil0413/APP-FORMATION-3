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
import NotFound from './pages/NotFound';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const { fetchData } = useFicheStore();
  const { initAuth, isAuthenticated, isLoading, setInstallPrompt } = useAuthStore();

  useEffect(() => {
    initAuth();

    // Capturer l'événement d'installation PWA
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, [initAuth, setInstallPrompt]);

  // Nouveau : Ne charger les données que LORSQUE l'utilisateur est bien connecté (Empêche le blocage RLS)
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Écran de chargement rapide
  if (isLoading) {
    return <LoadingScreen text="Initialisation Tactical Ops v3.1" />;
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
                    <Route path="*" element={<NotFound />} />
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
