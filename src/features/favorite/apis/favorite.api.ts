import apiClient from "../../../services/apis/apiClient";
import { GetFavoriteProductsRequest, GetFavoriteProductsResponse, AddFavoriteProductRequest } from "../types/favorite.type";

export const getFavoriteApi = async (request: GetFavoriteProductsRequest): Promise<GetFavoriteProductsResponse> => {
    return apiClient<GetFavoriteProductsResponse>({
        method: 'GET',
        url: '/favorite-product',
        params: request,
    });
}

export const addFavoriteProductApi = async (request: AddFavoriteProductRequest): Promise<void> => {
    return apiClient<void>({
        method: 'POST',
        url: '/favorite-product',
        data: request,
    });
}