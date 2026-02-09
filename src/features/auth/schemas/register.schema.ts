import * as z from 'zod';
import { UsernameSchema } from '../../../services/validation/schemas/auth/username.schema';
import { EmailSchema } from '../../../services/validation/schemas/auth/email.schema';
import { PhoneSchema } from '../../../services/validation/schemas/auth/phone.schema';
import { PasswordSchema } from '../../../services/validation/schemas/auth/password.schema';
import { ConfirmPasswordSchema } from '../../../services/validation/schemas/auth/confirmPassword.schema';
// import { OtpSchema } from '../../../services/validation/schemas/auth/otp.schema';

export const RegisterSchema = z.object({
    username: UsernameSchema,
    email: EmailSchema,
    phone: PhoneSchema,
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
    // otp: OtpSchema
}).superRefine((data, ctx) => {
    // Use superRefine so we can attach the error to the `confirmPassword` field
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'],
            message: 'Mật khẩu xác nhận không khớp',
        });
    }
});

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;