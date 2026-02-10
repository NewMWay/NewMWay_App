import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { SocialLoginGoogleRequest, SocialLoginGoogleResponse } from "../types/socialLogin.type";
import { socialLoginWithGoogleApi } from "../apis/socialAuth.api";
import { useAuthStore } from "../../../stores/authStore.zustand";
import { useAddUserDeviceToken } from "../../shop/hooks/useUserDeviceToken.hook";
import { setTokens } from "../../../services/stores/authStore.mmkv";
import { getFcmToken } from "../../../utils/fcmHelper";
import { Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

export const useSocialGoogleLogin = () => {
    const { login: setLoggedIn } = useAuthStore();
    const { mutate: addDeviceToken } = useAddUserDeviceToken();
    const queryClient = useQueryClient();

    return useCreateMutation<SocialLoginGoogleResponse, Error, SocialLoginGoogleRequest>(
        socialLoginWithGoogleApi,
        'socialGoogleLoginHook',
        'Đăng nhập Google thành công!',
        'Đăng nhập Google thất bại. Vui lòng thử lại.',

        {
            onSuccess: async (data) => {
                // Clear React Query cache để fetch data mới của user mới
                queryClient.clear();
                
                setTokens(data.accessToken, data.refreshToken);
                setLoggedIn("user", data.accessToken, data.refreshToken)

                try {
                    const fcmToken = await getFcmToken();
                    if (fcmToken) {
                        addDeviceToken({
                            deviceToken: fcmToken,
                            deviceType: Platform.OS === 'ios' ? 'ios' : 'android'
                        });
                    }
                } catch (error) {
                    console.log("Lỗi khi lấy hoặc gửi FCM token:", error);
                }
            }
        }
    )

}