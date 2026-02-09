import { GetFavoriteProductsRequest, GetFavoriteProductsResponse } from "../types/favorite.type";
import { getFavoriteApi } from "../apis/favorite.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useFavoriteQuery = (baseRequest?: Omit<GetFavoriteProductsRequest, 'pageNumber' | 'pageSize'>) => {
    return useInfiniteQuery<GetFavoriteProductsResponse, Error>({
        queryKey: ['favoriteProducts', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetFavoriteProductsRequest = {
                ...baseRequest,
                pageNumber: pageParam as number,
                pageSize: 10,
            };
            return await getFavoriteApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    });
}
