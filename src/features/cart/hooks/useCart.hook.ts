import { useQueryClient } from "@tanstack/react-query";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { useCustomQuery } from "../../../hooks/useCustomQuery";
import { addCartApi, getCartApi, deleteCartItemApi, clearCartApi, updateCartItemApi } from "../apis/cart.api";
import { AddCartRequest, AddCartResponse, UpdateCartItemRequest } from "../types/cart.type";

export const useAddCart = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<AddCartResponse, Error, AddCartRequest>(
        (request: AddCartRequest) => addCartApi(request),
        'addCart',
        'Thêm vào giỏ hàng thành công',
        'Thêm vào giỏ hàng thất bại',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["useGetCart"] });
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });

            }
        }
    )
}


export const useGetCart = (options?: { enabled?: boolean }) => {
    return useCustomQuery<AddCartResponse, Error>(
        ['useGetCart'],
        () => getCartApi(),
        'useGetCart',
        'Không thể lấy thông tin giỏ hàng.',
        true,
        {
            enabled: options?.enabled ?? true,
            refetchOnMount: false, // Don't refetch on mount to prevent spam
            staleTime: 30 * 1000, // Consider fresh for 30 seconds
        }
    )
}



export const useDeleteCartItem = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<AddCartResponse, Error, { id: string }>(
        (request: { id: string }) => deleteCartItemApi(request),
        'deleteCartItem',
        '',
        'Xoá sản phẩm khỏi giỏ hàng thất bại',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["useGetCart"] });
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
            }
        }
    )
}

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, void>(
        () => clearCartApi(),
        'clearCart',
        'Xoá giỏ hàng thành công',
        'Xoá giỏ hàng thất bại',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["useGetCart"] });
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
            },
        }
    )
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<AddCartResponse, Error, UpdateCartItemRequest>(
        (request: UpdateCartItemRequest) => updateCartItemApi(request),
        'updateCartItem',
        'Cập nhật giỏ hàng thành công',
        'Cập nhật giỏ hàng thất bại',
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["useGetCart"] });
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["productByID"] });
                queryClient.invalidateQueries({ queryKey: ["productReviews"] });
            }
        }
    )
}    