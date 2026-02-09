import apiClient from "../../../services/apis/apiClient";
import {
    CreateOrderRequest,
    CreateOrderResponse,
    GetOrderListRequest,
    GetOrderListResponse,
    GetOderDetailRequest,
    GetOrderDetailResponse,
    GetOrderDeliveriesRequest,
    GetOrderDeliveriesResponse,
    CancelOrderRequest,
} from "../types/order.type";

export const createOrderApi = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    return apiClient<CreateOrderResponse>({
        method: 'POST',
        url: '/orders',
        data: data,
    })
}

export const getOrderListApi = async (params: GetOrderListRequest): Promise<GetOrderListResponse> => {
    return apiClient<GetOrderListResponse>({
        method: 'GET',
        url: '/orders',
        params: params,
    })
}

export const getOrderDetailApi = async (params: GetOderDetailRequest): Promise<GetOrderDetailResponse> => {
    return apiClient<GetOrderDetailResponse>({
        method: 'GET',
        url: `/orders/${params.id}`,
    })
}

export const getOrderDeliveriesApi = async (params: GetOrderDeliveriesRequest): Promise<GetOrderDeliveriesResponse[]> => {
    return apiClient<GetOrderDeliveriesResponse[]>({
        method: 'GET',
        url: `/orders/${params.id}/deliveries`,
    })
}


export const cancelOrderApi = async (params: CancelOrderRequest): Promise<void> => {
    return apiClient<void>({
        method: 'DELETE',
        url: `/orders/${params.id}`,
        data: params
    })
}