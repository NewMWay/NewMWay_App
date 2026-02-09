import apiClient from "../../../services/apis/apiClient";
import { CreatePaymentRequest, CreatePaymentResponse } from "../types/order.type";

export const createPaymentApi = async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    return apiClient<CreatePaymentResponse>({
        method: 'POST',
        url: `/orders/${data.id}/payments`,
        data: data,
    })
}