import { useInfiniteQuery } from "@tanstack/react-query";
import { getPromotionsApi } from "../apis/promotion.api";
import { GetPromotionsRequest, GetPromotionsReponse } from "../types/promotion.type";

export const usePromotionQuery = (baseRequest: Omit<GetPromotionsRequest, 'page' | 'size'>) => {
    return useInfiniteQuery<GetPromotionsReponse, Error>({
        queryKey: ['promotions', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetPromotionsRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
                isAsc: false,
            };
            return await getPromotionsApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    })
}