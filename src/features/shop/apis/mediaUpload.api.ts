import apiClient from "../../../services/apis/apiClient";
import { UploadImageRequest, UploadVideoRequest } from "../types/mediaUpload.type";

export const uploadVideoApi = async (request: UploadVideoRequest): Promise<string> => {
    const formData = new FormData();
    formData.append('Video', request.Video);
    return apiClient<string>({
        method: 'POST',
        url: '/videos',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const uploadImageApi = async (request: UploadImageRequest): Promise<string> => {
    const formData = new FormData();
    formData.append('Image', request.Image);
    return apiClient<string>({
        method: 'POST',
        url: '/images',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}