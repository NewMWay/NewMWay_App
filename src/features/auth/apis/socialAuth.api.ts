import apiClient from "../../../services/apis/apiClient";
import { SocialLoginGoogleRequest, SocialLoginGoogleResponse } from "../types/socialLogin.type";

export const socialLoginWithGoogleApi = async (request: SocialLoginGoogleRequest): Promise<SocialLoginGoogleResponse> => {
    return apiClient<SocialLoginGoogleResponse>({
        method: 'POST',
        url: '/auth/login/google',
        data: request,
    })
}