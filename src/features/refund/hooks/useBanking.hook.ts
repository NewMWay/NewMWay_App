import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomConditionalQuery, useCustomQuery } from "../../../hooks/useCustomQuery";

import { CreateUserBankingRequest, CreateUserBankingResponse, GetUserBankingDetailRequest, GetUserBankingResponse, GetUserBankingDetailResponse, UpdateUserBankingRequest, UpdateUserBankingResponse } from "../types/bank.type";
import { createUserBankingApi, getUserBankingApi, getUserBankingDetailApi, updateUserBankingApi } from "../apis/bank.api";

export const useCreateUserBanking = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<CreateUserBankingResponse, Error, CreateUserBankingRequest>(
        createUserBankingApi,
        'useCreateUserBankingHook',
        'Thêm thông tin ngân hàng thành công!',
        'Thêm thông tin ngân hàng thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["userBanking"] });
                queryClient.invalidateQueries({ queryKey: ["userBankingDetail"] });
            }
        }
    )
}

export const useUpdateUserBanking = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<UpdateUserBankingResponse, Error, UpdateUserBankingRequest>(
        updateUserBankingApi,
        'useUpdateUserBankingHook',
        'Cập nhật thông tin ngân hàng thành công!',
        'Cập nhật thông tin ngân hàng thất bại!',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["userBanking"] });
                queryClient.invalidateQueries({ queryKey: ["userBankingDetail"] });
            }
        }
    )
}

export const useUserBankingQuery = () => {
    return useCustomQuery<GetUserBankingResponse, Error>(
        ['userBanking'],
        () => getUserBankingApi(),
        'useUserBankingQuery',
        'Không thể lấy thông tin ngân hàng người dùng.',
        true
    )
}

export const useUserBankingDetailQuery = (request: GetUserBankingDetailRequest) => {
    return useCustomConditionalQuery<GetUserBankingDetailResponse, Error>(
        ['userBankingDetail', request.id],
        () => getUserBankingDetailApi(request),
        !!request.id,
        'useUserBankingDetailQuery',
        'Không thể lấy chi tiết thông tin ngân hàng người dùng.',
        true
    )
}
