import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { forgotPasswordApi } from "../apis/auth.api";
import { ResetPasswordFormSchema } from "../schemas/resetPassword.schema";

export const useForgotPassword = () => {
    return useCreateMutation<void, Error, ResetPasswordFormSchema>(
        forgotPasswordApi,
        "useForgotPasswordHook",
        "Đặt lại mật khẩu thành công!",
        "Đặt lại mật khẩu thất bại!",
    )
}