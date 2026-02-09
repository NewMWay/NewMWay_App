import * as z from 'zod';

export const UsernameOrEmailSchema = z
    .string().check(
        z.minLength(1, 'Tên người dùng hoặc email không được để trống'),
        z.maxLength(255, 'Tên người dùng hoặc email không được vượt quá 255 ký tự'),
        z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
    );
export type UsernameOrEmailSchema = z.infer<typeof UsernameOrEmailSchema>;