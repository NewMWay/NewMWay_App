import apiClient from "../../../services/apis/apiClient";
import { GetProvincesResponse, GetDistrictsRequest, GetDistrictsResponse, GetWardsRequest, GetWardsResponse, GetUserAddressResponse, CreateUserAddressRequest, UpdateUserAddressRequest } from "../types/address.types";

export const getProvincesApi = async (): Promise<GetProvincesResponse> => {
    return apiClient<GetProvincesResponse>({
        method: 'GET',
        url: '/addresses/provinces',
    })
}
export const getDistrictsApi = async (request: GetDistrictsRequest): Promise<GetDistrictsResponse> => {
    return apiClient<GetDistrictsResponse>({
        method: 'GET',
        url: `addresses/provinces/${request.id}/districts`,
        params: request,
    })
}
export const getWardsApi = async (request: GetWardsRequest): Promise<GetWardsResponse> => {
    return apiClient<GetWardsResponse>({
        method: 'GET',
        url: `addresses/districts/${request.id}/wards`,
        params: request,
    })
}

export const getUserAddressApi = async (): Promise<GetUserAddressResponse[]> => {
    return apiClient<GetUserAddressResponse[]>({
        method: 'GET',
        url: `user-addresses`,
    })
}

export const createUserAddressApi = async (request: CreateUserAddressRequest): Promise<GetUserAddressResponse> => {
    return apiClient<GetUserAddressResponse>({
        method: 'POST',
        url: `user-addresses`,
        data: request,
    })
}

export const updateUserAddressApi = async (request: UpdateUserAddressRequest): Promise<GetUserAddressResponse> => {
    return apiClient<GetUserAddressResponse>({
        method: 'PATCH',
        url: `user-addresses/${request.id}`,
        data: request,
    })
}