import { RefundStatus } from "../enums/refund.enum";

// React Native image type for multipart upload
export interface ImageFile {
    uri: string;
    type: string;
    name: string;
}

export interface CreateRefundRequest {
    id: string;
    UserBankingId: string;
    Reason: string;
    Images: ImageFile[];
}

export interface CreateRefundResponse {
    id: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    orderId: string;
}

export interface GetAllRefundsRequest {
    page: number;
    size: number;
    isAsc?: boolean;
    sortBy?: string;
}

export interface GetAllRefundsResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: RefundItems[];
}

export interface RefundItems {
    id: string;
    amount: number;
    reason: string;
    adminNote: string | null;
    status: RefundStatus;
    bankName: string;
    bankNumber: string;
    createdAt: string;
    lastModifiedDate: string | null;
}


export interface GetRefundDetailRequest {
    id: string;
}

export interface GetRefundDetailResponse {
    id: string;
    amount: number;
    reason: string;
    adminNote: string | null;
    status: RefundStatus;
    bankName: string;
    bankNumber: string;
    createdAt: string;
    lastModifiedDate: string | null;
    refundImage: RefundImageItem[];
}

export interface RefundImageItem {
    id: string;
    imageUrl: string;
    type: string;
}

