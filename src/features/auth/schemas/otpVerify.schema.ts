import * as z from 'zod';
import { OtpSchema } from '../../../services/validation/schemas/auth/otp.schema';

export const OtpVerifySchema = z.object({
    otp: OtpSchema,
})

export type OtpVerifyFormSchema = z.infer<typeof OtpVerifySchema>;
