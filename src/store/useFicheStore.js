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
      // Récupérer les données en parallèle
      const [
        { data: categoriesData },
        { data: fichesData },
        { data: quizzesData }
      ] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('fiches').select('*'),
        supabase.from('quizzes').select('*')
      ]);

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

      const finalQuizzes = [...(quizzesData || [])];
      fallbackQuizzes.forEach(fallback => {
        if (!finalQuizzes.find(q => q.id === fallback.id)) {
          finalQuizzes.push(fallback);
        }
      });

      set({ 
        categories: finalCategories,
        fiches: finalFiches,
        quizzes: finalQuizzes,
        isLoading: false 
      });
    } catch (err) {
      console.error('Erreur Data Fetching:', err);
      set({ 
        categories: fallbackCategories,
        fiches: fallbackFiches,
        quizzes: fallbackQuizzes,
        isLoading: false
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
