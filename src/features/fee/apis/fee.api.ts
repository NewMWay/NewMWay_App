import apiClient from "../../../services/apis/apiClient";
import { CalculateFeeRequest, CalculateFeeResponse } from "../types/fee.type";

export const calculateFeeApi = async (data: CalculateFeeRequest): Promise<CalculateFeeResponse> => {
    return apiClient<CalculateFeeResponse>({
        method: 'POST',
        url: '/fees',
        data: data,
    })
}