import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(32),
    SESSION_SECRET: z.string().min(32),
  },
  client: {},
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
});

export const JWT_KEY: Uint8Array = new TextEncoder().encode(env.JWT_SECRET);
export const SESSION_KEY: Uint8Array = new TextEncoder().encode(
  env.SESSION_SECRET
);
