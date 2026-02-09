import * as z from "zod/mini";

export const UsernameSchema = z
    .string().check(
        z.minLength(3, "Tên người dùng phải có ít nhất 3 ký tự"),
        z.maxLength(30, "Tên người dùng không được vượt quá 30 ký tự"),
        z.regex(/^[a-zA-Z0-9_]+$/, "Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới"),
        z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
    )

export type UsernameSchema = z.infer<typeof UsernameSchema>;