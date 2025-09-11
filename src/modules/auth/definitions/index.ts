import { z } from "zod";
import { JWTPayload } from "jose";

export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim(),
});

export type FormState =
  | {
    errors?: {
      name?: string[];
      email?: string[];
      password?: string[];
    };
    message?: string;
  }
  | undefined;

export interface SessionPayload extends JWTPayload {
  token: string;
  expiresAt: Date;
}
