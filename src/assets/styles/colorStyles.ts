export const Colors = {
  // 🌌 Màu chính (Primary Theme)
  primary: '#935934', // Màu nâu đất ấm áp, dùng làm màu chủ đạo
  primaryDark: '#0A2353', // Xanh biển đậm hơn, dùng làm nền đậm, header dark mode
  primaryLight: '#56E1E9', // Xanh ngọc sáng, dùng làm màu nhấn (accent), button nổi bật

  // 🔤 Màu chữ (Text Colors)
  textWhite: '#FFFFFF', // Trắng, dùng cho chữ trên nền tối
  textDark: '#000000', // Dùng cho text đậm trên nền sáng
  textGray: '#B0B0B0', // Xám trung tính, dùng cho chữ phụ, mô tả
  textBeige: '#DDC2B5', // Màu be nhạt, dùng cho chữ phụ trên nền tối
  textPrimary: '#56E1E9', // Xanh ngọc, chữ tiêu đề hoặc phần nổi bật
  textSecondary: '#BB63FF', // Tím sáng, chữ phụ hoặc mô tả
  textDisabled: '#5B58EB', // Tím nhạt, chữ không hoạt động

  // 🔲 Màu viền, border, icon
  border: '#5B58EB', // Tím mộng mơ, dùng cho border hoặc icon
  borderLight: '#56E1E9', // Viền nổi bật khi hover/focus

  // 🧩 Card màu (cho danh mục, sản phẩm...)
  card1Bg: '#0A2353', // Card 1: nền xanh đậm, tạo chiều sâu
  card1Text: '#56E1E9', // Chữ sáng nổi bật trên nền card

  card2Bg: '#5B58EB', // Card 2: nền tím mộng mơ
  card2Text: '#FFFFFF', // Chữ trắng cho tương phản

  card3Bg: '#BB63FF', // Card 3: nền tím hồng neon
  card3Text: '#112C71', // Chữ xanh đậm cho cân bằng

  // 🧭 Màu trạng thái
  disabledBg: '#1a1a2e', // Màu nền disabled (tối hơn)
  disabledText: '#5B58EB', // Text màu disabled

  // 🎯 Màu cho CTA (Call to Action)
  buttonPrimary: '#56E1E9', // CTA chính (Mua ngay, Thêm vào giỏ)
  buttonHover: '#BB63FF', // Hover hiệu ứng tím neon

  // 🌀 Màu cho hiệu ứng Glow/Outline
  glow: '#56E1E980', // Xanh ngọc có opacity, dùng cho hiệu ứng sáng

  // Màu bottom tab
  bottomTab: '#31BBC3', // xanh ngọc sáng, dùng cho thanh tab dưới
  gray: '#B0B0B0', // Màu xám trung tính, dùng cho các thành phần không quan trọng
  grayDark: '#7A7A7A', // Màu xám đậm, dùng cho nền phụ hoặc viền
  grayLight: '#EDEDED', // Màu xám nhạt, dùng cho nền chính hoặc vùng lớn

  success: '#38A169', // Màu xanh lá cây tươi, dùng cho trạng thái thành công
  error: '#DC2626', // Màu đỏ tươi, dùng cho trạng thái lỗi
  info: '#1C304A', // Màu xanh dương sáng, dùng cho thông tin chung
  warning: '#F59E0B',
  pricePrimary: '#ee4d2dff', // Màu đỏ cam nổi bật, dùng cho giá sản phẩm
  priceBackground: '#ff57221a', // Màu nền nhẹ nhàng cho vùng giá
};

export const Gradients = {
  // Gradient nền chính của app, tạo chiều sâu và cảm giác "dưới nước"
  backgroundPrimary: ['#111111', '#313131'],

  // Gradient nhẹ cho vùng card hoặc highlight background
  highlight: ['#5B58EB', '#BB63FF'],

  // CTA button hoặc vùng nhấn
  cta: ['#56E1E9', '#BB63FF'],

  // Gradient glassmorphism nếu dùng hiệu ứng kính mờ
  glassEffect: ['#FFFFFF10', '#56E1E930'],
};

