import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { addUserDeviceTokenApi, deleteUserDeviceTokenApi } from "../apis/product.api";
import { AddUserDeviceTokenRequest, DeleteUserDeviceTokenRequest } from "../../profile/types/profile.type";

export const useAddUserDeviceToken = () => {
    return useCreateMutation<void, Error, AddUserDeviceTokenRequest>(
        addUserDeviceTokenApi,
        'useAddUserDeviceTokenHook',
        '',
        'Khởi tạo device token thất bại!'
    )
}

export const useDeleteUserDeviceToken = () => {
    return useCreateMutation<void, Error, DeleteUserDeviceTokenRequest>(
        deleteUserDeviceTokenApi,
        'useDeleteUserDeviceTokenHook',
        '',
        'Xoá device token thất bại!'
    )
}