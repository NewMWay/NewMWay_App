import apiClient from "../../../services/apis/apiClient";
import { GetLastMessagesRequest, GetLastMessagesResponsePagination } from "../types/ChatAdmin.type";

export const getLastMessagesApi = async (request: GetLastMessagesRequest): Promise<GetLastMessagesResponsePagination> => {
    return apiClient<GetLastMessagesResponsePagination>({
        method: 'GET',
        url: '/last-message-chats',
        params: request
    })
}
