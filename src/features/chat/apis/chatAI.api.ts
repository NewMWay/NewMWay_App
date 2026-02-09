import { ChatAIMessageRequest, ChatAIMessageResponse, ChatAIFileRequest, ChatAIFileResponse } from "../types/ChatAi.type";
import axios from 'axios';

export const sendMessageToChatAI = async (request: ChatAIMessageRequest): Promise<ChatAIMessageResponse> => {
    // Gọi trực tiếp API chatbot, không dùng apiClient vì format response khác
    const response = await axios.post<ChatAIMessageResponse>(
        'https://chatbot.newmwayteakwood.vn/chat',
        request,
    );
    return response.data;
}

export const sendFileToChatAI = async (request: ChatAIFileRequest): Promise<ChatAIFileResponse> => {
    const formData = new FormData();
    formData.append('file', request.file);

    const response = await axios.post<ChatAIFileResponse>(
        'https://chatbot.newmwayteakwood.vn/search/image',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}
