import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { sendFileToChatAI } from "../apis/chatAI.api";
import { ChatAIFileRequest, ChatAIFileResponse } from "../types/ChatAi.type";

export const useUploadFileAI = () => {
    return useCreateMutation<ChatAIFileResponse, Error, ChatAIFileRequest>(
        sendFileToChatAI,
        "useUploadFileAI",
        "",
        "Gửi ảnh đến AI Chat thất bại"
    );
}
