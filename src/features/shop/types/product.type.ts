import { VariantType } from "./variant.type";
import { MediaType } from "./media.enum";
import { RatingEnum, SortByEnum } from "./productFilter.enum";

export interface GetAllProductsRequest {
    page: number;
    size: number;
    search?: string;
    isActive?: boolean;
    categoryId?: string;
    supplierId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: SortByEnum;
    rating?: RatingEnum;
}

export interface GetAllProductPaginateResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: ProductType[];
}

export interface ProductType {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    warranty: number;
    createdDate: string;
    price: number;
    oldPrice: number;
    rating: number;
    sold: number;
    isHot: boolean;
    lastModifiedDate: string | null;
    categoryID: string;
    categoryName: string;
    categoryDescription: string;
    categoryIcon: string;
    isActive: boolean;
    isHasVariants: boolean;
}


export interface GetProductByIdRequest {
    productID: string;
}

export interface GetProductByIdResponse {
    id: string;
    name: string;
    description: string;
    instruct: string;
    thumbnail: string;
    warranty: string;
    categoryID: string;
    categoryName: string;
    isHasVariants: boolean;
    supplierId: string;
    supplierName: string;
    createdDate: string;
    lastModifiedDate: string | null;
    images: { url: string }[];
    attributes: {
        id: string;
        productID: string;
        attributeID: string;
        name: string;
        value: string;
    }[];
    variantsResponses: VariantType[];
}

export interface GetProductReviewRequest {
    productId: string;
    rating?: number;
    pageNumber: number;
    pageSize: number;
}

export interface GetProductReviewPaginateResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: ProductReviewType[];
}

export interface ProductReviewType {
    id: string;
    title: string | null;
    content: string;
    image: string | null;
    rating: number;
    date: string;
    time: string;
    userId: string;
    userName: string;
    fullName: string;
    avatar: string | null;
    media: { id: string; url: string; type?: MediaType }[];
    productVariantId: string;
    productVariantName: string;
    replies: ProductReplyType[];
}

export interface ProductReplyType {
    id: string;
    content: string;
    date: string;
    time: string;
    userId: string;
    userName: string;
    avatar: string | null;
}

export interface CreateProductReviewRequest {
    title: string;
    content: string;
    rating: number;
    medias?: { url: string, type: MediaType }[];
    productVariantId: string;
}

export interface UpdateProductReviewRequest {
    Id: string;
    title?: string;
    content?: string;
    rating: number;
    medias?: { url: string, type: MediaType }[];
}

export interface DeleteMediaRequest {
    id: string;
}

export interface DeleteProductReviewRequest {
    Id: string;
}

export interface AddMediaToReviewRequest {
    Id: string;
    medias: { url: string, type: MediaType }[];
}


export interface GetUserHistoryReviewedProductsRequest {
    PageNumber: number;
    PageSize: number;
}

export interface GetUserHistoryReviewedProductsResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: UserHistoryReviewedProductItem[];
}

export interface UserHistoryReviewedProductItem {
    id: string;
    title: string;
    content: string;
    rating: number;
    image: string | null;
    date: string;
    time: string;
    reviewMedias: {
        id: string;
        url: string;
        createdDate: string;
        lastModifiedDate: string | null;
        type: MediaType;
    }[];
    productVariants: {
        productVariantId: string;
        name: string;
        price: number;
        sold: number;
        image: string;
    }[];
    replies: ProductReplyType[];

}

export interface GetBannerRequest {
    Page: number;
    Size: number;
}

export interface GetBannerResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: BannerItem[];
}

export interface BannerItem {
    id: string;
    title: string;
    content: string;
    url: string;
    createdDate: string;
}
