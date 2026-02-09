export interface SocialLoginGoogleRequest {
    idToken: string;
}

export interface SocialLoginGoogleResponse {
    userId: string;
    accessToken: string;
    refreshToken: string;
}