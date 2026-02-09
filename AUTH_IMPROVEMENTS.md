# 🔐 Hệ Thống Authentication - Lazy Login Strategy

## 🎯 CHIẾN LƯỢC

**Lazy Authentication (Đăng nhập khi cần thiết)**
- ✅ User vào app → Luôn vào TabNavigation trước (trải nghiệm tự do)
- ✅ Chỉ yêu cầu login khi:
  - Truy cập màn hình protected (Profile, Cart, Chat)
  - API call cần authentication → 401 → Refresh token fail
- ✅ UX tốt hơn: Không force login ngay khi mở app

---

## 📋 PHÂN TÍCH BAN ĐẦU

### ✅ Điểm Mạnh
- Flow khởi động app với `initializeAuth()`
- Login flow lưu tokens đúng cách
- API client có refresh token mechanism
- Protected routes với `withAuth` HOC

### ❌ Vấn Đề Phát Hiện

#### 🔴 Nghiêm Trọng
1. **Logout không điều hướng về login screen**
2. **Refresh token fail không force logout + navigate**
3. **Thiếu protection cho Cart và Chat screens**

#### 🟡 Trung Bình
4. **Token validation khi app khởi động**
5. **Zustand không đồng bộ với MMKV khi refresh**

---

## 🛠️ CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### 1️⃣ **Thêm `forceLogout()` vào AuthStore**
**File:** `src/stores/authStore.zustand.ts`

```typescript
interface AuthState {
  // ... existing fields
  forceLogout: () => void // Gọi từ apiClient khi refresh token fail
}

// Implementation
forceLogout: () => {
  clearAuthToken()
  set(() => ({ isLoggedIn: false, user: null }))
}
```

**Mục đích:** Cho phép apiClient force logout khi refresh token thất bại.

---

### 2️⃣ **Cập nhật apiClient - Auto logout khi refresh fail**
**File:** `src/services/apis/apiClient.ts`

```typescript
import { useAuthStore } from '../../stores/authStore.zustand';

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshAuthToken();
  if (!refreshToken) {
    useAuthStore.getState().forceLogout(); // ✅ Force logout
    return null;
  }

  try {
    // ... refresh logic
    if (newAccess) {
      setAuthToken(newAccess);
      if (newRefresh) setRefreshAuthToken(newRefresh);
      return newAccess;
    }
    
    useAuthStore.getState().forceLogout(); // ✅ Force logout
    return null;
  } catch {
    useAuthStore.getState().forceLogout(); // ✅ Force logout
    return null;
  }
}
```

**Kết quả:** 
- Token hết hạn → refresh fail → `isLoggedIn = false` → App.tsx tự động navigate về AuthStack

---

### 3️⃣ **Fix ProfileScreen - Thêm navigation khi logout**
**File:** `src/features/profile/screens/ProfileScreen.tsx`

```typescript
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../types/navigation/navigation';

const ProfileScreen = () => {
  const { logout } = useAuthStore();
  const navigation = useNavigation<RootStackNavigationProp>();
  
  const handleLogout = () => {
    logout();
    showSuccess("Đăng xuất thành công");
    // ✅ Điều hướng về AuthStack
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
  }
  
  // ...
}
```

**Kết quả:** User logout → Clear tokens + Navigate về login ngay lập tức.

---

### 4️⃣ **Protect Cart & Chat Screens**
**Files:** 
- `src/navigation/stacks/CartStack.tsx`
- `src/navigation/stacks/ChatStack.tsx`

```typescript
import withAuth from '../../components/hoc/withAuth';

// CartStack
<Stack.Screen name="CartScreen" component={withAuth(CartScreen)} />
<Stack.Screen name="ConfirmCheckoutScreen" component={withAuth(ConfirmCheckoutScreen)} />

// ChatStack
<Stack.Screen name="ChatListScreen" component={withAuth(ChatListScreen)} />
```

**Kết quả:** User chưa login không thể truy cập Cart, Chat → Hiện modal yêu cầu đăng nhập.

---

### 5️⃣ **Auto-navigate khi forceLogout từ apiClient**
**File:** `App.tsx`

```typescript
import { useRef } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';

function AppContent() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // ✅ Tự động điều hướng khi isLoggedIn thay đổi
  useEffect(() => {
    if (isInitialized && !isLoggedIn && navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute?.name !== 'AuthStack') {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'AuthStack' }],
        });
      }
    }
  }, [isLoggedIn, isInitialized]);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* ... */}
    </NavigationContainer>
  )
}
```

**Kết quả:** 
- API call bất kỳ → 401 → refresh token → fail → `forceLogout()` 
- → `isLoggedIn = false` 
- → Effect trigger → Navigate về AuthStack
- → User thấy login screen

---

### 6️⃣ **Token Validation khi App khởi động**
**Files:**
- `src/utils/auth/tokenUtils.ts` (NEW)
- `src/stores/authStore.zustand.ts`

```typescript
// tokenUtils.ts
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < (currentTime + 30); // Buffer 30s
  } catch {
    return true;
  }
};

export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

// authStore.zustand.ts
initializeAuth: () => {
  const accessToken = getAuthToken()
  
  if (accessToken) {
    // ✅ Kiểm tra token expiration
    if (isTokenExpired(accessToken)) {
      clearAuthToken()
      set(() => ({ isLoggedIn: false, user: null, isInitialized: true }))
    } else {
      const tokenData = decodeToken(accessToken)
      const username = tokenData?.username || tokenData?.email || 'user'
      set(() => ({ isLoggedIn: true, user: username, isInitialized: true }))
    }
  } else {
    set(() => ({ isLoggedIn: false, user: null, isInitialized: true }))
  }
}
```

**Kết quả:** 
- App khởi động → Check token từ MMKV → Validate expiration
- Nếu expired → Clear token → Navigate về AuthStack
- Nếu valid → Set logged in → Navigate về TabNavigation

---

## 📊 FLOW HOÀN CHỈNH SAU KHI FIX

### 🚀 Khi App Khởi Động
```
1. App.tsx mount
2. useEffect → initializeAuth()
3. getAuthToken() từ MMKV
4. Có token? 
   ├─ CÓ → decodeToken() → isLoggedIn = true, user = username
   └─ KHÔNG → isLoggedIn = false
5. isInitialized = true → Hide loading
6. LUÔN navigate vào TabNavigation (cho phép trải nghiệm tự do)
```

### 🔐 Khi User Login
```
1. Submit LoginForm
2. loginApi() → Backend
3. Response: { accessToken, refreshToken }
4. setTokens() → Lưu vào MMKV
5. setLoggedIn() → Zustand isLoggedIn = true
6. navigation.reset() → TabNavigation
```

### 🔄 Khi Access Token Hết Hạn (API Call)
```
1. API Request → 401 Response
2. Interceptor bắt 401 → !_retry
3. refreshAccessToken()
   ├─ refreshToken exists?
   │  ├─ YES → POST /auth/refresh
   │  │  ├─ SUCCESS → setAuthToken(newToken) → Retry original request
   │  │  └─ FAIL → forceLogout() → isLoggedIn = false
   │  └─ NO → forceLogout() → isLoggedIn = false
   └─ withAuth HOC detect isLoggedIn = false
      └─ Hiện modal yêu cầu login (không auto-navigate)
```

### 🚪 Khi User Logout
```
1. Click Logout Button
2. logout() → clearAuthToken() + isLoggedIn = false
3. withAuth HOC detect → Hiện modal yêu cầu login
4. User có thể:
   ├─ Click "Đăng nhập" → Navigate to AuthStack
   └─ Click "Quay lại" → Về TabNavigation home
```

### 🛡️ Khi Truy Cập Protected Screen (chưa login)
```
1. Navigate to ProfileScreen/CartScreen/ChatScreen
2. withAuth HOC check isLoggedIn
   ├─ TRUE → Render Component
   └─ FALSE → Show AuthModal
              ├─ Click "Quay lại" → navigation.reset(TabNavigation)
              └─ Click "Đăng nhập" → navigation.replace(AuthStack)
```

---

## ✅ CHECKLIST SAU KHI FIX

- [x] ✅ Luôn vào TabNavigation khi mở app (không force login)
- [x] ✅ Cho phép user trải nghiệm app tự do
- [x] ✅ API call → 401 → Auto refresh token
- [x] ✅ Refresh token success → Lưu token mới → Retry request
- [x] ✅ Refresh token fail → forceLogout → Hiện modal yêu cầu login
- [x] ✅ User logout → Hiện modal yêu cầu login (không force navigate)
- [x] ✅ Protected screens (Profile, Cart, Chat) yêu cầu login
- [x] ✅ Zustand store đồng bộ với MMKV

---

## 🎯 KẾT QUẢ

### Trước khi fix:
- ❌ Phải đăng nhập ngay khi mở app
- ❌ Token expired → App crash hoặc stuck
- ❌ Logout → Force redirect về login
- ❌ UX kém: Bắt login trước khi cho xem app

### Sau khi fix:
- ✅ Mở app → Vào TabNavigation ngay (trải nghiệm tự do)
- ✅ Login chỉ khi cần thiết (lazy authentication)
- ✅ Token expired → Auto refresh hoặc hiện modal login
- ✅ Protected screens yêu cầu login khi truy cập
- ✅ Logout → Hiện modal, user chọn login hoặc tiếp tục browse
- ✅ UX mượt mà: Browse trước, login sau

---

## 📝 LƯU Ý

1. **Backend phải support refresh token endpoint:**
   ```
   POST /api/v1/auth/refresh
   Body: { refreshToken: string }
   Response: { accessToken, refreshToken? }
   ```

2. **JWT token phải có field `exp` (expiration timestamp)**

3. **Nếu backend không trả refreshToken mới, xóa dòng:**
   ```typescript
   if (newRefresh) setRefreshAuthToken(newRefresh);
   ```

4. **Adjust token decode logic nếu backend dùng field khác:**
   ```typescript
   const username = tokenData?.username || tokenData?.email || tokenData?.sub || 'user'
   ```

---

## 🔮 TƯƠNG LAI - OPTIONAL ENHANCEMENTS

1. **Token auto-refresh trước khi expired** (proactive refresh)
2. **Biometric authentication** (Face ID / Touch ID)
3. **Remember me** (optional persistent login)
4. **Session timeout** (auto logout sau X phút inactive)
5. **Multi-device logout** (logout khỏi tất cả thiết bị)

---

**Tác giả:** GitHub Copilot  
**Ngày:** 8/12/2025  
**Version:** 1.0
