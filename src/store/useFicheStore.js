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
      // Récupérer les catégories
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*');
        
      if (catError) throw catError;

      // Récupérer les fiches
      const { data: fichesData, error: ficheError } = await supabase
        .from('fiches')
        .select('*');

      if (ficheError) throw ficheError;

      // Récupérer les quiz
      const { data: quizzesData, error: quizError } = await supabase
        .from('quizzes')
        .select('*');

      // (Le quiz error est ignoré si la table n'existe pas encore sur Supabase, on utilisera le fallback)

      set({ 
        categories: categoriesData?.length > 0 ? categoriesData : fallbackCategories, 
        fiches: fichesData?.length > 0 ? fichesData : fallbackFiches,
        quizzes: quizzesData?.length > 0 ? quizzesData : fallbackQuizzes,
        isLoading: false 
      });
    } catch (err) {
      console.error('Erreur Supabase:', err.message);
      set({ 
        error: err.message, 
        isLoading: false,
        // Fallback sur les données mockées en cas d'erreur
        fiches: fallbackFiches,
        categories: fallbackCategories,
        quizzes: fallbackQuizzes
      });
    }
  },

  addFiche: async (newFiche) => {
    try {
      const { data, error } = await supabase
        .from('fiches')
        .insert([{
          ...newFiche,
          is_published: true
        }])
        .select();

      if (error) throw error;

      if (data) {
        set((state) => ({ fiches: [...state.fiches, data[0]] }));
      }
    } catch (err) {
      console.error('Erreur addFiche:', err.message);
      // En mode développement/offline, on ajoute au local quand même pour le test
      const tempFiche = { ...newFiche, id: `tmp-${Date.now()}`, is_published: true };
      set((state) => ({ fiches: [...state.fiches, tempFiche] }));
    }
  },

  updateFiche: async (id, updatedFiche) => {
    try {
      if (typeof id === 'string' && id.startsWith('f')) {
        // Mock data logic
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
      // Fallback
      set((state) => ({ fiches: state.fiches.map(f => f.id === id ? { ...f, ...updatedFiche } : f) }));
    }
  },

  deleteFiche: async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('f')) {
        // C'est une fiche mockée (f1, f2...), on la retire du local
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
      set((state) => ({ fiches: state.fiches.filter((f) => f.id !== id) }));
    }
  }
}));
