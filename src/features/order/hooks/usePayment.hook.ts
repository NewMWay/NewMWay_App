import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { CreatePaymentRequest, CreatePaymentResponse } from "../types/order.type";
import { createPaymentApi } from "../apis/payment.api";

export const useCreatePayment = () => {
    return useCreateMutation<CreatePaymentResponse, Error, CreatePaymentRequest>(
        createPaymentApi,
        "useCreatePaymentHook",
        "Tạo đơn thanh toán thành công!",
        "Tạo đơn thanh toán thất bại!"
    );
}