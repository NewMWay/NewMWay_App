import * as signalR from '@microsoft/signalr';
import { MessageTypeEnum } from '../../features/chat/types/ChatAdmin.type';

// --- Message Types ---

export type NewMessageResponse = {
    id: string;
    senderUsername: string;
    recipientUsername: string;
    content: string;
    dateRead: Date | null;
    messageSent: Date;
    type: number;
};

// --- SignalR State Types ---

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export type SignalRState = {
    connection: signalR.HubConnection | null;
    connectionId: string | null;
    status: ConnectionStatus;
    messages: NewMessageResponse[];
};

// --- SignalR Actions ---

export type SignalRAction =
    | { type: 'SET_CONNECTION'; payload: signalR.HubConnection | null }
    | { type: 'SET_CONNECTION_ID'; payload: string | null }
    | { type: 'SET_STATUS'; payload: ConnectionStatus }
    | { type: 'ADD_MESSAGE'; payload: NewMessageResponse }
    | { type: 'SET_MESSAGES'; payload: NewMessageResponse[] }
    | { type: 'RESET' };

// --- Context Type ---

export type SignalRContextType = SignalRState & {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    sendMessage: (recipientUsername: string, content: string, type: MessageTypeEnum) => Promise<void>;
};

// --- User Type (minimal, adapt from your auth store) ---

export type SignalRUser = {
    username: string;
    accessToken: string;
    refreshToken?: string;
    role?: string;
};
