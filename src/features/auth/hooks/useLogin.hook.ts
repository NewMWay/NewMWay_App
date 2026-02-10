import { loginApi } from "../apis/auth.api";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { LoginFormSchema } from "../schemas/login.schema";
import { LoginResponse } from "../types/login.type";
import { setTokens } from "../../../services/stores/authStore.mmkv";
import { useAuthStore } from "../../../stores/authStore.zustand";
import { getFcmToken } from "../../../utils/fcmHelper";
import { useAddUserDeviceToken } from "../../shop/hooks/useUserDeviceToken.hook";
import { Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
    const { login: setLoggedIn } = useAuthStore();
    const { mutate: addDeviceToken } = useAddUserDeviceToken();
    const queryClient = useQueryClient();

    return useCreateMutation<LoginResponse, Error, LoginFormSchema>(
        loginApi,
        "useLoginHook",
        "Đăng nhập thành công!",
        "Đăng nhập thất bại!",
        {
            onSuccess: async (data) => {
                // Clear React Query cache để fetch data mới của user mới
                queryClient.clear();
                
                // Lưu tokens vào MMKV
                setTokens(data.accessToken, data.refreshToken);

                // Cập nhật auth store
                setLoggedIn("user", data.accessToken, data.refreshToken);

                // Lấy FCM token và gửi lên server
                try {
                    const fcmToken = await getFcmToken();
                    if (fcmToken) {
                        addDeviceToken({
                            deviceToken: fcmToken,
                            deviceType: Platform.OS,
                        });
                    }
                } catch (error) {
                    console.log('Failed to get or add FCM token:', error);
                }
            }
        }
    )
}

