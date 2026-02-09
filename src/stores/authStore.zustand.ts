import { create } from 'zustand'
import { clearAuthToken, setAuthToken, setRefreshAuthToken, getAuthToken } from '../services/stores/authStore.mmkv'
import { decodeToken } from '../utils/auth/tokenUtils'
import { GetProfileResponse } from '../features/profile/types/profile.type'

interface AuthState {
    isLoggedIn: boolean
    user: string | null // Keep for backward compatibility
    userProfile: GetProfileResponse | null // Full profile data
    isInitialized: boolean
    // login can optionally receive tokens to persist
    login: (user: string, accessToken?: string, refreshToken?: string) => void
    setUserProfile: (profile: GetProfileResponse) => void
    logout: () => void
    forceLogout: () => void // Gọi từ apiClient khi refresh token fail
    initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    user: null,
    userProfile: null,
    isInitialized: false,
    login: (user: string, accessToken?: string, refreshToken?: string) => {
        // persist tokens if provided
        if (accessToken) setAuthToken(accessToken)
        if (refreshToken) setRefreshAuthToken(refreshToken)
        set(() => ({ isLoggedIn: true, user }))
    },
    setUserProfile: (profile: GetProfileResponse) => {
        set(() => ({
            userProfile: profile,
            user: profile.username,
            isLoggedIn: true,
        }))
    },
    logout: () => {
        clearAuthToken()
        set(() => ({
            isLoggedIn: false,
            user: null,
            userProfile: null,
        }))
    },
    forceLogout: () => {
        // Được gọi từ apiClient khi refresh token fail
        clearAuthToken()
        set(() => ({
            isLoggedIn: false,
            user: null,
            userProfile: null,
        }))
    },
    initializeAuth: () => {
        const accessToken = getAuthToken()

        if (accessToken) {
            // Không validate expiration ở đây - để API interceptor xử lý
            // Chỉ cần check có token không để set isLoggedIn
            const tokenData = decodeToken(accessToken)
            const username = tokenData?.username || tokenData?.email || 'user'

            set(() => ({
                isLoggedIn: true,
                user: username,
                isInitialized: true
            }))
        } else {
            set(() => ({
                isLoggedIn: false,
                user: null,
                userProfile: null,
                isInitialized: true
            }))
        }
    }
}))