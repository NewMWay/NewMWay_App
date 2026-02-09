import apiClient from "../../../services/apis/apiClient";
import {
    CreateRefundRequest,
    CreateRefundResponse,
    GetAllRefundsRequest,
    GetAllRefundsResponse,
    GetRefundDetailRequest,
    GetRefundDetailResponse
} from "../types/refund.type"

export const createRefundApi = async (request: CreateRefundRequest): Promise<CreateRefundResponse> => {
    // Manually create FormData for proper multipart/form-data handling
    const formData = new FormData()

    formData.append('UserBankingId', request.UserBankingId)
    formData.append('Reason', request.Reason)

    // Append each image file separately
    if (request.Images && request.Images.length > 0) {
        request.Images.forEach((image: any) => {
            formData.append('Images', image)
        })
    }

    return apiClient<CreateRefundResponse>({
        method: 'POST',
        url: `/orders/${request.id}/refund-requests`,
        data: formData,
        contentType: 'multipart/form-data'
    })
}

export const getAllRefundsApi = async (request: GetAllRefundsRequest): Promise<GetAllRefundsResponse> => {
    return apiClient<GetAllRefundsResponse>({
        method: 'GET',
        url: '/refund-requests',
        params: {
            page: request.page,
            size: request.size,
            isAsc: request.isAsc,
            sortBy: request.sortBy
        }
    })
}

export const getRefundDetailApi = async (request: GetRefundDetailRequest): Promise<GetRefundDetailResponse> => {
    return apiClient<GetRefundDetailResponse>({
        method: 'GET',
        url: `/refund-requests/${request.id}`,
    })
}