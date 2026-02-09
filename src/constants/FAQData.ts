export interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: 'order' | 'payment' | 'shipping' | 'product' | 'account' | 'other';
}

export const FAQ_DATA: FAQItem[] = [
    // Đặt hàng (Order)
    {
        id: 1,
        category: 'order',
        question: 'Làm thế nào để đặt hàng trên ứng dụng?',
        answer: 'Bạn có thể đặt hàng dễ dàng bằng cách:\n1. Chọn sản phẩm yêu thích trong danh mục\n2. Nhấn "Thêm vào giỏ hàng"\n3. Vào giỏ hàng và kiểm tra sản phẩm\n4. Nhấn "Thanh toán"\n5. Điền thông tin giao hàng\n6. Chọn phương thức thanh toán\n7. Xác nhận và hoàn tất đơn hàng'
    },
    {
        id: 2,
        category: 'order',
        question: 'Tôi có thể hủy đơn hàng sau khi đã đặt không?',
        answer: 'Bạn có thể hủy đơn hàng trong các trường hợp sau:\n• Đơn hàng chưa được xác nhận: Hủy miễn phí trong app\n• Đơn hàng đã xác nhận nhưng chưa giao: Liên hệ hotline để được hỗ trợ\n• Đơn hàng đang giao: Không thể hủy, nhưng có thể từ chối nhận hàng\n\nLưu ý: Đơn đã thanh toán online sẽ được hoàn tiền trong 5-7 ngày làm việc'
    },
    {
        id: 3,
        category: 'order',
        question: 'Làm sao để theo dõi đơn hàng của tôi?',
        answer: 'Theo dõi đơn hàng rất đơn giản:\n1. Vào tab "Đơn Hàng" trên thanh menu\n2. Chọn đơn hàng bạn muốn xem\n3. Xem chi tiết trạng thái và vị trí đơn hàng\n\nCác trạng thái đơn hàng:\n• Chờ xác nhận\n• Đang chuẩn bị\n• Đang giao\n• Đã giao\n• Đã hủy'
    },

    // Thanh toán (Payment)
    {
        id: 4,
        category: 'payment',
        question: 'Các phương thức thanh toán được hỗ trợ?',
        answer: 'NEWMWAY hỗ trợ đa dạng phương thức thanh toán:\n• Thanh toán khi nhận hàng (COD)\n• Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB)\n• Ví điện tử: Momo, ZaloPay, VNPay, ShopeePay\n• Chuyển khoản ngân hàng\n• Trả góp qua thẻ tín dụng (đơn từ 3 triệu)\n\nTất cả giao dịch đều được mã hóa bảo mật SSL'
    },
    {
        id: 5,
        category: 'payment',
        question: 'Tôi có được hoàn tiền nếu hủy đơn?',
        answer: 'Chính sách hoàn tiền:\n• COD: Không mất phí hủy đơn\n• Thanh toán online: Hoàn 100% nếu hủy trước khi xác nhận\n• Đơn đã xác nhận: Hoàn tiền sau khi trừ phí xử lý (nếu có)\n\nThời gian hoàn tiền:\n• Ví điện tử: 1-3 ngày làm việc\n• Thẻ tín dụng: 5-7 ngày làm việc\n• Chuyển khoản: 3-5 ngày làm việc'
    },
    {
        id: 6,
        category: 'payment',
        question: 'Có được sử dụng nhiều mã giảm giá cùng lúc không?',
        answer: 'Quy định về mã giảm giá:\n• Chỉ áp dụng 1 mã giảm giá cho mỗi đơn hàng\n• Một số mã có thể kết hợp với chương trình khuyến mãi của shop\n• Mã có giá trị cao nhất sẽ được ưu tiên áp dụng\n• Kiểm tra điều kiện áp dụng của mỗi mã trước khi thanh toán\n\nGợi ý: Vào mục "Khuyến Mãi" để xem tất cả mã có sẵn'
    },

    // Giao hàng (Shipping)
    {
        id: 7,
        category: 'shipping',
        question: 'Thời gian giao hàng là bao lâu?',
        answer: 'Thời gian giao hàng phụ thuộc vào địa điểm:\n\nKhu vực nội thành Hà Nội/TP.HCM:\n• Giao hàng nhanh: 2-4 giờ (phí cao hơn)\n• Giao hàng tiêu chuẩn: 1-2 ngày\n\nKhu vực ngoại thành:\n• 2-3 ngày làm việc\n\nTỉnh thành khác:\n• 3-5 ngày làm việc\n\nVùng xa, hải đảo:\n• 5-7 ngày làm việc\n\nLưu ý: Không giao hàng vào Chủ nhật và ngày lễ'
    },
    {
        id: 8,
        category: 'shipping',
        question: 'Phí giao hàng được tính như thế nào?',
        answer: 'Chi phí vận chuyển được tính dựa trên:\n\n1. Khoảng cách địa lý:\n   • Nội thành: 15,000 - 30,000đ\n   • Ngoại thành: 30,000 - 50,000đ\n   • Tỉnh xa: 50,000 - 100,000đ\n\n2. Khối lượng đơn hàng:\n   • < 2kg: Phí cơ bản\n   • > 2kg: Tính thêm 5,000đ/kg\n\n3. Ưu đãi:\n   • Miễn phí ship đơn > 500,000đ\n   • Giảm 50% ship cho đơn > 300,000đ'
    },
    {
        id: 9,
        category: 'shipping',
        question: 'Tôi có thể thay đổi địa chỉ giao hàng không?',
        answer: 'Thay đổi địa chỉ giao hàng:\n\nTrước khi đơn được xác nhận:\n• Vào "Đơn Hàng Của Tôi"\n• Chọn đơn cần đổi địa chỉ\n• Nhấn "Chỉnh sửa"\n• Cập nhật địa chỉ mới\n\nSau khi đơn đã xác nhận:\n• Liên hệ ngay hotline: +84 123 456 789\n• Có thể bị tính phí thêm nếu địa chỉ mới xa hơn\n\nSau khi đơn đang giao:\n• Không thể thay đổi, chỉ có thể hẹn giao lại'
    },

    // Sản phẩm (Product)
    {
        id: 10,
        category: 'product',
        question: 'Làm thế nào để hoàn trả sản phẩm?',
        answer: 'Quy trình hoàn trả sản phẩm:\n\n1. Điều kiện hoàn trả:\n   • Trong vòng 7 ngày kể từ khi nhận hàng\n   • Sản phẩm còn nguyên vẹn, chưa qua sử dụng\n   • Còn đầy đủ bao bì, tem mác, phụ kiện\n\n2. Các bước thực hiện:\n   • Vào "Đơn Hàng Của Tôi"\n   • Chọn "Yêu cầu hoàn trả/đổi hàng"\n   • Chọn lý do và tải ảnh chứng minh\n   • Gửi yêu cầu\n   • Đợi xác nhận (1-2 ngày)\n   • Đóng gói và gửi lại sản phẩm\n\n3. Chi phí:\n   • Lỗi từ shop: Miễn phí ship 2 chiều\n   • Đổi ý: Khách chịu phí ship'
    },
    {
        id: 11,
        category: 'product',
        question: 'Sản phẩm gỗ teak có chính hãng không?',
        answer: 'Cam kết chất lượng sản phẩm gỗ teak:\n\n• 100% gỗ teak tự nhiên, nhập khẩu từ Myanmar, Lào\n• Có giấy chứng nhận nguồn gốc xuất xứ\n• Qua xử lý chống mối mọt, chống cong vênh\n• Bảo hành 2-5 năm tùy sản phẩm\n• Chính sách đổi trả nếu phát hiện hàng giả\n• Mỗi sản phẩm có tem chống giả và mã QR tra cứu\n\nNEWMWAY cam kết chỉ bán hàng chính hãng, chất lượng cao'
    },
    {
        id: 12,
        category: 'product',
        question: 'Làm sao để bảo quản sản phẩm gỗ teak?',
        answer: 'Hướng dẫn bảo quản gỗ teak:\n\n1. Vệ sinh thường xuyên:\n   • Lau bằng khăn mềm, ẩm\n   • Tránh dùng hóa chất mạnh\n   • Vệ sinh 1-2 lần/tuần\n\n2. Bảo vệ bề mặt:\n   • Đánh bóng 3-6 tháng/lần\n   • Dùng dầu hoặc sáp gỗ chuyên dụng\n   • Tránh để nước lâu trên bề mặt\n\n3. Môi trường:\n   • Tránh ánh nắng trực tiếp\n   • Giữ độ ẩm 50-70%\n   • Tránh nhiệt độ quá cao/thấp\n\n4. Xử lý vết xước:\n   • Vết nhỏ: Dùng bút sơn gỗ\n   • Vết lớn: Liên hệ dịch vụ sửa chữa'
    },

    // Tài khoản (Account)
    {
        id: 13,
        category: 'account',
        question: 'Làm sao để đổi mật khẩu tài khoản?',
        answer: 'Đổi mật khẩu tài khoản:\n\n1. Trong app:\n   • Vào "Cài Đặt"\n   • Chọn "Đổi Mật Khẩu"\n   • Nhập mật khẩu cũ\n   • Nhập mật khẩu mới (tối thiểu 6 ký tự)\n   • Xác nhận và lưu\n\n2. Quên mật khẩu:\n   • Tại màn hình đăng nhập, chọn "Quên mật khẩu"\n   • Nhập email/số điện thoại đã đăng ký\n   • Nhận mã OTP qua SMS/Email\n   • Nhập mã và tạo mật khẩu mới\n\nLưu ý: Mật khẩu nên có chữ hoa, chữ thường, số và ký tự đặc biệt'
    },
    {
        id: 14,
        category: 'account',
        question: 'Tôi có thể xóa tài khoản không?',
        answer: 'Xóa tài khoản vĩnh viễn:\n\n1. Quy trình:\n   • Vào "Cài Đặt" > "Xóa Tài Khoản"\n   • Đọc kỹ cảnh báo\n   • Xác nhận bằng mật khẩu\n   • Chọn lý do xóa tài khoản\n   • Xác nhận lần cuối\n\n2. Hậu quả:\n   • Mất toàn bộ dữ liệu cá nhân\n   • Không thể khôi phục\n   • Mất điểm tích lũy, ưu đãi\n   • Đơn hàng đang xử lý sẽ bị ảnh hưởng\n\n3. Lưu ý:\n   • Hoàn tất tất cả đơn hàng trước khi xóa\n   • Rút hết số dư trong ví (nếu có)\n   • Tài khoản sẽ bị xóa sau 30 ngày'
    },
    {
        id: 15,
        category: 'account',
        question: 'Làm sao để tích điểm và sử dụng điểm thưởng?',
        answer: 'Hệ thống điểm thưởng:\n\n1. Cách tích điểm:\n   • Mua hàng: 1,000đ = 1 điểm\n   • Đánh giá sản phẩm: +10 điểm\n   • Giới thiệu bạn bè: +50 điểm\n   • Check-in hàng ngày: +2 điểm\n   • Sinh nhật: +100 điểm\n\n2. Sử dụng điểm:\n   • 100 điểm = 10,000đ giảm giá\n   • Đổi voucher ưu đãi\n   • Tham gia minigame\n   • Quà tặng độc quyền\n\n3. Hạng thành viên:\n   • Đồng: 0-999 điểm\n   • Bạc: 1,000-4,999 điểm\n   • Vàng: 5,000-9,999 điểm\n   • Kim cương: 10,000+ điểm\n\nHạng cao = Ưu đãi lớn hơn'
    },

    // Khác (Other)
    {
        id: 16,
        category: 'other',
        question: 'Làm sao để liên hệ với bộ phận hỗ trợ?',
        answer: 'Các kênh hỗ trợ khách hàng:\n\n1. Chat trực tuyến:\n   • Trong app: Tab "Tin Nhắn" > "Hỗ trợ"\n   • Thời gian: 8:00 - 22:00 (Thứ 2 - CN)\n   • Phản hồi trung bình: < 5 phút\n\n2. Hotline:\n   • Số điện thoại: +84 123 456 789\n   • Miễn phí cuộc gọi\n   • 24/7 (có trả lời tự động ngoài giờ)\n\n3. Email:\n   • support@newmwayteakwood.vn\n   • Phản hồi trong 24h\n\n4. Mạng xã hội:\n   • Facebook: fb.com/newmwayteakwood\n   • Instagram: @newmwayteakwood\n\n5. Văn phòng:\n   • 123 Đường ABC, Quận XYZ, TP.HCM\n   • Giờ làm việc: 8:00 - 17:30 (T2-T6)'
    },
    {
        id: 17,
        category: 'other',
        question: 'Ứng dụng hỗ trợ những ngôn ngữ nào?',
        answer: 'Ngôn ngữ được hỗ trợ:\n\n• Tiếng Việt (mặc định)\n• English (Tiếng Anh)\n• 中文 (Tiếng Trung)\n• 日本語 (Tiếng Nhật)\n\nCách đổi ngôn ngữ:\n1. Vào "Cài Đặt"\n2. Chọn "Ngôn Ngữ"\n3. Chọn ngôn ngữ mong muốn\n4. Ứng dụng sẽ tự động khởi động lại\n\nLưu ý: Một số tính năng có thể chưa được dịch hoàn toàn sang ngôn ngữ khác ngoài tiếng Việt.'
    },
    {
        id: 18,
        category: 'other',
        question: 'Tôi có thể mua hàng mà không cần tài khoản không?',
        answer: 'Mua hàng không cần tài khoản:\n\nHiện tại, NEWMWAY yêu cầu đăng ký tài khoản để:\n• Đảm bảo bảo mật thông tin\n• Theo dõi đơn hàng dễ dàng\n• Tích lũy điểm thưởng\n• Lưu lịch sử mua hàng\n• Nhận ưu đãi độc quyền\n\nĐăng ký rất nhanh:\n1. Chỉ cần số điện thoại hoặc email\n2. Xác thực OTP\n3. Hoàn thành trong < 1 phút\n\nỢu điểm khi có tài khoản:\n• Checkout nhanh hơn\n• Quản lý đơn hàng tốt hơn\n• Được hỗ trợ ưu tiên\n• Tham gia chương trình khách hàng thân thiết'
    }
];

export const FAQ_CATEGORIES = [
    { key: 'all', label: 'Tất cả' },
    { key: 'order', label: 'Đặt hàng' },
    { key: 'payment', label: 'Thanh toán' },
    { key: 'shipping', label: 'Giao hàng' },
    { key: 'product', label: 'Sản phẩm' },
    { key: 'account', label: 'Tài khoản' },
    { key: 'other', label: 'Khác' }
];

export const filterFAQByCategory = (category: string): FAQItem[] => {
    if (category === 'all') return FAQ_DATA;
    return FAQ_DATA.filter(item => item.category === category);
};

export const searchFAQ = (query: string): FAQItem[] => {
    if (!query.trim()) return FAQ_DATA;
    
    const lowerQuery = query.toLowerCase().trim();
    return FAQ_DATA.filter(item => 
        item.question.toLowerCase().includes(lowerQuery) ||
        item.answer.toLowerCase().includes(lowerQuery)
    );
};
