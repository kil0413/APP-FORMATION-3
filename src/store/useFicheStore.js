import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { fiches as fallbackFiches, categories as fallbackCategories, quizzes as fallbackQuizzes } from '../mockData';

export const useFicheStore = create((set, get) => ({
  fiches: [],
  categories: [],
  quizzes: [],
  isLoading: false,
  error: null,

  // Charger les données depuis Supabase
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const isRealSupabase = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');
      
      let categoriesData = [], fichesData = [], quizzesData = [];

      if (isRealSupabase) {
        // Chargement indépendant pour ne pas tout bloquer si une table manque
        try {
          const resC = await supabase.from('categories').select('*');
          if (resC.error) throw resC.error;
          categoriesData = resC.data || [];
        } catch (e) { 
          console.error("Erreur categories:", e.message);
        }

        try {
          const resF = await supabase.from('fiches').select('*');
          if (resF.error) throw resF.error;
          fichesData = resF.data || [];
        } catch (e) {
          console.error("Erreur fiches:", e.message);
          set({ error: "Erreur Supabase: " + e.message });
        }

        try {
          const resQ = await supabase.from('quizzes').select('*');
          if (resQ.error) throw resQ.error;
          quizzesData = resQ.data || [];
        } catch (e) {
          console.error("Erreur quizzes:", e.message);
        }
      }

      // Fusionner avec les données de secours (pour s'assurer qu'il y a toujours du contenu)
      // On utilise les données DB en priorité si ID identiques
      const finalCategories = [...(categoriesData || [])];
      fallbackCategories.forEach(fallback => {
        if (!finalCategories.find(c => c.id === fallback.id)) {
          finalCategories.push(fallback);
        }
      });

      const finalFiches = [...(fichesData || [])];
      fallbackFiches.forEach(fallback => {
        if (!finalFiches.find(f => f.id === fallback.id)) {
          finalFiches.push(fallback);
        }
      });

      // Trier les fiches : les plus récentes en premier (id tmp ou created_at)
      finalFiches.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
      });

      set({ 
        categories: finalCategories,
        fiches: finalFiches,
        quizzes: quizzesData,
        isLoading: false,
        realFichesCount: (fichesData || []).length,
        realQuizzesCount: (quizzesData || []).length,
        realCategoriesCount: (categoriesData || []).length
      });
    } catch (err) {
      console.error('Erreur Data Fetching:', err);
      set({ 
        categories: fallbackCategories,
        fiches: fallbackFiches,
        quizzes: fallbackQuizzes,
        isLoading: false,
        realFichesCount: 0,
        realQuizzesCount: 0,
        realCategoriesCount: 0
      });
    }
  },

  addFiche: async (newFiche) => {
    // Si Supabase n'est pas configuré (URL placeholder), on passe direct au store local
    const isRealSupabase = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');
    
    try {
      if (!isRealSupabase) {
        throw new Error('Supabase not configured, using local fallback');
      }

      const { data, error } = await supabase
        .from('fiches')
        .insert([{
          ...newFiche,
          is_published: true
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newDoc = data[0];
        set((state) => ({ fiches: [newDoc, ...state.fiches] }));
        
        // Auto-génération d'un QCM
        const quizPayload = {
          title: 'Quiz : ' + newDoc.title,
          fiche_id: newDoc.id,
          is_published: true,
          questions: [
            {
              q: 'Question d\'exemple pour ' + newDoc.title,
              answers: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'],
              correct: 0,
              explanation: 'Explication de la réponse A.'
            }
          ]
        };
        get().addQuiz(quizPayload);
      }
    } catch (err) {
      console.error('Erreur addFiche:', err.message);
      
      // Afficher l'alerte seulement si c'était censé être une vraie connexion
      if (isRealSupabase) {
        alert('Attention : Erreur de sauvegarde réseau (' + err.message + '). La fiche sera visible localement mais risque de disparaître au rafraîchissement.');
      }

      // En mode développement/offline, on ajoute au local quand même pour le test
      const tempFiche = { 
        ...newFiche, 
        id: `tmp-${Date.now()}`, 
        is_published: true,
        created_at: new Date().toISOString()
      };
      set((state) => ({ 
        fiches: [tempFiche, ...state.fiches] 
      }));
      
      // Auto-génération locale QCM
      const tempQuiz = {
        title: 'Quiz : ' + tempFiche.title,
        fiche_id: tempFiche.id,
        is_published: true,
        questions: [{ q: 'Question test ?', answers: ['Oui', 'Non'], correct: 0, explanation: 'Test' }]
      };
      get().addQuiz(tempQuiz);
    }
  },

  updateFiche: async (id, updatedFiche) => {
    const isRealSupabase = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');

    try {
      if (typeof id === 'string' && id.startsWith('f') || !isRealSupabase) {
        // Mock data logic ou non configuré
        set((state) => ({ fiches: state.fiches.map(f => f.id === id ? { ...f, ...updatedFiche } : f) }));
        return;
      }

      const { data, error } = await supabase
        .from('fiches')
        .update(updatedFiche)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({ fiches: state.fiches.map(f => f.id === id ? data[0] : f) }));
      }
    } catch (err) {
      console.error('Erreur updateFiche:', err.message);
      if (isRealSupabase) {
        alert('Erreur de mise à jour réseau: ' + err.message);
      }
      // Fallback
      set((state) => ({ fiches: state.fiches.map(f => f.id === id ? { ...f, ...updatedFiche } : f) }));
    }
  },

  deleteFiche: async (id) => {
    const isRealSupabase = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');

    try {
      if (typeof id === 'string' && id.startsWith('f') || !isRealSupabase) {
        // C'est une fiche mockée ou non configuré
        set((state) => ({ fiches: state.fiches.filter((f) => f.id !== id) }));
        return;
      }

      const { error } = await supabase
        .from('fiches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({ fiches: state.fiches.filter((f) => f.id !== id) }));
    } catch (err) {
      console.error('Erreur deleteFiche:', err.message);
      if (isRealSupabase) {
        alert('Erreur de suppression réseau: ' + err.message);
      }
      // Toujours filtrer localement
      set((state) => ({ fiches: state.fiches.filter((f) => f.id !== id) }));
    }
  },

  addQuiz: async (newQuiz) => {
    const isRealSupabase = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');
    try {
      if (!isRealSupabase) throw new Error('Mock');
      const { data, error } = await supabase.from('quizzes').insert([newQuiz]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({ quizzes: [...state.quizzes, data[0]] }));
      }
    } catch (err) {
      const tempQ = { ...newQuiz, id: `tmp-q-${Date.now()}` };
      set((state) => ({ quizzes: [...state.quizzes, tempQ] }));
    }
  },
  
  updateQuiz: async (id, updatedQuiz) => {
    const isRealSupabase = supabase.supabaseUrl && !supabase.supabaseUrl.includes('placeholder');
    try {
      if (typeof id === 'string' && id.startsWith('tmp') || !isRealSupabase) {
        set((state) => ({ quizzes: state.quizzes.map(q => q.id === id ? { ...q, ...updatedQuiz } : q) }));
        return;
      }
      const { data, error } = await supabase.from('quizzes').update(updatedQuiz).eq('id', id).select();
      if (error) throw error;
      if (data) {
        set((state) => ({ quizzes: state.quizzes.map(q => q.id === id ? data[0] : q) }));
      }
    } catch (err) {
      set((state) => ({ quizzes: state.quizzes.map(q => q.id === id ? { ...q, ...updatedQuiz } : q) }));
    }
  }
}));
