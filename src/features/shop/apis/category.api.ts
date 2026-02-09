import apiClient from "../../../services/apis/apiClient";
import { GetAllCategoryRequest, GetAllCategoryResponsePagination } from "../types/category.type";

export const getAllCategoriesApi = async (request: GetAllCategoryRequest): Promise<GetAllCategoryResponsePagination> => {
    return apiClient<GetAllCategoryResponsePagination>({
        method: 'GET',
        url: '/categories',
        params: request,
    })
}