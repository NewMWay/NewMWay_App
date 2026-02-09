import { useCustomDependentQuery } from "../../../hooks/useCustomQuery";
import { getProvincesApi, getDistrictsApi, getWardsApi, getUserAddressApi, createUserAddressApi, updateUserAddressApi } from "../apis/address.api";
import { GetProvincesResponse, GetDistrictsRequest, GetDistrictsResponse, GetWardsRequest, GetWardsResponse, GetUserAddressResponse, CreateUserAddressRequest, UpdateUserAddressRequest } from "../types/address.types";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useProvincesQuery = () => {
    return useCustomDependentQuery<GetProvincesResponse, Error>(
        ['provinces'],
        () => getProvincesApi(),
        true,
        'useProvincesQuery',
        'Không thể lấy danh sách tỉnh/thành phố.',
        true
    )
}

export const useDistrictsQuery = (request: GetDistrictsRequest) => {
    return useCustomDependentQuery<GetDistrictsResponse, Error>(
        ['districts', request.id],
        () => getDistrictsApi(request),
        !!request.id,
        'useDistrictsQuery',
        'Không thể lấy danh sách quận/huyện.',
        true
    )
}

export const useWardsQuery = (request: GetWardsRequest) => {
    return useCustomDependentQuery<GetWardsResponse, Error>(
        ['wards', request.id],
        () => getWardsApi(request),
        !!request.id,
        'useWardsQuery',
        'Không thể lấy danh sách phường/xã.',
        true
    )
}

export const useUserAddressQuery = () => {
    return useCustomDependentQuery<GetUserAddressResponse[], Error>(
        ['userAddresses'],
        () => getUserAddressApi(),
        true,
        'useUserAddressQuery',
        'Không thể lấy địa chỉ người dùng.',
        true
    )
}

export const useCreateUserAddress = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<GetUserAddressResponse,Error, CreateUserAddressRequest>(
       createUserAddressApi,
         'useCreateUserAddressHook',
         'Tạo địa chỉ thành công!',
         'Tạo địa chỉ thất bại!',
         {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
            }
         }
    )
}

export const useUpdateUserAddress = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<GetUserAddressResponse,Error, UpdateUserAddressRequest>(
       updateUserAddressApi,
         'useUpdateUserAddressHook',
         'Cập nhật địa chỉ thành công!',
         'Cập nhật địa chỉ thất bại!',
         {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
            }
         }
    )
}