import * as z from "zod/mini";

export const EmailSchema = z
    .string().check(
        z.minLength(1, "Email không được để trống"),
        z.maxLength(255, "Email không được vượt quá 255 ký tự"),
        z.email("Email không hợp lệ"),
        z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
    )

export type EmailSchema = z.infer<typeof EmailSchema>;