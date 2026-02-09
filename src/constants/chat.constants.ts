/**
 * Chat Constants
 * Centralized configuration for chat-related features
 */

export const CHAT_CONSTANTS = {
    // SignalR Admin Chat
    ADMIN_USERNAME: 'admin123', // Default admin username for chat

    // Chat AI History
    MAX_AI_HISTORY_MESSAGES: 100,

    // SignalR Connection
    SIGNALR_HUB_URL: 'https://api.newmwayteakwood.vn/hubs/message',
    SIGNALR_MAX_RETRIES: 3,
    SIGNALR_RETRY_DELAYS: [1000, 2000, 10000], // ms

    // Chat Bot AI
    CHATBOT_API_URL: 'https://chatbot.newmwayteakwood.vn',

    // Image Upload
    MAX_IMAGE_QUALITY: 0.8,
    MAX_IMAGE_SELECTION: 0, // 0 = unlimited

    // UI Delays
    AUTO_SCROLL_DELAY: 100, // ms
    AUTO_SCROLL_INITIAL_DELAY: 300, // ms for first load
    TYPING_INDICATOR_MIN_DELAY: 500, // ms
} as const;

export type ChatConstants = typeof CHAT_CONSTANTS;
