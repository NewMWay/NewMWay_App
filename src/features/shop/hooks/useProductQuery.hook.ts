import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProductApi, getProductByIdApi, getProductReviewApi, createProductReviewApi, updateProductReviewApi, deleteProductMediaApi, deleteProductReviewApi, getUserHistoryReviewedProductsApi, getBannerApi } from "../apis/product.api";
import { GetAllProductsRequest, GetAllProductPaginateResponse, GetProductByIdResponse, GetProductByIdRequest, GetProductReviewRequest, GetProductReviewPaginateResponse, CreateProductReviewRequest, UpdateProductReviewRequest, DeleteMediaRequest, DeleteProductReviewRequest, GetUserHistoryReviewedProductsRequest, GetUserHistoryReviewedProductsResponse, GetBannerRequest, GetBannerResponse } from "../types/product.type";
import { useCustomDependentQuery } from "../../../hooks/useCustomQuery";
import { useCreateMutation } from "../../../hooks/useCreateMutation";


export const useProductQuery = (
    baseRequest: Omit<GetAllProductsRequest, 'page' | 'size'>,
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery<GetAllProductPaginateResponse, Error>({
        queryKey: ['products', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetAllProductsRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
                isActive: baseRequest.isActive ?? true,
                search: baseRequest.search || undefined,
                categoryId: baseRequest.categoryId || undefined,
                supplierId: baseRequest.supplierId || undefined,
                minPrice: baseRequest.minPrice || undefined,
                maxPrice: baseRequest.maxPrice || undefined,
                sortBy: baseRequest.sortBy || undefined,
                rating: baseRequest.rating || undefined,
            };
            return await getAllProductApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
        enabled: options?.enabled ?? true,
        refetchOnMount: false, // Prevent refetch on mount when switching tabs
        refetchOnWindowFocus: false, // Prevent refetch on focus
        staleTime: 30 * 1000, // Consider fresh for 30 seconds
    });
};


export const useProductByIdQuery = (request: GetProductByIdRequest) => {
    return useCustomDependentQuery<GetProductByIdResponse, Error>(
        ['productByID', request.productID],
        () => getProductByIdApi(request),
        !!request.productID,
        'useProductByIdQuery',
        'Không thể lấy thông tin sản phẩm.',
        true
    )
}

export const useProductReviewQuery = (baseRequest: Omit<GetProductReviewRequest, 'pageNumber' | 'pageSize'>) => {
    return useInfiniteQuery<GetProductReviewPaginateResponse, Error>({
        queryKey: ['productReviews', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetProductReviewRequest = {
                ...baseRequest,
                pageNumber: pageParam as number,
                pageSize: 10,
                rating: baseRequest.rating || undefined,
            };
            return await getProductReviewApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000,
    });
};

export const useCreateProductReview = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, CreateProductReviewRequest>(
        createProductReviewApi,
        'useCreateProductReviewHook',
        'Đánh giá sản phẩm thành công!',
        'Đánh giá sản phẩm thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
                queryClient.invalidateQueries({ queryKey: ["userHistoryReviewedProducts"] });
            },
        }
    );
}

export const useUpdateProductReview = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, UpdateProductReviewRequest>(
        updateProductReviewApi,
        'useUpdateProductReviewHook',
        'Cập nhật đánh giá sản phẩm thành công!',
        'Cập nhật đánh giá sản phẩm thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
                queryClient.invalidateQueries({ queryKey: ["userHistoryReviewedProducts"] });
            },
        }
    );
}

export const useDeleteProductMedia = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, DeleteMediaRequest>(
        deleteProductMediaApi,
        'useDeleteProductMediaHook',
        'Xóa media sản phẩm thành công!',
        'Xóa media sản phẩm thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
                queryClient.invalidateQueries({ queryKey: ["userHistoryReviewedProducts"] });
            },
        }
    );
}

export const useDeleteProductReview = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, DeleteProductReviewRequest>(
        deleteProductReviewApi,
        'useDeleteProductReviewHook',
        'Xóa đánh giá sản phẩm thành công!',
        'Xóa đánh giá sản phẩm thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
                queryClient.invalidateQueries({ queryKey: ["userHistoryReviewedProducts"] });
            },
        }
    );
}
export const useUserHistoryReviewedProductsQuery = (baseRequest: Omit<GetUserHistoryReviewedProductsRequest, 'PageNumber' | 'PageSize'>, options?: { enabled?: boolean }) => {
    return useInfiniteQuery<GetUserHistoryReviewedProductsResponse, Error>({
        queryKey: ['userHistoryReviewedProducts', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetUserHistoryReviewedProductsRequest = {
                ...baseRequest,
                PageNumber: pageParam as number,
                PageSize: 10,
            };
            return await getUserHistoryReviewedProductsApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
        enabled: options?.enabled ?? true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000,
    });
}




export const useBannerQuery = (baseRequest: Omit<GetBannerRequest, 'Page' | 'Size'>, options?: { enabled?: boolean }) => {
    return useInfiniteQuery<GetBannerResponse, Error>({
        queryKey: ['banners', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetBannerRequest = {
                ...baseRequest,
                Page: pageParam as number,
                Size: 10,
            };
            return await getBannerApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
        enabled: options?.enabled ?? true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000,
    });
}   