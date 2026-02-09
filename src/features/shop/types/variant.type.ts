export interface GetVariantByProductIdRequest {
    productID: string;
    isActive?: boolean;
    page: number;
    size: number;
    search?: string;
}

export interface GetVariantByProductIdPaginateResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: VariantType[];
}

export interface VariantType {
    id: string;
    name: string;
    oldPrice: number;
    price: number;
    weight: number | null;
    sold: number;
    description: string;
    imageUrl: string;
    isActive: boolean;
    sku: string;
    barcode: string;
    barCodeImage: string;
    rating: number | null;
    productID: string;
    optionValueStocks: OptionValueStock[] | null;
}

export interface OptionValueStock {
    id: string;
    optionName: string;
    quantity: number;
    value: string;
    optionValueId: string;
    isActive: boolean;
}
