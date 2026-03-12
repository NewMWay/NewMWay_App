import * as z from 'zod';
import { EmailSchema } from '../../../services/validation/schemas/auth/email.schema';

export const SendOtpSchema = z.object({
    email: EmailSchema,
    type: z.enum(['Register', 'ForgetPassword']),
});

export type SendOtpFormSchema = z.infer<typeof SendOtpSchema>;