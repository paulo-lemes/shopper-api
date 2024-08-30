import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  GEMINI_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  TEST_DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
