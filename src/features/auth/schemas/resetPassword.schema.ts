import * as z from 'zod';
import { PasswordSchema } from '../../../services/validation/schemas/auth/password.schema';
import { ConfirmPasswordSchema } from '../../../services/validation/schemas/auth/confirmPassword.schema';


export const ResetPasswordSchema = z.object({
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
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

export type ResetPasswordFormSchema = z.infer<typeof ResetPasswordSchema>;