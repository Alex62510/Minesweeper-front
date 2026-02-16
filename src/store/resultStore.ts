import { create } from 'zustand';
import { GamesApi } from '../api/games.api.ts';

export type GameResult = {
  id: number;
  userId: number;
  email: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  time: number;
  createdAt: string;
  name: string;
};

type ResultsState = {
  results: GameResult[];
  loading: boolean;
  error: string | null;

  fetchResults: () => Promise<void>;
  addResult: (result: GameResult) => void;
  clearResults: () => void;
};

export const useResultsStore = create<ResultsState>((set) => ({
  results: [],
  loading: false,
  error: null,

  fetchResults: async () => {
    try {
      const data = await GamesApi.getResults();
      set({ results: data });
    } catch (e) {
      console.error('Fetch results error', e);
    }
  },

  addResult: (result) =>
    set((state) => ({
      results: [...state.results, result].sort((a, b) => a.time - b.time),
    })),

  clearResults: () => set({ results: [] }),
}));
