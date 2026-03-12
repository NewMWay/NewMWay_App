import * as z from 'zod';
import { PasswordSchema } from '../../../services/validation/schemas/auth/password.schema';
import { ConfirmPasswordSchema } from '../../../services/validation/schemas/auth/confirmPassword.schema';

export const NewPasswordSchema = z.object({
    newPassword: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'],
            message: 'Mật khẩu xác nhận không khớp',
        });
    }
});

export type NewPasswordFormSchema = z.infer<typeof NewPasswordSchema>;
