import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useToast } from "../utils/toasts/useToast";


/**
 * Custom hook để tạo mutation (API POST/PUT/DELETE) với toast tích hợp
 *
 * @template TData - Kiểu dữ liệu trả về khi mutation thành công (response)
 * @template TError - Kiểu lỗi (default: Error)
 * @template TVariables - Kiểu dữ liệu đầu vào cho mutation (request body hoặc params)
 * @template TContext - Kiểu dữ liệu của context (default: unknown)
 *
 * @param mutationFn - Hàm thực hiện mutation (API gọi bằng axios/fetch, trả Promise<TData>)
 * @param contextName - Tên ngữ cảnh để log lỗi (tùy chọn, dùng để định danh mutation)
 * @param successMessage - Thông báo khi mutation thành công (tùy chọn, dùng trong toast)
 * @param errorMessage - Thông báo khi mutation thất bại (tùy chọn, dùng trong toast)
 * @param options - Các tùy chọn thêm của useMutation
 *
 * @returns Kết quả mutation với mutate, isLoading, isError, error, v.v.
 */

export const useCreateMutation = <
    TData,
    TError = Error,
    TVariables = void,
    TContext = unknown
>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    contextName: string = 'mutation',
    successMessage: string,
    errorMessage: string,
    options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>,
) => {
    const { showError, showSuccess } = useToast();
    const wrappedMutationFn = async (variables: TVariables) => {
        try {
            const data = await mutationFn(variables);
            if (successMessage) {
                showSuccess(successMessage);
            }
            return data;
        } catch (error) {
            console.log(`${contextName} error - Details:`, {
                message: error instanceof Error ? error.message : 'Unknown error',
                response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
                status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
            });
            if (errorMessage) {
                showError(error instanceof Error ? error.message : errorMessage);
            }
            throw error; // Ném lại lỗi để TanStack Query xử lý
        }
    };

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: wrappedMutationFn,
    ...options,
  });
};