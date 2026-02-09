import { Dimensions, Platform } from "react-native";

const getScreenWidth = () => Dimensions.get("window").width;

export const isTablet = () => getScreenWidth() >= 768;
export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const ifTablet = <T>(tabletValue: T, defaultValue: T): T =>
  isTablet() ? tabletValue : defaultValue;

// Tùy chọn: Lắng nghe thay đổi kích thước
Dimensions.addEventListener("change", () => {
  console.log("Chiều rộng màn hình đã cập nhật:", getScreenWidth());
});