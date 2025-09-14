import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
    API_BASE_URL: z.string().url().default("http://localhost:3000"),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});