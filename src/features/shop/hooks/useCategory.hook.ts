import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllCategoriesApi } from "../apis/category.api";
import { GetAllCategoryRequest, GetAllCategoryResponsePagination } from "../types/category.type"

export const useCategoryQuery = (baseRequest: Omit<GetAllCategoryRequest, 'page' | 'size'>) => {
    return useInfiniteQuery<GetAllCategoryResponsePagination, Error>({
        queryKey: ['categories', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetAllCategoryRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
                isActive: true,
                search: baseRequest.search || undefined,
            };
            return await getAllCategoriesApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    })
}

