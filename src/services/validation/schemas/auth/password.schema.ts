import * as z from "zod/mini";

export const PasswordSchema = z
    .string().check(
        z.minLength(8, "Mật khẩu phải có ít nhất 8 ký tự"),
        z.maxLength(128, "Mật khẩu không được vượt quá 128 ký tự"),
        z.regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa"),
        z.regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường"),
        z.regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số"),
        z.regex(/[\W_]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
        z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
    )

export type PasswordSchema = z.infer<typeof PasswordSchema>;