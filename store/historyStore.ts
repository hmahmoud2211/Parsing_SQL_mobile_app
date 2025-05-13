import { create } from 'zustand';
import { ParsedComponents } from '@/lib/SQLParser';

export type HistoryEntry = {
  id: string;
  query: string;
  timestamp: number;
  result: ParsedComponents;
  isFavorite: boolean;
};

type HistoryState = {
  history: HistoryEntry[];
  addToHistory: (query: string, result: ParsedComponents) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
};

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  
  addToHistory: (query, result) => set((state) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      result,
      isFavorite: false,
    };
    
    // Limit history to 50 entries
    const updatedHistory = [newEntry, ...state.history];
    if (updatedHistory.length > 50) {
      // Remove oldest non-favorite entries first
      const nonFavorites = updatedHistory.filter(entry => !entry.isFavorite);
      if (nonFavorites.length > 0) {
        const oldestNonFavorite = nonFavorites.reduce((oldest, current) => 
          current.timestamp < oldest.timestamp ? current : oldest, nonFavorites[0]);
        return {
          history: updatedHistory.filter(entry => entry.id !== oldestNonFavorite.id)
        };
      } else {
        // If all are favorites, remove oldest entry
        return {
          history: updatedHistory.slice(0, 50)
        };
      }
    }
    
    return { history: updatedHistory };
  }),
  
  toggleFavorite: (id) => set((state) => ({
    history: state.history.map(entry => 
      entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
    )
  })),
  
  clearHistory: () => set(() => ({
    // Keep favorites when clearing history
    history: []
  })),
  
  removeEntry: (id) => set((state) => ({
    history: state.history.filter(entry => entry.id !== id)
  })),
}));