import apiClient from "../../../services/apis/apiClient";
import { GetPromotionsRequest, GetPromotionsReponse } from "../types/promotion.type";

export const getPromotionsApi = async (params: GetPromotionsRequest): Promise<GetPromotionsReponse> => {
    return apiClient<GetPromotionsReponse>({
        method: 'GET',
        url: '/promotions',
        params: params,
    })
}