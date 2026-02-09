# 🚀 SignalR Real-time Chat Implementation

## 📦 Installation

```bash
npm install @microsoft/signalr
# or
yarn add @microsoft/signalr
```

## 📁 File Structure

```
src/
├── services/
│   └── signalr/
│       ├── SignalRProvider.tsx    # Context & Provider
│       └── types.ts                # TypeScript types
│
└── features/
    └── chat/
        ├── components/
        │   ├── ChatWithAdmin.tsx          # Chat UI
        │   └── ConnectionStatusBadge.tsx  # Status indicator
        └── screens/
            └── ChatListScreen.tsx         # Main chat screen
```

## 🎯 Features Implemented

### ✅ Phase 1: Core Setup

- [x] Install `@microsoft/signalr`
- [x] Create SignalR types and interfaces
- [x] Implement SignalRProvider with connection management
- [x] Export `useSignalR()` hook
- [x] Wrap App with SignalRProvider
- [x] Integrate into ChatWithAdmin component
- [x] Add connection status indicator UI

## 🔧 How It Works

### 1. **SignalRProvider Setup**

The provider wraps the entire app in `App.tsx`:

```tsx
import { SignalRProvider } from './src/services/signalr/SignalRProvider';

<SignalRProvider user={signalRUser}>
  <NavigationContainer>{/* Your app content */}</NavigationContainer>
</SignalRProvider>;
```

**User object format:**

```typescript
{
  username: string;
  accessToken: string;
  refreshToken?: string;
  role?: 'User' | 'Admin';
}
```

### 2. **Connection Lifecycle**

```typescript
// Auto-connect when user logs in
useEffect(() => {
  if (user?.accessToken) {
    connect();
  }
  return () => disconnect();
}, [user?.accessToken, username]);
```

**Connection states:**

- `connecting` - Đang kết nối
- `connected` - Đã kết nối thành công
- `disconnected` - Chưa kết nối
- `error` - Lỗi kết nối

### 3. **Sending Messages**

```tsx
import { useSignalR } from '@/services/signalr/SignalRProvider';

const { sendMessage, status } = useSignalR();

const handleSend = async () => {
  if (status === 'connected') {
    await sendMessage('admin', 'Hello!');
  }
};
```

### 4. **Receiving Messages**

Two events are handled:

**ReceiveMessageThread** - Initial message history:

```typescript
newConnection.on('ReceiveMessageThread', messages => {
  // Load all previous messages
  dispatch({ type: 'SET_MESSAGES', payload: messages });
});
```

**NewMessage** - Real-time new messages:

```typescript
newConnection.on('NewMessage', message => {
  // Add new message to list
  dispatch({ type: 'ADD_MESSAGE', payload: message });
});
```

### 5. **Auto-reconnection**

Built-in retry logic:

```typescript
.withAutomaticReconnect([0, 2000, 10000, 30000])
```

Attempts to reconnect at: 0s, 2s, 10s, 30s intervals.

### 6. **Token Refresh**

Automatically refreshes expired tokens:

```typescript
if (err.message.includes('401')) {
  const newToken = await refreshAccessToken();
  if (newToken) {
    return connect(newToken);
  }
}
```

## 🎨 UI Components

### ConnectionStatusBadge

Shows real-time connection status:

```tsx
import ConnectionStatusBadge from '@/features/chat/components/ConnectionStatusBadge';

<ConnectionStatusBadge />;
```

**Visual states:**

- 🟢 **Connected**: "Đã kết nối" (green badge)
- 🟡 **Connecting**: "Đang kết nối..." (spinner)
- 🔴 **Error**: "⚠️ Lỗi kết nối" (red badge)
- ⚪ **Disconnected**: "● Chưa kết nối" (gray badge)

### ChatWithAdmin

Real-time chat interface:

```tsx
<ChatWithAdmin showWelcome={false} onStartChat={() => {}} />
```

**Features:**

- ✅ Real-time message sync
- ✅ Auto-scroll to latest message
- ✅ Send text messages via SignalR
- ✅ Display message timestamps
- ✅ Handle connection errors

## 🔐 Authentication Flow

```
1. User logs in → accessToken stored in MMKV
2. App.tsx reads token → Creates signalRUser object
3. SignalRProvider receives user → Initiates connection
4. HubConnection uses accessTokenFactory
5. If 401 → Refresh token → Retry connection
6. If refresh fails → Disconnect
```

## 🌐 API Endpoints

**Hub URL:**

```
wss://api.newmwayteakwood.vn/hubs/message
```

**Customer connection:**

```
wss://api.newmwayteakwood.vn/hubs/message
```

**Admin connection (to specific user):**

```
wss://api.newmwayteakwood.vn/hubs/message?user=username
```

**Token refresh:**

```
POST https://api.newmwayteakwood.vn/api/v1/auth/refresh-tokens
Body: { refreshToken: string }
```

## 📱 Usage Example

```tsx
import React from 'react';
import { View, Button, Text } from 'react-native';
import { useSignalR } from '@/services/signalr/SignalRProvider';

const ChatScreen = () => {
  const { messages, status, sendMessage } = useSignalR();

  const handleSend = async () => {
    try {
      await sendMessage('admin', 'Xin chào!');
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return (
    <View>
      <Text>Status: {status}</Text>
      <Text>Messages: {messages.length}</Text>
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};
```

## 🐛 Debugging

Enable SignalR logs:

```typescript
.configureLogging(signalR.LogLevel.Debug) // Change from Warning
```

**Console logs to watch:**

```
[SignalR] Connected successfully
[SignalR] Received message thread: X messages
[SignalR] Received new message: id
[SignalR] Sending message to: admin
[SignalR] 401 error, attempting token refresh...
[SignalR] Token refreshed successfully
```

## ⚠️ Important Notes

1. **Connection only when logged in**: SignalR connects only when `user.accessToken` exists
2. **Auto-cleanup**: Connection closes when component unmounts
3. **Duplicate prevention**: Messages with same `id` are not added twice
4. **Admin mode**: Include `username` prop for admin chatting with specific user
5. **Query invalidation**: Admin connections invalidate `lastMessageChat` cache

## 🔄 Message Flow Diagram

```
┌─────────┐                  ┌──────────┐                  ┌─────────┐
│  User   │                  │  SignalR │                  │  Admin  │
│ (React  │                  │   Hub    │                  │ (React  │
│ Native) │                  │  Server  │                  │  Web)   │
└────┬────┘                  └─────┬────┘                  └────┬────┘
     │                             │                             │
     │  1. Connect (token)         │                             │
     ├────────────────────────────>│                             │
     │                             │                             │
     │  2. ReceiveMessageThread    │                             │
     │<────────────────────────────┤                             │
     │                             │                             │
     │  3. SendMessage('admin','Hi')│                            │
     ├────────────────────────────>│                             │
     │                             │                             │
     │                             │  4. NewMessage (broadcast)  │
     │                             ├────────────────────────────>│
     │                             │                             │
     │  5. NewMessage (echo)       │                             │
     │<────────────────────────────┤                             │
     │                             │                             │
```

## 📊 State Management

```typescript
type SignalRState = {
  connection: HubConnection | null;
  connectionId: string | null;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  messages: NewMessageResponse[];
};
```

**Actions:**

- `SET_CONNECTION` - Set HubConnection instance
- `SET_CONNECTION_ID` - Set connection ID
- `SET_STATUS` - Update connection status
- `ADD_MESSAGE` - Add single new message (real-time)
- `SET_MESSAGES` - Replace all messages (history)
- `RESET` - Clear all state (disconnect)

## 🎯 Next Steps (Future Enhancements)

- [ ] Image upload support
- [ ] Typing indicator broadcast
- [ ] Message read receipts
- [ ] Push notifications
- [ ] Message search/filter
- [ ] Offline message queue
- [ ] Message pagination
- [ ] File attachments
- [ ] Audio messages
- [ ] Admin conversation list

## 🤝 Support

For issues or questions:

1. Check SignalR console logs
2. Verify token is valid
3. Check network connectivity
4. Ensure backend hub is running
5. Test with Postman/REST client first

---

**Implementation Date:** January 5, 2026  
**Status:** ✅ Phase 1 Complete - Basic real-time chat working
