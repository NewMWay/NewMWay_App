import * as z from 'zod/mini';

export const OtpSchema = z
  .string()
  .check(
    z.minLength(5, 'Mã OTP phải có ít nhất 5 ký tự'),
    z.maxLength(5, 'Mã OTP không được vượt quá 5 ký tự'),
    z.trim() // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
  );

export type OtpSchema = z.infer<typeof OtpSchema>;