# 📝 Profile Integration & SignalR Username Flow

## 🎯 Mục đích

Thay vì chỉ lưu username string trong authStore, giờ app sẽ:

1. ✅ Fetch full profile sau khi login
2. ✅ Lưu profile object (có username, email, fullName, avatar,...)
3. ✅ Dùng username từ profile cho SignalR chat
4. ✅ Clear profile khi logout

---

## 📊 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

1. User Login
   ↓
2. Save accessToken & refreshToken to MMKV
   ↓
3. authStore.login(username, accessToken, refreshToken)
   ↓
4. App.tsx: useProfileQuery() fetches profile
   ↓
5. Profile Response:
   {
     id: "...",
     username: "john_doe",      ← Use this!
     email: "john@example.com",
     fullName: "John Doe",
     avatar: "https://...",
     phone: "+84...",
     ...
   }
   ↓
6. authStore.setUserProfile(profile)
   ↓
7. SignalR uses userProfile.username
```

---

## 🔧 Các thay đổi đã thực hiện

### 1. **AuthStore Enhancement** ([authStore.zustand.ts](src/stores/authStore.zustand.ts))

**Added:**

```typescript
interface AuthState {
  userProfile: GetProfileResponse | null; // ← NEW
  setUserProfile: (profile: GetProfileResponse) => void; // ← NEW
}
```

**Methods:**

- `setUserProfile(profile)` - Save profile to store
- `logout()` - Clear userProfile khi logout
- `forceLogout()` - Clear userProfile khi token expired

### 2. **App.tsx Integration**

**Added useProfileQuery:**

```typescript
import { useProfileQuery } from './src/features/profile/hooks/useProfile.hook';

function AppContent() {
  const userProfile = useAuthStore((state) => state.userProfile);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  // Fetch profile after login
  const { data: profileData, isSuccess } = useProfileQuery();

  // Save to store when fetched
  useEffect(() => {
    if (isSuccess && profileData && isLoggedIn) {
      setUserProfile(profileData);
    }
  }, [isSuccess, profileData, isLoggedIn]);

  // Use profile username for SignalR
  const signalRUser = userProfile ? {
    username: userProfile.username, // ← From profile!
    accessToken: getAuthToken() || '',
    ...
  } : null;
}
```

### 3. **ChatWithAdmin Component**

**Use profile username:**

```typescript
const userProfile = useAuthStore((state) => state.userProfile);
const currentUsername = userProfile?.username || 'user';

// Determine if message is from user or admin
const formattedMessages = signalRMessages.map(msg => ({
  sender: msg.senderUsername === currentUsername ? 'user' : 'admin',
  ...
}));
```

---

## 📂 Files Changed

| File                                                                | Changes                                | Status |
| ------------------------------------------------------------------- | -------------------------------------- | ------ |
| [authStore.zustand.ts](src/stores/authStore.zustand.ts)             | Add userProfile state & setUserProfile | ✅     |
| [App.tsx](App.tsx)                                                  | Add useProfileQuery & save to store    | ✅     |
| [ChatWithAdmin.tsx](src/features/chat/components/ChatWithAdmin.tsx) | Use username from profile              | ✅     |

---

## 🔄 Profile Lifecycle

### **When Login:**

```typescript
// 1. Login API call
POST /api/v1/auth/login
Response: { accessToken, refreshToken }

// 2. Save tokens
setAuthToken(accessToken)
setRefreshAuthToken(refreshToken)

// 3. Login to store
authStore.login(username, accessToken, refreshToken)

// 4. Auto-fetch profile
useProfileQuery() → GET /api/v1/users/profile

// 5. Save profile
authStore.setUserProfile(profile)

// 6. SignalR connects with profile.username
```

### **When Logout:**

```typescript
// 1. User clicks logout
authStore.logout();

// 2. Clear everything
clearAuthToken(); // Remove tokens from MMKV
userProfile = null; // Clear profile
isLoggedIn = false; // Update login state

// 3. SignalR disconnects (no user)
```

### **When Token Expired:**

```typescript
// 1. API call → 401
// 2. Try refresh token
// 3. If refresh fails:
authStore.forceLogout(); // Clear profile + tokens
```

---

## 🎨 Profile Data Structure

```typescript
interface GetProfileResponse {
  id: string;
  username: string; // ← Used for SignalR
  avatar: string | null; // ← Can display in UI
  fullName: string | null; // ← Can display in UI
  email: string;
  phone: string;
  createdDate: string;
  lastModifiedDate: string;
}
```

**Example:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "avatar": "https://api.newmwayteakwood.vn/avatars/john.jpg",
  "fullName": "Nguyễn Văn A",
  "email": "john@example.com",
  "phone": "+84901234567",
  "createdDate": "2024-01-01T00:00:00Z",
  "lastModifiedDate": "2026-01-05T10:30:00Z"
}
```

---

## 🚀 Usage Examples

### **1. Access Username in Any Component**

```typescript
import { useAuthStore } from '@/stores/authStore.zustand';

const MyComponent = () => {
  const userProfile = useAuthStore(state => state.userProfile);

  return <Text>Hello, {userProfile?.username || 'Guest'}!</Text>;
};
```

### **2. Display Avatar**

```typescript
const avatar = userProfile?.avatar || 'https://default-avatar.jpg';

<Image source={{ uri: avatar }} style={styles.avatar} />;
```

### **3. Display Full Name**

```typescript
const displayName = userProfile?.fullName || userProfile?.username || 'User';

<Text>{displayName}</Text>;
```

### **4. Check if Profile Loaded**

```typescript
const isProfileReady = !!userProfile;

if (!isProfileReady) {
  return <ActivityIndicator />;
}
```

---

## 🔒 Security Notes

1. **Profile only fetched when logged in**

   - `useProfileQuery()` has `enabled: true` by default
   - Will only run if accessToken exists

2. **Profile cleared on logout**

   - `logout()` sets `userProfile = null`
   - `forceLogout()` also clears profile

3. **Profile synced with login state**
   - If token expired → profile cleared
   - New login → new profile fetched

---

## 🐛 Debugging

**Check profile in console:**

```typescript
console.log('[App] Profile:', userProfile);
console.log('[ChatWithAdmin] Username:', currentUsername);
```

**Expected logs:**

```
[App] Profile fetched: { username: "john_doe", ... }
[ChatWithAdmin] Current User: john_doe
[ChatWithAdmin] User Profile: { username: "john_doe", ... }
[SignalR] Connected successfully (User: Me)
```

---

## ✅ Benefits

**Before:**

```typescript
// ❌ Only username string
user: 'john_doe';
```

**After:**

```typescript
// ✅ Full profile object
userProfile: {
  username: "john_doe",
  email: "john@example.com",
  fullName: "Nguyễn Văn A",
  avatar: "https://...",
  ...
}
```

**Advantages:**

- ✅ More user information available
- ✅ Can display avatar, full name
- ✅ Single source of truth
- ✅ Automatic cleanup on logout
- ✅ Better type safety with TypeScript

---

## 🎯 Next Steps

**Optional Enhancements:**

- [ ] Cache profile in MMKV for offline access
- [ ] Add profile loading state in UI
- [ ] Profile update → Re-fetch after update
- [ ] Avatar upload → Update profile
- [ ] Display profile in header

---

**Implementation Date:** January 6, 2026  
**Status:** ✅ Complete - Profile integration working
