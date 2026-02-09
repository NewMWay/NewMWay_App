import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { CalculateFeeRequest, CalculateFeeResponse } from "../types/fee.type";
import { calculateFeeApi } from "../apis/fee.api";

export const useCalculateFee = () => {
    return useCreateMutation<CalculateFeeResponse, Error, CalculateFeeRequest>(
        calculateFeeApi,
        "useCalculateFeeHook",
        "",
        "Tính phí vận chuyển thất bại!"
    );
}