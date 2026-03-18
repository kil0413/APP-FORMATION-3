import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Base layout pour un nouveau profil (si non trouvé dans la bdd)
const defaultUserProfile = {
  display_name: 'Pompier',
  grade: 'Sapeur',
  xp_total: 0,
  daily_xp: 0,
  lives: 5,
  completed_fiches: [],
  streak_days: 0,
};

export const useAuthStore = create((set, get) => ({
  user: null, // Si null = non connecté
  isAuthenticated: false,
  isLoading: true,
  installPrompt: null, // Stocke l'événement d'installation PWA

  setInstallPrompt: (prompt) => set({ installPrompt: prompt }),

  // Initialisation au lancement de l'app
  initAuth: async () => {
    // Écoute les changements (connexion / deconnexion)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Va chercher le profil personnalisé dans la base de données
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          isAuthenticated: true, 
          user: { 
             ...session.user, 
             ...(profile || defaultUserProfile), // Fusionne les données sécu avec le profil du jeu
             avatar_url: session.user.user_metadata.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
          },
          isLoading: false
        });

        // Si le profil n'existe pas en BDD, on le crée
        if (!profile) {
          await supabase.from('profiles').insert([{ 
             id: session.user.id, 
             email: session.user.email,
             display_name: session.user.user_metadata.full_name || 'Nouveau Sapeur' 
          }]);
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  // Action pour se connecter avec Google
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
         redirectTo: window.location.origin,
      }
    });
    if (error) console.error("Erreur Google Login:", error.message);
  },

  // Action pour s'inscrire avec Email/Mot de passe
  signUpWithEmail: async (email, password, displayName) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          }
        }
      });
      if (error) throw error;
      
      // Note: Supabase peut envoyer un email de confirmation selon vos réglages (activé par défaut)
      // Si désactivé, l'utilisateur est connecté directement.
      if (data.session) {
         // Le onAuthStateChange va l'attraper de toute façon
      } else {
         alert("Vérifiez votre boîte mail (et vos spams) pour confirmer votre compte !");
         set({ isLoading: false });
      }
    } catch (err) {
      alert("Erreur Inscription: " + err.message);
      set({ isLoading: false });
    }
  },

  // Action pour se connecter avec Email/Mot de passe
  loginWithEmail: async (email, password) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // onAuthStateChange va attraper le changement !
    } catch (err) {
      alert("Erreur Connexion: " + err.message);
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  addXp: async (amount) => {
    const state = get();
    if (!state.user?.id) return;
    
    const newXpTotal = (state.user.xp_total || 0) + amount;
    
    // Met a jour l'apparence directe "optimiste"
    set({ user: { ...state.user, xp_total: newXpTotal } });
    
    // Sauvegarde en base de données
    await supabase.from('profiles').update({ xp_total: newXpTotal }).eq('id', state.user.id);
  },

  completeFiche: async (ficheId) => {
    const state = get();
    if (!state.user?.id) return;

    const oldFiches = state.user.completed_fiches || [];
    if (oldFiches.includes(ficheId)) return; // Déjà faite

    const newFiches = [...oldFiches, ficheId];
    
    set({ user: { ...state.user, completed_fiches: newFiches } });
    await supabase.from('profiles').update({ completed_fiches: newFiches }).eq('id', state.user.id);
  },

  loseLife: async () => {
    const state = get();
    if (!state.user?.id) return;
    
    const newLives = Math.max(0, (state.user.lives || 5) - 1);
    
    set({ user: { ...state.user, lives: newLives } });
    await supabase.from('profiles').update({ lives: newLives }).eq('id', state.user.id);
  },
}));
