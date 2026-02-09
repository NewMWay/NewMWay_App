import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'search-history-storage',
});

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

class SearchHistoryService {
  // Get all search history
  getHistory(): SearchHistoryItem[] {
    try {
      const historyString = storage.getString(SEARCH_HISTORY_KEY);
      return historyString ? JSON.parse(historyString) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  // Add new search query to history
  addToHistory(query: string): void {
    if (!query.trim()) return;

    try {
      const history = this.getHistory();
      
      // Remove duplicates (case-insensitive)
      const filteredHistory = history.filter(
        item => item.query.toLowerCase() !== query.toLowerCase()
      );

      // Add new query at the beginning
      const newHistory: SearchHistoryItem[] = [
        { query: query.trim(), timestamp: Date.now() },
        ...filteredHistory,
      ].slice(0, MAX_HISTORY_ITEMS); // Keep only MAX_HISTORY_ITEMS items

      storage.set(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  }

  // Remove specific item from history
  removeFromHistory(query: string): void {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(
        item => item.query !== query
      );
      storage.set(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  }

  // Clear all search history
  clearHistory(): void {
    try {
      storage.set(SEARCH_HISTORY_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  // Get search suggestions based on current query
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return [];

    try {
      const history = this.getHistory();
      const lowerQuery = query.toLowerCase();
      
      return history
        .filter(item => item.query.toLowerCase().includes(lowerQuery))
        .slice(0, limit)
        .map(item => item.query);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }
}

export const searchHistoryService = new SearchHistoryService();
