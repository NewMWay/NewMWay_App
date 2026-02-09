import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { uploadImageApi, uploadVideoApi } from "../apis/mediaUpload.api";
import { UploadImageRequest, UploadVideoRequest } from "../types/mediaUpload.type";

export const useUploadVideo = () => {
    return useCreateMutation<string, Error, UploadVideoRequest>(
        uploadVideoApi,
        'useUploadVideoHook',
        'Tải video lên thành công!',
        'Tải video lên thất bại!'
    )
}

export const useUploadImage = () => {
    return useCreateMutation<string, Error, UploadImageRequest>(
        uploadImageApi,
        'useUploadImageHook',
        'Tải hình ảnh lên thành công!',
        'Tải hình ảnh lên thất bại!'
    )
}