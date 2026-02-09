import { useCustomConditionalQuery } from "../../../hooks/useCustomQuery";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { getProfileApi, updateProfileApi } from "../apis/profile.api";
import { GetProfileResponse, UpdateProfileRequest } from "../types/profile.type";
import { useQueryClient } from "@tanstack/react-query";


export const useProfileQuery = () => {
    return useCustomConditionalQuery<GetProfileResponse, Error>(
        ['profile'],
        () => getProfileApi(),
        true,
        'useProfileQuery',
        'Không thể lấy thông tin người dùng.',
        true
    )
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useCreateMutation<GetProfileResponse, Error, UpdateProfileRequest>(
        updateProfileApi,
        "useUpdateProfileHook",
        "Cập nhật thông tin người dùng thành công!",
        "Cập nhật thông tin người dùng thất bại!",
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["profile"] });

            }
        }
    );
}
