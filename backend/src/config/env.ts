import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Defaults to "production" — fail safe if NODE_ENV is not explicitly set
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("production"),
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((i) => `  ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${formatted}`);
}

export const env: Env = parsed.data;
