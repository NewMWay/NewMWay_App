import React, { createContext, useContext, useEffect, useReducer, useRef, ReactNode } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import {
    SignalRState,
    SignalRAction,
    SignalRContextType,
    NewMessageResponse,
    SignalRUser,
} from './types';
import { getAuthToken, getRefreshAuthToken, setAuthToken, setRefreshAuthToken } from '../stores/authStore.mmkv';
import { MessageTypeEnum } from '../../features/chat/types/ChatAdmin.type';

// --- Reducer ---

const initialState: SignalRState = {
    connection: null,
    connectionId: null,
    status: 'disconnected',
    messages: [],
};

function signalRReducer(state: SignalRState, action: SignalRAction): SignalRState {
    switch (action.type) {
        case 'SET_CONNECTION':
            return { ...state, connection: action.payload };
        case 'SET_CONNECTION_ID':
            return { ...state, connectionId: action.payload };
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'ADD_MESSAGE': {
            // Prevent duplicate messages
            const exists = state.messages.some((msg) => msg.id === action.payload.id);
            if (exists) {
                return state;
            }
            return { ...state, messages: [...state.messages, action.payload] };
        }
        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

// --- Context ---

const SignalRContext = createContext<SignalRContextType | null>(null);

// --- Hook ---

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
};

// --- Provider Props ---

interface SignalRProviderProps {
    children: ReactNode;
    user: SignalRUser | null;
    username?: string | null; // For admin connecting to specific user
}

// --- Provider Component ---

export const SignalRProvider: React.FC<SignalRProviderProps> = ({
    children,
    user,
    username,
}) => {
    const queryClient = useQueryClient();
    const [state, dispatch] = useReducer(signalRReducer, initialState);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const activeUsernameRef = useRef<string | null | undefined>(undefined);
    const retryCountRef = useRef(0);
    const maxRetries = 3;

    const API_BASE_URL = 'https://api.newmwayteakwood.vn';
    const HUB_URL = `${API_BASE_URL}/hubs/message`;

    // Refresh access token
    const refreshAccessToken = async (): Promise<string | null> => {
        const refreshToken = getRefreshAuthToken();
        if (!refreshToken) {
            console.log('[SignalR] No refresh token available');
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            const newAccessToken = data.data?.accessToken;
            const newRefreshToken = data.data?.refreshToken;

            if (newAccessToken) {
                setAuthToken(newAccessToken);
                if (newRefreshToken) {
                    setRefreshAuthToken(newRefreshToken);
                }
                console.log('[SignalR] Token refreshed successfully');
                return newAccessToken;
            }

            return null;
        } catch (error) {
            console.error('[SignalR] Token refresh failed:', error);
            return null;
        }
    };

    // Disconnect function
    const disconnect = async () => {
        if (connectionRef.current) {
            try {
                console.log('[SignalR] Stopping connection...');
                await connectionRef.current.stop();
                dispatch({ type: 'RESET' });
                connectionRef.current = null;
            } catch (err) {
                console.error('[SignalR] Error stopping connection:', err);
            }
        }
    };

    // Connect function
    const connect = async (token?: string, isRetry: boolean = false) => {
        // If already connected to same user, skip
        if (
            connectionRef.current?.state === signalR.HubConnectionState.Connected &&
            activeUsernameRef.current === username
        ) {
            console.log('[SignalR] Already connected to same user');
            retryCountRef.current = 0; // Reset retry count
            return;
        }

        if (!user) {
            console.log('[SignalR] No user available');
            return;
        }

        // Check retry limit
        if (isRetry && retryCountRef.current >= maxRetries) {
            console.error('[SignalR] Max retry attempts reached');
            dispatch({ type: 'SET_STATUS', payload: 'error' });
            retryCountRef.current = 0;
            return;
        }

        if (isRetry) {
            retryCountRef.current++;
            console.log(`[SignalR] Retry attempt ${retryCountRef.current}/${maxRetries}`);
        }

        // Ensure previous connection is stopped
        await disconnect();

        const accessToken = token || user.accessToken || getAuthToken();
        if (!accessToken) {
            console.log('[SignalR] No access token available');
            dispatch({ type: 'SET_STATUS', payload: 'disconnected' });
            return;
        }

        dispatch({ type: 'SET_STATUS', payload: 'connecting' });
        activeUsernameRef.current = username;

        let hubUrl = HUB_URL;
        const options: signalR.IHttpConnectionOptions = {
            transport: signalR.HttpTransportType.WebSockets,
            skipNegotiation: true,
            accessTokenFactory: () => accessToken,
        };

        // Admin logic: Connect to specific user channel
        if (user.role === 'Admin' && username) {
            hubUrl += `?user=${username}`;
            console.log(`[SignalR] Admin connecting to user: ${username}`);
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, options)
            .configureLogging(signalR.LogLevel.Warning)
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();

        // Event: Receive message thread (history)
        newConnection.on('ReceiveMessageThread', (messageThread: NewMessageResponse[]) => {
            console.log('[SignalR] Received message thread:', messageThread.length, 'messages');
            dispatch({ type: 'SET_MESSAGES', payload: messageThread });
        });

        // Event: New message
        newConnection.on('NewMessage', (message: NewMessageResponse) => {
            console.log('[SignalR] Received new message:', message.id);
            dispatch({ type: 'ADD_MESSAGE', payload: message });

            // Admin: Invalidate last messages cache
            if (user?.role === 'Admin') {
                queryClient.invalidateQueries({ queryKey: ['lastMessageChat'] });
            }
        });

        // Event: Connection closed
        newConnection.onclose(() => {
            console.log('[SignalR] Connection closed');
            dispatch({ type: 'SET_STATUS', payload: 'disconnected' });
            connectionRef.current = null;
        });

        // Event: Reconnecting
        newConnection.onreconnecting(() => {
            console.log('[SignalR] Reconnecting...');
            dispatch({ type: 'SET_STATUS', payload: 'connecting' });
        });

        // Event: Reconnected
        newConnection.onreconnected((connectionId) => {
            console.log('[SignalR] Reconnected:', connectionId);
            dispatch({ type: 'SET_CONNECTION_ID', payload: connectionId || null });
            dispatch({ type: 'SET_STATUS', payload: 'connected' });
        });

        try {
            await newConnection.start();
            console.log(`[SignalR] Connected successfully (User: ${username || 'Me'})`);

            connectionRef.current = newConnection;
            dispatch({ type: 'SET_CONNECTION', payload: newConnection });
            dispatch({ type: 'SET_CONNECTION_ID', payload: newConnection.connectionId || null });
            dispatch({ type: 'SET_STATUS', payload: 'connected' });
            retryCountRef.current = 0; // Reset retry count on success
        } catch (err: any) {
            console.error('[SignalR] Connection error:', err);
            const errorMessage = err?.message || '';

            // Handle 401 Unauthorized - try token refresh
            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                console.log('[SignalR] 401 error, attempting token refresh...');
                const newToken = await refreshAccessToken();
                if (newToken) {
                    return connect(newToken, false); // Don't count as retry
                }
            }
            // Handle WebSocket connection failures
            else if (errorMessage.includes('WebSocket') || errorMessage.includes('Failed to start')) {
                console.log('[SignalR] WebSocket error, will retry...');
                dispatch({ type: 'SET_STATUS', payload: 'error' });

                // Retry after delay
                if (retryCountRef.current < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
                    console.log(`[SignalR] Retrying in ${delay}ms...`);
                    setTimeout(() => {
                        connect(undefined, true);
                    }, delay);
                } else {
                    console.error('[SignalR] Connection failed after max retries');
                }
            } else {
                // Other errors
                console.error('[SignalR] Unknown error:', errorMessage);
                dispatch({ type: 'SET_STATUS', payload: 'error' });
            }
        }
    };

    // Send message function
    const sendMessage = async (recipientUsername: string, content: string, type: MessageTypeEnum) => {
        if (state.connection && state.status === 'connected') {
            try {
                console.log('[SignalR] Sending message to:', recipientUsername, content, type);
                await state.connection.invoke('SendMessage', { recipientUsername, content, type });
            } catch (err) {
                console.error('[SignalR] SendMessage error:', err);
                throw err;
            }
        } else {
            console.warn('[SignalR] Cannot send message - not connected');
            throw new Error('Not connected to SignalR');
        }
    };

    // Effect: Connect when user changes
    useEffect(() => {
        if (user?.accessToken) {
            connect();
        }

        // Cleanup on unmount or when username changes
        return () => {
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.accessToken, username]);

    return (
        <SignalRContext.Provider value={{ ...state, connect, disconnect, sendMessage }}>
            {children}
        </SignalRContext.Provider>
    );
};
