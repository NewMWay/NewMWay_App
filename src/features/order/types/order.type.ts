import { PaymentMethod } from "./payment.enum";
import { OrderStatus, OrderType } from "./order.enum";
import { OrderDeliveriesStatus } from "./orderDeliveries.enum";

export interface CreateOrderRequest {
    userAddressId: string;
    note?: string;
    shippingAmount: number;
    productVariantOptionValueStocks: {
        productVariantOptionValueStockId: string;
        quantity: number;
    }[];
    promotions: string[];
}

export interface CreateOrderResponse {
    id: string;
    // promotionId: string | null;
    totalPrice: number;
}


export interface CreatePaymentRequest {
    id: string;
    type: PaymentMethod;
}

export interface CreatePaymentResponse {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    expiredAt: number;
    status: 'Pending' | 'Completed' | 'Failed';
    checkoutUrl: string;
    qrCode: string;
}

export interface OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    productVariantOptionValueStockId: string;
    optionName: string | null;
    optionValue: string | null;
    productId: string;
    productVariantId: string;
    productName: string;
    productVariantName: string;
    imageUrl: string;
    sku: string;
    productVariantDescription: string;
}

export interface GetOderDetailRequest {
    id: string;
}

export interface GetOrderDetailResponse {
    id: string;
    totalOrderAmount: number;
    type: OrderType;
    totalOrderAmountDiscount: number;
    shippingAmount: number;
    shippingAmountDiscount: number;
    totalAmount: number;
    fullName: string;
    phoneNumber: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    status: OrderStatus;
    createdDate: string;
    lastModifiedDate: string | null;
    items: OrderItem[];
}

export interface GetOrderListRequest {
    page: number;
    size: number;
    sortBy?: string;
    isAsc?: boolean;
    status?: OrderStatus;
}
export interface GetOrderListResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: {
        id: string;
        totalAmount: number;
        type: OrderType;
        fullName: string;
        phoneNumber: string;
        province: string;
        district: string;
        ward: string;
        address: string;
        status: OrderStatus;
        createdDate: string;
        lastModifiedDate: string | null;
    }[];
}

export interface GetOrderDeliveriesRequest {
    id: string;
}

export interface GetOrderDeliveriesResponse {
    id: string;
    deliveryCode: string;
    shippingPartner: string;
    trackingNumber: string;
    pickupAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    status: OrderDeliveriesStatus;
    createdDate: string;
}

export interface CancelOrderRequest {
    id: string;
    reason?: string;
    userBankingId?: string;
}
