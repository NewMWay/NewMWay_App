import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({
    id: 'authStore',
})

export const setAuthToken = (accessToken: string) => {
    storage.set('accessToken', accessToken)
}

export const getAuthToken = (): string | undefined => {
    return storage.getString('accessToken') || undefined
}

export const setRefreshAuthToken = (refreshToken: string) => {
    storage.set('refreshToken', refreshToken)
}

export const getRefreshAuthToken = (): string | undefined => {
    return storage.getString('refreshToken') || undefined
}

export const clearAuthToken = () => {
    storage.clearAll()
}

export const setTokens = (accessToken: string, refreshToken?: string) => {
    setAuthToken(accessToken)
    if (refreshToken) setRefreshAuthToken(refreshToken)
}