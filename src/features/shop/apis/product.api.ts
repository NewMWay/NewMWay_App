import apiClient from "../../../services/apis/apiClient";
import { AddUserDeviceTokenRequest, DeleteUserDeviceTokenRequest } from "../../profile/types/profile.type";
import { GetAllProductsRequest, GetAllProductPaginateResponse, GetProductByIdRequest, GetProductByIdResponse, GetProductReviewRequest, GetProductReviewPaginateResponse, CreateProductReviewRequest, UpdateProductReviewRequest, DeleteProductReviewRequest, DeleteMediaRequest, GetUserHistoryReviewedProductsRequest, GetUserHistoryReviewedProductsResponse, GetBannerRequest, GetBannerResponse } from "../types/product.type";

export const getAllProductApi = async (request: GetAllProductsRequest): Promise<GetAllProductPaginateResponse> => {
    return apiClient<GetAllProductPaginateResponse>({
        method: 'GET',
        url: '/products',
        params: {
            page: request.page,
            size: request.size,
            search: request.search,
            isActive: request.isActive,
            categoryId: request.categoryId,
            supplierId: request.supplierId,
            minPrice: request.minPrice,
            maxPrice: request.maxPrice,
            sortBy: request.sortBy,
            rating: request.rating,
        },
    });
}

export const getProductByIdApi = async (request: GetProductByIdRequest): Promise<GetProductByIdResponse> => {
    return apiClient<GetProductByIdResponse>({
        method: 'GET',
        url: `/products/${request.productID}`,
    });
}

export const getProductReviewApi = async (request: GetProductReviewRequest): Promise<GetProductReviewPaginateResponse> => {
    return apiClient<GetProductReviewPaginateResponse>({
        method: 'GET',
        url: `/products/${request.productId}/product-reviews`,
        params: request
    });
}

export const createProductReviewApi = async (request: CreateProductReviewRequest): Promise<void> => {
    return apiClient<void>({
        method: 'POST',
        url: '/product-reviews',
        data: request,
    });
}

export const updateProductReviewApi = async (request: UpdateProductReviewRequest): Promise<void> => {
    return apiClient<void>({
        method: 'PATCH',
        url: `/product-reviews/${request.Id}`,
        data: request,
    })
}

export const deleteProductMediaApi = async (request: DeleteMediaRequest): Promise<void> => {
    return apiClient<void>({
        method: 'DELETE',
        url: `/product-reviews/media/${request.id}`,
        data: request,
    })
}

export const deleteProductReviewApi = async (request: DeleteProductReviewRequest): Promise<void> => {
    return apiClient<void>({
        method: 'DELETE',
        url: `/product-reviews/${request.Id}`,
    })
}


export const getUserHistoryReviewedProductsApi = async (request: GetUserHistoryReviewedProductsRequest): Promise<GetUserHistoryReviewedProductsResponse> => {
    return apiClient<GetUserHistoryReviewedProductsResponse>({
        method: 'GET',
        url: `product-reviews/history`,
        params: {
            pageNumber: request.PageNumber,
            pageSize: request.PageSize,
        }
    })
}

export const addUserDeviceTokenApi = async (request: AddUserDeviceTokenRequest): Promise<void> => {
    return apiClient<void>({
        method: 'POST',
        url: `/user-device-tokens`,
        data: request,
    })
}

// cái này để nhầm file, sau sửa lại đúng chỗ
export const deleteUserDeviceTokenApi = async (request: DeleteUserDeviceTokenRequest): Promise<void> => {
    return apiClient<void>({
        method: 'DELETE',
        url: `/user-device-tokens`,
        data: request,
    })
}


export const getBannerApi = async (request: GetBannerRequest): Promise<GetBannerResponse> => {
    return apiClient<GetBannerResponse>({
        method: 'GET',
        url: `/banner-settings`,
        params: request,
    })
}   