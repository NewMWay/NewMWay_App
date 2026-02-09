import apiClient from "../../../services/apis/apiClient";
import { AddCartRequest, AddCartResponse, DeleteCartItemRequest, UpdateCartItemRequest } from "../types/cart.type";

export const addCartApi = async (request: AddCartRequest): Promise<AddCartResponse> => {
    console.log("addCartApi request:", request);

    return apiClient<AddCartResponse>({
        method: "POST",
        url: "/carts",
        data: request,
    })
}

export const getCartApi = async (): Promise<AddCartResponse> => {
    return apiClient<AddCartResponse>({
        method: "GET",
        url: "/carts",
    });
}

export const deleteCartItemApi = async (request: DeleteCartItemRequest): Promise<AddCartResponse> => {
    return apiClient<AddCartResponse>({
        method: "DELETE",
        url: `cart-items/${request.id}`,
    });
}

export const clearCartApi = async () => {
    return apiClient<void>({
        method: "DELETE",
        url: `/carts`,
    });
}

export const updateCartItemApi = async (request: UpdateCartItemRequest): Promise<AddCartResponse> => {
    return apiClient<AddCartResponse>({
        method: "PATCH",
        url: `cart-items/${request.id}`,
        data: request,
    });
}