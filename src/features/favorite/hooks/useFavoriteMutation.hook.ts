import { addFavoriteProductApi } from "../apis/favorite.api";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { AddFavoriteProductRequest } from "../types/favorite.type";
import { useQueryClient } from "@tanstack/react-query";

export const useAddFavoriteProduct = () => {
    const queryClient = useQueryClient();
    return useCreateMutation<void, Error, AddFavoriteProductRequest>(
        addFavoriteProductApi,
        "useAddFavoriteProductHook",
        "",
        "Thêm sản phẩm yêu thích thất bại!",

        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['favoriteProducts'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
        }
    );

}