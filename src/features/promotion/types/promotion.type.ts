import { PromotionType } from "./promotion.enum";

export interface GetPromotionsRequest {
    size: number;
    page: number;
    code?: string;
    sortBy?: string;
    isAsc?: boolean;
    totalPrice?: number;
}
export interface GetPromotionsReponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: PromotionItem[];
}

export interface PromotionItem {
    id: string;
    code: string;
    name: string;
    type: PromotionType;
    quantity: number;
    description: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isWarning: boolean;
}

