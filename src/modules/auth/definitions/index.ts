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
}

export interface AccessTokenPayload extends JWTPayload {
  userId: string;
}

export interface RefreshTokenPayload extends JWTPayload {
  userId: string;
  jti: string;
}
