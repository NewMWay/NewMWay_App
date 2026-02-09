import apiClient from "../../../services/apis/apiClient";
import { GetVariantByProductIdRequest, GetVariantByProductIdPaginateResponse } from "../types/variant.type";

export const getVariantByProductIdApi = async ( request: GetVariantByProductIdRequest): Promise<GetVariantByProductIdPaginateResponse> => {
    return apiClient<GetVariantByProductIdPaginateResponse>({
        method: 'GET',
        url: `/products/${request.productID}/variant`,
        params: request,
    }); 
}