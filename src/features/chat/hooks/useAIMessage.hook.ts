import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { sendMessageToChatAI } from "../apis/chatAI.api";
import { ChatAIMessageRequest, ChatAIMessageResponse } from "../types/ChatAi.type";

export const useAIMessageHook = () => {
    return useCreateMutation<ChatAIMessageResponse, Error, ChatAIMessageRequest>(
        sendMessageToChatAI,
        "useAIMessageHookhi",
        "",
        "Gửi tin nhắn đến AI Chat thất bại"
    );
}