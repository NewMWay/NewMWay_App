import { useInfiniteQuery } from "@tanstack/react-query";
import { GetVariantByProductIdRequest, GetVariantByProductIdPaginateResponse } from "../types/variant.type";
import { getVariantByProductIdApi } from "../apis/variant.api";


export const useVariantByProductIdQuery = (baseRequest: Omit<GetVariantByProductIdRequest, 'page' | 'size'>) => {
    return useInfiniteQuery<GetVariantByProductIdPaginateResponse, Error>({
        queryKey: ['variants', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetVariantByProductIdRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
                isActive: baseRequest.isActive ?? true,
                search: baseRequest.search || undefined,
            };
            return await getVariantByProductIdApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    });
};