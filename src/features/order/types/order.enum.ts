export enum OrderStatus {
    Pending = 'Đang xử lý',
    Confirmed = 'Đã xác nhận',
    Delivered = 'Đang giao hàng',
    Cancelled = 'Đã hủy',
    Completed = 'Hoàn thành',
}

export enum OrderType {
    Cod = 'Thanh toán khi nhận hàng',
    Online = 'Thanh toán trực tuyến',
}