import * as z from 'zod/mini';

export const ConfirmPasswordSchema = z
  .string()
  .check(
    z.minLength(8, 'Mật khẩu xác nhận phải có ít nhất 8 ký tự'),
    z.maxLength(128, 'Mật khẩu xác nhận không được vượt quá 128 ký tự'),
    z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
  );

export type ConfirmPasswordSchema = z.infer<typeof ConfirmPasswordSchema>;  
