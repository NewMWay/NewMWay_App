import apiClient from "../../../services/apis/apiClient";
import { CreateUserBankingRequest, CreateUserBankingResponse, UpdateUserBankingRequest, UpdateUserBankingResponse, GetUserBankingResponse, GetUserBankingDetailRequest, GetUserBankingDetailResponse } from "../types/bank.type";

export const createUserBankingApi = async (request: CreateUserBankingRequest): Promise<CreateUserBankingResponse> => {
    return apiClient<CreateUserBankingResponse>({
        method: 'POST',
        url: '/user-banking',
        data: request
    })
}

export const updateUserBankingApi = async (request: UpdateUserBankingRequest): Promise<UpdateUserBankingResponse> => {
    return apiClient<UpdateUserBankingResponse>({
        method: 'PATCH',
        url: `/user-banking/${request.id}`,
        data: request
    })
}

export const getUserBankingApi = async (): Promise<GetUserBankingResponse> => {
    return apiClient<GetUserBankingResponse>({
        method: 'GET',
        url: '/user-banking'
    })
}

export const getUserBankingDetailApi = async (request: GetUserBankingDetailRequest): Promise<GetUserBankingDetailResponse> => {
    return apiClient<GetUserBankingDetailResponse>({
        method: 'GET',
        url: `/user-banking/${request.id}`
    })
}