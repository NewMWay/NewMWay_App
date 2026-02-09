export interface ChatAIMessageRequest {
    message: string;
}

export interface ChatAIMessageResponse {
    response: string;
    products: ChatAIProduct[] | null;
    timestamp: string;
}

export interface ChatAIFileRequest {
    file: File;
}
export interface ChatAIFileResponse {
    response: string;
    image_description: string;
    products: ChatAIProduct[] | null;
    timestamp: string;
}

export interface ChatAIProduct {
    id: string;
    name: string;
    description: string;
    instruct: string;
    image: string;
    price: number;
    old_price: number;
    sold: number;
}

// {
//   "response": "string",
//   "image_description": "string",
//   "products": [
//     {
//     id:9651FDE0-CC1E-47E0-B558-8D4AAA256ABD
// name:Test
// description:<p>Khi mới mua về, rửa sạch thớt bằng nước ấm và nước rửa chén pha loãng.</p><p>Lau thật khô bề mặt bằng khăn mềm.</p><p><strong>Bước quan trọng:</strong> Nên lau một lớp dầu thực vật (tốt nhất là dầu khoáng/Mineral Oil hoặc sáp ong chuyên dụng cho thớt) lên toàn bộ bề mặt và cạnh thớt. Để qua đêm cho dầu thấm sâu, giúp thớt lên màu đẹp và tăng khả năng chống thấm nước.</p>
// instruct:<p>Khi mới mua về, rửa sạch thớt bằng nước ấm và nước rửa chén pha loãng.</p><p>Lau thật khô bề mặt bằng khăn mềm.</p><p><strong>Bước quan trọng:</strong> Nên lau một lớp dầu thực vật (tốt nhất là dầu khoáng/Mineral Oil hoặc sáp ong chuyên dụng cho thớt) lên toàn bộ bề mặt và cạnh thớt. Để qua đêm cho dầu thấm sâu, giúp thớt lên màu đẹp và tăng khả năng chống thấm nước.</p>
// image:https://down-vn.img.susercontent.com/file/sg-11134201-7rd47-lu1lr64anxdv71.webp
// price:4000
// old_price:37373
// sold:0
// }
// ,
//{
// id:9651FDE0-CC1E-47E0-B558-8D4AAA256ABD
// name:Test
// description:<p>Khi mới mua về, rửa sạch thớt bằng nước ấm và nước rửa chén pha loãng.</p><p>Lau thật khô bề mặt bằng khăn mềm.</p><p><strong>Bước quan trọng:</strong> Nên lau một lớp dầu thực vật (tốt nhất là dầu khoáng/Mineral Oil hoặc sáp ong chuyên dụng cho thớt) lên toàn bộ bề mặt và cạnh thớt. Để qua đêm cho dầu thấm sâu, giúp thớt lên màu đẹp và tăng khả năng chống thấm nước.</p>
// instruct:<p>Khi mới mua về, rửa sạch thớt bằng nước ấm và nước rửa chén pha loãng.</p><p>Lau thật khô bề mặt bằng khăn mềm.</p><p><strong>Bước quan trọng:</strong> Nên lau một lớp dầu thực vật (tốt nhất là dầu khoáng/Mineral Oil hoặc sáp ong chuyên dụng cho thớt) lên toàn bộ bề mặt và cạnh thớt. Để qua đêm cho dầu thấm sâu, giúp thớt lên màu đẹp và tăng khả năng chống thấm nước.</p>
// image:https://down-vn.img.susercontent.com/file/sg-11134201-7rd47-lu1lr64anxdv71.webp
// price:36000
// old_price:37000
// sold:0
// }
//   ],
//   "timestamp": "string"
// }

// {
//   "response": "Chào bạn! Sản phẩm thớt gỗ Teak NEW M WAY Đầu Cây dài 40cm của chúng tôi rất phù hợp cho gia đình bạn đấy. Thớt này được làm từ gỗ teak cao cấp, bền đẹp và an toàn với thực phẩm. Thiết kế đầu thớt dài giúp bạn dễ dàng thái các loại thực phẩm lớn. Đảm bảo mang đến cho bạn trải nghiệm sử dụng thớt tốt nhất. Bạn có muốn đặt hàng không?",
//   "products": null,
//   "timestamp": "2026-01-03T18:31:32.516991"
// }