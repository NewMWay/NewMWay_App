import { getLastMessagesApi } from "../apis/chatAdmin.api";
import { GetLastMessagesRequest, GetLastMessagesResponsePagination } from "../types/ChatAdmin.type";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface UseLastMessageChatParams {
    username?: string | null;
    page?: number;
    size?: number;
    enabled?: boolean;
}

export const useLastMessageChat = ({
    username = null,
    page = 1,
    size = 20,
    enabled = true,
}: UseLastMessageChatParams): UseQueryResult<GetLastMessagesResponsePagination, Error> => {
    return useQuery<GetLastMessagesResponsePagination, Error>({
        queryKey: ['lastMessageChat', { page, size, username }],
        queryFn: async () => {
            const request: GetLastMessagesRequest = {
                page,
                size,
                username: username || undefined,
            };
            return await getLastMessagesApi(request);
        },
        enabled,
        staleTime: 30000, // 30 seconds
        refetchOnMount: true,
    });
}