import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { getAuthToken, getRefreshAuthToken, setAuthToken, setRefreshAuthToken } from '../stores/authStore.mmkv';
import { useAuthStore } from '../../stores/authStore.zustand';
import Toast from 'react-native-toast-message';


// Định nghĩa tyoe cho API response
export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Định nghĩa type cho API request config
interface ApiRequestConfig<T = any> extends AxiosRequestConfig {
    url: string;
    method?: Method;
    data?: T | FormData; // Dữ liệu có thể là object hoặc FormData
    params?: any;
    accessToken?: string;
    contentType?: 'application/json' | 'multipart/form-data';
}

// Đinh nghĩa type cho API error
interface ApiError {
    message: string;
    status?: number;
    response?: any;
    request?: any;
}

// Cấu hình mặc định cho rootApi
const rootApi: AxiosInstance = axios.create({
    baseURL: 'https://api.newmwayteakwood.vn/api/v1/',
    timeout: 10000,
    paramsSerializer: {
        // This will serialize arrays with repeated keys instead of using bracket notation
        indexes: null  // This makes Axios use the format: ?tags=value1&tags=value2
    }
})

// --- Refresh token helpers & instance ---
// separate instance for refresh calls to avoid interceptor loops
const refreshInstance = axios.create({
    baseURL: rootApi.defaults.baseURL,
    timeout: 10000,
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const REFRESH_URL = 'auth/refresh-tokens';

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshAuthToken();
    if (!refreshToken) {
        // Không có refresh token -> force logout
        useAuthStore.getState().forceLogout();
        return null;
    }

    try {
        const resp = await refreshInstance.post(REFRESH_URL, { refreshToken });
        console.log('Refresh token response:', resp.data);

        // Adjust below depending on your API response shape
        const payload = resp.data?.data || resp.data;
        const newAccess = payload?.accessToken || payload?.access_token || payload?.token;
        const newRefresh = payload?.refreshToken || payload?.refresh_token;

        if (newAccess) {
            setAuthToken(newAccess);
            if (newRefresh) setRefreshAuthToken(newRefresh);
            return newAccess;
        }

        // Không có token mới -> force logout
        useAuthStore.getState().forceLogout();
        return null;
    } catch {
        // refresh failed -> clear stored tokens và force logout
        useAuthStore.getState().forceLogout();
        return null;
    }
}

// === RESPONSE INTERCEPTOR: try refresh on 401 and retry original request once ===
rootApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status; // FIX: Lấy status từ error.response

        if (status === 401 && error.message.includes('401') && !originalRequest?._retry) {
            console.log('401 detected, attempting token refresh...');

            (originalRequest as any)._retry = true;

            if (!isRefreshing) {
                console.log("Starting token refresh...");

                isRefreshing = true;
                refreshPromise = refreshAccessToken();
            }

            const newToken = await refreshPromise;
            isRefreshing = false;
            refreshPromise = null;

            if (newToken) {
                console.log('Token refreshed successfully, retrying original request...');
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return rootApi(originalRequest);
            } else {
                console.log('Token refresh failed, rejecting request');
                Toast.show({
                    type: 'error',
                    text1: 'Phiên đăng nhập đã hết hạn',
                    text2: 'Vui lòng đăng nhập lại',
                    visibilityTime: 3000,
                });
                // Đánh dấu error này là token expired để không show duplicate toast
                (error as any).isTokenExpired = true;
            }
        }

        return Promise.reject(error);
    }
);

// === REQUEST INTERCEPTOR (Lấy Token từ Zustand Store/MMKV) ===
rootApi.interceptors.request.use(
    (config) => {
        // Lấy Token ĐỒNG BỘ từ Store/MMKV
        const accessToken = getAuthToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Hàm tiện ích gọi API 
const apiClient = async <TResponse, TRequest = any>({
    url,
    method = 'GET',
    data,
    params,
    accessToken: _accessToken,
    contentType = 'application/json',
    ...rest
}: ApiRequestConfig<TRequest>): Promise<TResponse> => {
    try {
        // Thiết lập headers (Authorization sẽ được handle bởi interceptor)
        const headers: Record<string, string> = {
            'Content-Type': contentType,
        };

        // Merge headers từ rest parameters
        if (rest.headers) {
            Object.assign(headers, rest.headers);
        }

        // Xử lý dữ liệu cho multipart/form-data
        let requestData = data;
        if (contentType === 'multipart/form-data') {
            if (data instanceof FormData) {
                // Nếu data đã là FormData, sử dụng trực tiếp
                requestData = data;
                // Xóa Content-Type để axios tự động set boundary
                delete headers['Content-Type'];
            } else if (data) {
                // Nếu data là object, tạo FormData mới
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                requestData = formData;
                delete headers['Content-Type'];
            }
        }
        const response: AxiosResponse<ApiResponse<TResponse>> = await rootApi({
            url,
            method,
            data: requestData,
            params,
            headers,
            ...rest,
        });

        // if (!response.data || !response.data.success) {
        //     throw new Error(response.data?.message || 'Invalid response structure');
        // }
        return response.data.data;
    } catch (error: any) {
        let message = 'Unknown error occurred';
        const errorData = error.response?.data;

        if (errorData?.data) {
            if (typeof errorData.data === 'object') {
                // Nếu data là object, gom lỗi theo từng key
                message = Object.entries(errorData.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
            } else if (typeof errorData.data === 'string') {
                // Nếu data là string, dùng trực tiếp
                message = errorData.data;
            }
        } else if (errorData?.message) {
            message = errorData.message;
        } else {
            message = error.message || message;
        }

        const errorDetails: ApiError = {
            message,
            status: error.response?.status,
            response: error.response?.data,
            request: { url, method, data, params },
        };

        console.log(`API Error [${url}]:`, errorDetails);
        
        // Nếu là lỗi token expired, không throw để tránh duplicate toast
        if ((error as any).isTokenExpired) {
            throw new Error('SESSION_EXPIRED');
        }
        
        throw new Error(errorDetails.message);
    }


}

export default apiClient;