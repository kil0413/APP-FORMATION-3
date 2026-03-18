import { create } from 'zustand';

export const useProgressStore = create((set) => ({
  progress: {},
  markCompleted: (id, type, pct) => set((state) => ({
    progress: {
      ...state.progress,
      [`${type}_${id}`]: pct
    }
  })),
  isCompleted: (id, type) => (state) => state.progress[`${type}_${id}`] === 100,
}));
