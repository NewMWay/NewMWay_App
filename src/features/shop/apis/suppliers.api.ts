import apiClient from "../../../services/apis/apiClient";
import { GetAllSupplierRequest, GetAllSupplierPaginateResponse } from "../types/supplier.type";


export const getAllSupplierApi = async (request: GetAllSupplierRequest): Promise<GetAllSupplierPaginateResponse> => {
    return apiClient<GetAllSupplierPaginateResponse>({
        method: 'GET',
        url: '/suppliers',
        params: request,
    });
}

