import * as z from "zod/mini";
import { PasswordSchema } from "../../../services/validation/schemas/auth/password.schema";
import { UsernameOrEmailSchema } from "../../../services/validation/schemas/auth/userNameOrEmail.schema";

export const LoginSchema = z.object({
  usernameOrEmail: UsernameOrEmailSchema,
  password: PasswordSchema,
});

export type LoginFormSchema = z.infer<typeof LoginSchema>;