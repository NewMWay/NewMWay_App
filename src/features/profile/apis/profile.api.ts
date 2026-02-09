import apiClient from "../../../services/apis/apiClient";
import { GetProfileResponse, UpdateProfileRequest } from "../types/profile.type";

export const getProfileApi = async (): Promise<GetProfileResponse> => {
    return apiClient<GetProfileResponse>({
        method: 'GET',
        url: 'users/profile',
    });
}

export const updateProfileApi = async (request: UpdateProfileRequest): Promise<GetProfileResponse> => {
    return apiClient<GetProfileResponse>({
        method: 'PATCH',
        url: 'users/profile',
        data: request,
    });
}

