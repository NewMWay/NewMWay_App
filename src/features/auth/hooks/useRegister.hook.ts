import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { registerApi } from "../apis/auth.api";
import { RegisterFormSchema } from "../schemas/register.schema";
import { RegisterResponse } from "../types/register.type";
import { setTokens } from "../../../services/stores/authStore.mmkv";
import { useAuthStore } from "../../../stores/authStore.zustand";

export const useRegister = () => {
    const { login: setLoggedIn } = useAuthStore();

    return useCreateMutation<RegisterResponse, Error, RegisterFormSchema>(
        registerApi,
        "useRegisterHook",
        "Đăng ký thành công!",
        "Đăng ký thất bại!",
        {
            onSuccess: (data) => {
                // Lưu tokens vào MMKV
                setTokens(data.accessToken, data.refreshToken);
                
                // Cập nhật auth store
                setLoggedIn("user", data.accessToken, data.refreshToken);
            }
        }
    )
}