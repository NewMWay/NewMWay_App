import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { createOrderApi, getOrderListApi, getOrderDetailApi, getOrderDeliveriesApi, cancelOrderApi } from "../apis/order.api";
import { CreateOrderRequest, CreateOrderResponse, GetOrderListRequest, GetOrderListResponse, GetOderDetailRequest, GetOrderDetailResponse, GetOrderDeliveriesRequest, GetOrderDeliveriesResponse, CancelOrderRequest } from "../types/order.type";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCustomConditionalQuery } from "../../../hooks/useCustomQuery";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<CreateOrderResponse, Error, CreateOrderRequest>(
        createOrderApi,
        "useCreateOrderHook",
        "Tạo đơn hàng thành công!",
        "Tạo đơn hàng thất bại!",
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["orderList"] });
                queryClient.invalidateQueries({ queryKey: ["orderDetail"] });
                queryClient.invalidateQueries({ queryKey: ["orderDeliveries"] });
            }
        }
    );
}

export const useOrderListQuery = (baseRequest: Omit<GetOrderListRequest, 'page' | 'size'>) => {
    return useInfiniteQuery<GetOrderListResponse, Error>({
        queryKey: ['orderList', baseRequest],
        queryFn: async ({ pageParam = 1 }) => {
            const request: GetOrderListRequest = {
                ...baseRequest,
                page: pageParam as number,
                size: 10,
            };
            return await getOrderListApi(request);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    });
}

export const useOrderDetailQuery = (request: GetOderDetailRequest) => {
    return useCustomConditionalQuery<GetOrderDetailResponse, Error>(
        ['orderDetail', request.id],
        () => getOrderDetailApi(request),
        !!request.id,
        'useOrderDetailQuery',
        'Không thể lấy thông tin đơn hàng.',
        true
    )
}


export const useOrderDeliveriesQuery = (request: GetOrderDeliveriesRequest) => {
    return useCustomConditionalQuery<GetOrderDeliveriesResponse[], Error>(
        ['orderDeliveries', request.id],
        () => getOrderDeliveriesApi(request),
        !!request.id,
        'useOrderDeliveriesQuery',
        'Không thể lấy thông tin đơn giao hàng.',
        true
    )
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, CancelOrderRequest>(
        cancelOrderApi,
        "useCancelOrderHook",
        "Hủy đơn hàng thành công!",
        "Hủy đơn hàng thất bại!",

        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["orderList"] });
                queryClient.invalidateQueries({ queryKey: ["orderDetail"] });
                queryClient.invalidateQueries({ queryKey: ["orderDeliveries"] });
            }
        }
    );
}   