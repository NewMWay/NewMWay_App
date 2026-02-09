import { createMMKV } from 'react-native-mmkv';
import { ChatAIProduct } from '../../features/chat/types/ChatAi.type';

export const chatAIStorage = createMMKV({
    id: 'chat-ai-history-storage',
});

const CHAT_AI_HISTORY_KEY = 'chat_ai_history';
const MAX_MESSAGES = 100; // Limit số lượng tin nhắn để tránh quá tải

export interface ChatAIMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    timestampMs: number; // For sorting
    images?: { uri: string; name: string }[];
    products?: ChatAIProduct[];
    imageDescription?: string; // From file upload response
}

class ChatAIHistoryService {
    // Get all chat history
    getHistory(): ChatAIMessage[] {
        try {
            const historyString = chatAIStorage.getString(CHAT_AI_HISTORY_KEY);
            return historyString ? JSON.parse(historyString) : [];
        } catch {
            return [];
        }
    }

    // Save entire chat history
    saveHistory(messages: ChatAIMessage[]): void {
        try {
            // Keep only last MAX_MESSAGES messages
            const limitedMessages = messages.slice(-MAX_MESSAGES);
            chatAIStorage.set(CHAT_AI_HISTORY_KEY, JSON.stringify(limitedMessages));
        } catch {
            // Silent fail
        }
    }

    // Add single message to history
    addMessage(message: ChatAIMessage): void {
        try {
            const history = this.getHistory();
            const newHistory = [...history, message].slice(-MAX_MESSAGES);
            this.saveHistory(newHistory);
        } catch {
            // Silent fail
        }
    }

    // Clear all chat history
    clearHistory(): void {
        try {
            chatAIStorage.set(CHAT_AI_HISTORY_KEY, JSON.stringify([]));
        } catch {
            // Silent fail
        }
    }

    // Get history count
    getMessageCount(): number {
        return this.getHistory().length;
    }

    // Clear messages older than X days (for memory management)
    clearOldMessages(daysToKeep: number = 7): number {
        try {
            const history = this.getHistory();
            const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

            const recentMessages = history.filter(msg => msg.timestampMs > cutoffTime);
            const removedCount = history.length - recentMessages.length;

            if (removedCount > 0) {
                this.saveHistory(recentMessages);
            }

            return removedCount;
        } catch {
            return 0;
        }
    }

    // Get storage size estimate (in KB)
    getStorageSizeKB(): number {
        try {
            const historyString = chatAIStorage.getString(CHAT_AI_HISTORY_KEY);
            if (!historyString) return 0;

            // Estimate size in bytes, then convert to KB
            const sizeInBytes = new Blob([historyString]).size;
            return Math.round(sizeInBytes / 1024);
        } catch {
            return 0;
        }
    }
}

export const chatAIHistoryService = new ChatAIHistoryService();
