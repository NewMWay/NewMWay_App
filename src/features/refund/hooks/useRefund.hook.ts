import { useInfiniteQuery } from "@tanstack/react-query";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { getAllRefundsApi, createRefundApi, getRefundDetailApi } from "../apis/refund.api";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomConditionalQuery } from "../../../hooks/useCustomQuery";

import {
    GetAllRefundsRequest,
    GetAllRefundsResponse,
    CreateRefundRequest,
    CreateRefundResponse,
    GetRefundDetailRequest,
    GetRefundDetailResponse
} from "../types/refund.type";

export const useRefundsQuery = (baseRequest: Omit<GetAllRefundsRequest, 'page' | 'size'>) => {
    return useInfiniteQuery<GetAllRefundsResponse, Error>({
        queryKey: ['refunds', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetAllRefundsRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
            };
            return await getAllRefundsApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    });
};

export const useCreateRefund = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<CreateRefundResponse, Error, CreateRefundRequest>(
        createRefundApi,
        'useCreateRefundHook',
        'Yêu cầu hoàn tiền đã được gửi thành công!',
        'Gửi yêu cầu hoàn tiền thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["refunds"] });
            }
        }
    )
}


export const useRefundDetailQuery = (request: GetRefundDetailRequest) => {
    return useCustomConditionalQuery<GetRefundDetailResponse, Error>(
        ['refundDetail', request.id],
        () => getRefundDetailApi(request),
        !!request.id,
        'useRefundDetailQuery',
        'Không thể lấy chi tiết yêu cầu hoàn tiền.',
        true
    )
}