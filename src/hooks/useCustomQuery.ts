import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useToast } from "../utils/toasts/useToast";

/**
 * Custom hook để tạo query (API GET) với toast và error handling tích hợp
 *
 * @template TData - Kiểu dữ liệu trả về khi query thành công (response)
 * @template TError - Kiểu lỗi (default: Error)
 *
 * @param queryKey - Array key để xác định và cache query
 * @param queryFn - Hàm thực hiện query (API gọi bằng axios/fetch, trả Promise<TData>)
 * @param contextName - Tên ngữ cảnh để log lỗi (tùy chọn, dùng để định danh query)
 * @param errorMessage - Thông báo khi query thất bại (tùy chọn, dùng trong toast)
 * @param showErrorToast - Có hiển thị toast lỗi hay không (default: true)
 * @param options - Các tùy chọn thêm của useQuery
 *
 * @returns Kết quả query với data, isLoading, isError, error, refetch, v.v.
 */

export const useCustomQuery = <TData, TError = Error>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    contextName: string = 'query',
    errorMessage?: string,
    showErrorToast: boolean = true,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> => {
    const { showError } = useToast();

    const wrappedQueryFn = async (): Promise<TData> => {
        try {
            const data = await queryFn();
            return data;
        } catch (error) {
            console.log(`${contextName} error - Details:`, {
                message: error instanceof Error ? error.message : 'Unknown error',
                response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
                status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
                queryKey: queryKey,
            });

            // Không hiển thị toast nếu là lỗi session expired (đã hiển thị trong interceptor)
            const isSessionExpired = error instanceof Error && error.message === 'SESSION_EXPIRED';

            if (showErrorToast && errorMessage && !isSessionExpired) {
                showError(error instanceof Error ? error.message : errorMessage);
            }

            throw error; // Ném lại lỗi để TanStack Query xử lý
        }
    };

    return useQuery<TData, TError>({
        queryKey,
        queryFn: wrappedQueryFn,
        retry: 2, // Giảm từ 3 xuống 2 để tránh spam retry
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        staleTime: 5 * 60 * 1000, // 5 phút - dữ liệu được coi là fresh trong 5 phút
        gcTime: 10 * 60 * 1000, // 10 phút - cache time (trước đây là cacheTime)
        refetchOnWindowFocus: false, // Không refetch khi focus window
        refetchOnMount: false, // Không refetch khi mount
        ...options,
    });
};

/**
 * Custom hook cho conditional query - chỉ chạy query khi điều kiện được thỏa mãn
 */
export const useCustomConditionalQuery = <TData, TError = Error>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    enabled: boolean,
    contextName: string = 'conditional-query',
    errorMessage?: string,
    showErrorToast: boolean = true,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn' | 'enabled'>
): UseQueryResult<TData, TError> => {
    return useCustomQuery<TData, TError>(
        queryKey,
        queryFn,
        contextName,
        errorMessage,
        showErrorToast,
        {
            enabled,
            ...options,
        }
    );
};

/**
 * Custom hook cho dependent query - query phụ thuộc vào kết quả của query khác
 */
export const useCustomDependentQuery = <TData, TError = Error, TDependency = any>(
    queryKey: string[],
    queryFn: (dependency: TDependency) => Promise<TData>,
    dependency: TDependency | undefined,
    contextName: string = 'dependent-query',
    errorMessage?: string,
    showErrorToast: boolean = true,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn' | 'enabled'>
): UseQueryResult<TData, TError> => {
    // Tạo queryKey an toàn với dependency
    const safeQueryKey = [...queryKey, String(dependency || '')];

    return useCustomQuery<TData, TError>(
        safeQueryKey,
        () => queryFn(dependency!),
        contextName,
        errorMessage,
        showErrorToast,
        {
            enabled: !!dependency,
            ...options,
        }
    );
};