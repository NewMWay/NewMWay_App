import apiClient from '../../../services/apis/apiClient';
import { LoginFormSchema } from '../schemas/login.schema';
import { RegisterFormSchema } from '../schemas/register.schema';
import { SendOtpFormSchema } from '../schemas/sendOtp.schema';
import { LoginResponse } from '../types/login.type';
import { RegisterResponse } from '../types/register.type';
import { RefreshTokenRequest, RefreshTokenResponse } from '../types/refreshToken';


export const registerApi = async (request: RegisterFormSchema): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>({
        url: 'auth/register',
        method: 'POST',
        data: request,
        contentType: 'multipart/form-data'
    });
}

export const sendOtpApi = async (request: SendOtpFormSchema): Promise<void> => {
    return apiClient<void>({
        url: 'auth/otp',
        method: 'POST',
        data: request,
    });
}

export const loginApi = async (request: LoginFormSchema): Promise<LoginResponse> => {
    return apiClient<LoginResponse>({
        url: 'auth/login',
        method: 'POST',
        data: request,
    });
}


export const refreshTokenApi = async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    console.log("Refreshing token with request:", request);
    
    return apiClient<RefreshTokenResponse>({
        url: 'auth/refresh-token',
        method: 'POST',
        data: request,
    });
}
