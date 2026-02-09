import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { sendOtpApi } from "../apis/auth.api";
import { SendOtpFormSchema } from "../schemas/sendOtp.schema";


export const useOtp = () => {
    return useCreateMutation<void, Error, SendOtpFormSchema>(
        sendOtpApi,
        "useOtpHook",
        "Gửi mã OTP thành công!",
        "Gửi mã OTP thất bại!",
    )
}