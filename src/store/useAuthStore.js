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
    try {
      // 1. Démarrer avec le chargement
      set({ isLoading: true });

      // 2. Vérifier s'il y a déjà une session active (très rapide)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          isAuthenticated: true, 
          user: { 
             ...session.user, 
             ...(profile || defaultUserProfile),
             avatar_url: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
          },
          isLoading: false
        });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }

      // 3. Écouter les changements futurs (connexion / deconnexion)
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          // Récupérer le profil existant
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // SI LE PROFIL N'EXISTE PAS (Premier login), on le crée en BDD
          if (!profile) {
            const newProfile = {
              id: session.user.id,
              display_name: session.user.user_metadata.full_name || 'Pompier',
              email: session.user.email,
              grade: 'Sapeur',
              xp_total: 0,
              lives: 5,
              completed_fiches: [],
              role: 'student'
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert([newProfile])
              .select()
              .single();
            
            if (!createError) profile = createdProfile;
          }

          set({ 
            isAuthenticated: true, 
            user: { 
               ...session.user, 
               ...(profile || defaultUserProfile),
               avatar_url: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
            },
            isLoading: false
          });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      });

      // 4. Sécurité : Si après 5 secondes on charge toujours, on débloque
      setTimeout(() => {
        if (get().isLoading) {
          set({ isLoading: false });
        }
      }, 5000);

    } catch (error) {
      console.error("Erreur initAuth:", error);
      set({ isLoading: false });
    }
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

    const now = new Date().toISOString();
    const entry = `${ficheId}|${now}`;

    // On retire l'ancienne entrée de cette fiche si elle existe pour éviter les doublons 
    // et on la replace à la fin pour qu'elle remonte dans "Dernières activités"
    const oldFiches = (state.user.completed_fiches || []).filter(e => {
       const id = e.includes('|') ? e.split('|')[0] : e;
       return id !== ficheId;
    });

    const newFiches = [...oldFiches, entry];
    
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

  // --- ACTIONS ADMIN ---
  profiles: [],
  fetchProfiles: async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      set({ profiles: data || [] });
    } catch (err) {
      console.error("Erreur fetchProfiles:", err.message);
    }
  },

  deleteProfile: async (id) => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({ profiles: state.profiles.filter(p => p.id !== id) }));
    } catch (err) {
      console.error("Erreur deleteProfile:", err.message);
    }
  },

  updateProfile: async (id, updates) => {
    try {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select();
      if (error) throw error;
      if (data) {
        set((state) => ({ profiles: state.profiles.map(p => p.id === id ? data[0] : p) }));
      }
    } catch (err) {
      console.error("Erreur updateProfile:", err.message);
    }
  }
}));
