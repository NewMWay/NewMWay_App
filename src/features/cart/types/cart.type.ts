
export interface AddCartRequest {
    productId: string;
    productName: string;
    productVariantId: string;
    productVariantName: string;
    quantity: number;
    unitPrice: number;
    productVariantOptionValueStockId: string;
    optionValueId?: string | null;
    optionValueName?: string | null;
    optionId?: string | null;
    optionName?: string | null;
    oldPrice: number;
    supplierName: string;
    productImageUrl: string;
}


export interface AddCartResponse {
  subtotalAmount: number;
  totalDiscountAmount: number;
  finalTotalAmount: number;
  //   promotionId: any;
  //   promotionName: any;
  cartItems: CartItem[];
};

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  supplierName: string;
  quantity: number;
  totalPrice: number;
  variants: Variant[];
};

export interface Variant {
  productVariantId: string;
  productVariantName: string;
  unitPrice: number;
  oldPrice: number;
  productImageUrl: string;
  productOptionValueStocks: ProductOptionValueStock[];
};

export interface ProductOptionValueStock {
  productVariantOptionValueStockId: string;
  optionValueId: any;
  optionValueName: any;
  optionId: any;
  optionName: any;
  isSelected: boolean;
};


export interface DeleteCartItemRequest {
    id: string;
}


export interface UpdateCartItemRequest {
    id: string;
    quantity: number;
    productVariantId: string;
    productVariantOptionValueStockId: string;
    productVariantName: string;
    unitPrice: number;
    optionValueId?: string | null;
    optionValueName?: string | null;
    optionId?: string | null;
    optionName?: string | null;
}
