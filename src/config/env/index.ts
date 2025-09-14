import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const BASE_URL_DEFAULT = "http://localhost:3000";

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be ≥ 32 chars"),
    SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be ≥ 32 chars"),
    API_BASE_URL: z.string().url().default(BASE_URL_DEFAULT),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().default(BASE_URL_DEFAULT),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

export const JWT_KEY: Uint8Array = new TextEncoder().encode(env.JWT_SECRET);
export const SESSION_KEY: Uint8Array = new TextEncoder().encode(env.SESSION_SECRET);