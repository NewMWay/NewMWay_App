export interface GetLastMessagesRequest {
    page: number;
    size: number;
    username?: string | null;
}
export interface GetLastMessagesResponsePagination {
    status: number;
    message: string;
    data: {
        size: number;
        page: number;
        total: number;
        totalPages: number;
        items: ChatMessage[];
    };
}

export interface ChatMessage {
    id: string;
    senderUsername: string;
    recipientUsername: string;
    senderAvatarUrl: string;
    recipientAvatarUrl: string;
    content: string;
    messageLastDate: string;
    isRead: boolean;
    humanizedTime: string;
    type: MessageTypeEnum;
}

export enum MessageTypeEnum {
    Text = 'Text',
    Image = 'Image',
    Product = 'Product',
}

export interface ProductContentMessageResponse {
    id: string;
    name: string;
    thumbnail?: string;
    price: number;
    categoryName: string;
    isActive: boolean;
    isHasVariants: boolean;
    rating: number;
}

// {
//   "status": 0,
//   "message": "string",
//   "data": {
//     "size": 0,
//     "page": 0,
//     "total": 0,
//     "totalPages": 0,
//     "items": [
//       {
//         "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "senderUsername": "string",
//         "recipientUsername": "string",
//         "senderAvatarUrl": "string",
//         "recipientAvatarUrl": "string",
//         "content": "string",
//         "messageLastDate": "2026-01-05T15:11:27.808Z",
//         "isRead": true,
//         "humanizedTime": "string"
//       }
//     ]
//   }
// }