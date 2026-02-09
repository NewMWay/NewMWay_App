import { BankName } from "../enums/bankName.enum"


export interface CreateUserBankingRequest {
    bankName: BankName
    bankNumber: string
}

export interface CreateUserBankingResponse {
    id: string
    bankName: string
    bankNumber: string
}

export interface UpdateUserBankingRequest {
    id: string
    bankName: BankName
    bankNumber: string
}

export interface UpdateUserBankingResponse {
    id: string
    bankName: string
    bankNumber: string
}

export interface UserBankingItem {
    id: string
    bankName: string
    bankNumber: string
}

export type GetUserBankingResponse = UserBankingItem[]

export interface GetUserBankingDetailRequest {
    id: string
}

export interface GetUserBankingDetailResponse {
    id: string
    bankName: string
    bankNumber: string
}

