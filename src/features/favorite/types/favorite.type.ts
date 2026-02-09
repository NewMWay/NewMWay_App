export interface GetFavoriteProductsRequest {
    pageNumber: number
    pageSize: number
}

export interface GetFavoriteProductsResponse {
    size: number
    page: number
    total: number
    totalPages: number
    items: FavoriteProduct[]
}

export interface FavoriteProduct {
    id: string
    name: string
    description: string
    isHot: boolean
    thumbnail: string
    warranty: string
    oldPrice?: number
    price: number
    sold: number
    createdDate: string
    lastModifiedDate: string
    categoryID: string
    categoryName: string
    categoryDescription: string
    categoryIcon: string
    isActive: boolean
    isHasVariants: boolean
    rating: number
}

export interface AddFavoriteProductRequest {
    productId: string
}


// {
//   "status": 200,
//   "message": "Lấy danh sách sản phẩm yêu thích thành công",
//   "data": {
//     "size": 10,
//     "page": 1,
//     "total": 1,
//     "totalPages": 1,
//     "items": [
//       {
//         "id": "9a07d67e-c35f-424a-b023-70caf7337190",
//         "name": "Thớt Gỗ Teak NEW M WAY Đầu Cây dài 40cm",
//         "description": "<p>I / Thông tin sản phẩm</p><p>Thớt gỗ Teak Thương Hiệu New M Way - An Toàn- Bền- Đẹp</p><p>BẢO HÀNH 1 ĐỔI 1 TRONG 7 NGÀY</p><p>Thớt gỗ teak New M Way được khai thác và sản xuất nguyên chất từ Gỗ rừng trồng Teak (tiếng việt gọi là Giá Tỵ) dùng để chế biến thực phẩm, đựng và trang trí thức ăn theo phong cách phương tây, dọn lên bàn cùng những món BBQ, Beefsteak ...góp phần làm cho bữa ăn, bữa tiệc thêm phần trang trọng.</p><p>- Thớt gỗ teak newway đã và đang có mặt trên khắp các căn bếp Mỹ, vậy thì ko có lí do j các bà nội trợ Việt còn chừng chừ khi chưa trải nghiệm sản phẩm giá trị này.</p><p>II/ Thiết kế</p><p>Thới gỗ Teak với thiết kế sang trong, tinh tế,chất liệu bền đạt chuẩn an toàn, giá thành phải chăng thì đã đến lúc các bà nội trợ thổi 1 luồng gió mới vào căn bếp của mình, từ đó có càng nhiều cảm hứng, ý tưởng nấu những món ngon cho gia đình. Đây không còn là thớt nữa, nó là một món quà của rừng.</p><p>Đừng so sánh thớt gỗ teak với các sản phẩm khác.</p><p>Thớt teak newway ở một đẳng cấp khác.</p><p>Khuyến khích mua 1 bộ 3 cái đủ kích cỡ để có giá tốt nhất.</p><p>III/ Thuộc tính sản phẩm</p><p>Xuất xứ : Việt Nam</p><p>Chất liệu : 100% gỗ rừng trồng Teak tại Lào</p><p>IV/ Hướng dẫn sử dụng và bảo quản thớt</p><p>- Sau khi sử dụng, rửa sản phẩm bằng vải mềm hoặc miếng bọt biển</p><p>- Lau bằng vải khô để loại bỏ nước trước khi bảo quản nơi khô ráo thoáng mát</p><p>- Thớt thái, băm, hạn chế chặt</p><p>- Dùng 1 tuần bôi dầu 1 lần sẽ liền vết xước mặt thớt và thắm màu</p><p>- Không dùng được máy rửa chén</p><p>🆘🆘 Lưu ý về size</p><p>-------Mỏng 2,5cm ( thái sắt)</p><p>-------Dày 3,8cm ( chặt gà vịt) </p><p>Kích thước lớn hơn mời khách inbox em đặt hàng ạ, bao nhiêu cũng sản xuất ạ</p><p><br></p><p>#thot, #thot_go_nghien, #thot_go, #thot_go_teak, #thot_nhua, #thot_inox, #thot_kinh_cuong_luc, #thot_nghien, #thot_nhua_cong_nghiep, #thot_go_decor, #thot_inox_304, #thot_tre, #thot_go_teak_kaiyo, #thot_khang_khuan, #thot_nghien_tay_bac, #thot_nhua_cao_cap, #thot_cuong_luc, #thot_teak, #new_m_way, #thot_new_m_way, #thot_go_new_m_way</p>",
//         "isHot": false,
//         "thumbnail": "https://down-vn.img.susercontent.com/file/vn-11134201-23020-x7095d8rx2nvf9.webp",
//         "warranty": "<p><strong>Thời gian áp dụng:</strong></p><ol><li><span contenteditable=\"false\"></span>Hỗ trợ đổi trả/hoàn tiền trong vòng <strong>15 ngày</strong> kể từ khi nhận hàng (áp dụng theo chính sách \"Trả hàng miễn phí\" của Shopee).</li></ol><p><strong>Điều kiện được bảo hành/đổi mới:</strong></p><ol><li><span contenteditable=\"false\"></span><strong>Lỗi vận chuyển:</strong> Sản phẩm bị nứt, vỡ, móp méo nặng khi vừa nhận hàng.</li><li><span contenteditable=\"false\"></span><strong>Lỗi nhà sản xuất:</strong></li><li><span contenteditable=\"false\"></span>Nắp hộp bị vênh, không đóng chặt được vào thân hộp.</li><li><span contenteditable=\"false\"></span>Nhựa bị biến dạng hoặc có mùi lạ bất thường khi chưa sử dụng.</li><li><span contenteditable=\"false\"></span><strong>Sai sót đơn hàng:</strong> Giao sai màu, sai kích thước hoặc thiếu số lượng so với đơn đặt.</li></ol><p><strong>Quy trình khiếu nại:</strong></p><ol><li><span contenteditable=\"false\"></span><strong>QUAN TRỌNG:</strong> Quý khách vui lòng <strong>quay video clip</strong> toàn bộ quá trình mở kiện hàng (unbox) để làm bằng chứng đối chiếu nhanh nhất.</li><li><span contenteditable=\"false\"></span>Sản phẩm đổi trả yêu cầu phải <strong>chưa qua sử dụng</strong>, chưa đựng thực phẩm và còn nguyên bao bì/tem mác (nếu có).</li><li><span contenteditable=\"false\"></span>Liên hệ ngay với Shop qua mục \"Chat\" nếu gặp bất kỳ vấn đề nào nêu trên để được hỗ trợ bù hàng hoặc hoàn tiền.</li></ol>",
//         "oldPrice": 538000,
//         "price": 455043,
//         "sold": 0,
//         "createdDate": "2025-12-09T00:49:59.0469442",
//         "lastModifiedDate": "2025-12-09T00:51:20.9443687",
//         "categoryID": "e0b7804b-59d0-4e66-801a-08de3680399d",
//         "categoryName": "Thớt gỗ",
//         "categoryDescription": "",
//         "categoryIcon": "",
//         "isActive": true,
//         "isHasVariants": true,
//         "rating": 0
//       }
//     ]
//   }
// }