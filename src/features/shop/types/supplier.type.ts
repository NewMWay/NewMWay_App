export interface GetAllSupplierRequest {
    page: number;
    size: number;
    search?: string;
    isActive?: boolean;
}

export interface GetAllSupplierBaseResponse {
    status: number;
    message: string;
    data: GetAllSupplierPaginateResponse;
}

export interface GetAllSupplierPaginateResponse {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: Supplier[];
}


export interface Supplier {
    id: string;
    name: string;
    logo: string;
    createdDate: string;
    lastModifiedDate: string | null;
    isActive: boolean;
}
