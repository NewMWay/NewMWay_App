import * as z from 'zod/mini';

export const PhoneSchema = z
  .string().check(
    z.minLength(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
    z.maxLength(15, 'Số điện thoại không được vượt quá 15 ký tự'),
    z.regex(/^\+?[0-9]{10,15}$/, 'Số điện thoại không hợp lệ'),
    z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
  )

export type PhoneSchema = z.infer<typeof PhoneSchema>;