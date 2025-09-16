import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const DEFAULT_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(32),
    SESSION_SECRET: z.string().min(32),
    API_BASE_URL: z.string().url().default(DEFAULT_BASE_URL),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    API_BASE_URL: process.env.API_BASE_URL ?? DEFAULT_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
});

export const JWT_KEY: Uint8Array = new TextEncoder().encode(env.JWT_SECRET);
export const SESSION_KEY: Uint8Array = new TextEncoder().encode(
  env.SESSION_SECRET
);
