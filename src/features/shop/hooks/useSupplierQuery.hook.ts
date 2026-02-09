import { GetAllSupplierRequest, GetAllSupplierPaginateResponse } from "../types/supplier.type";
import { getAllSupplierApi } from "../apis/suppliers.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSupplierQuery = (baseRequest: Omit<GetAllSupplierRequest, 'page' | 'size'>) => {
    return useInfiniteQuery<GetAllSupplierPaginateResponse, Error>({
        queryKey: ['suppliers', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetAllSupplierRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
                isActive: true,
                search: baseRequest.search || undefined,
            };
            return await getAllSupplierApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    });
};