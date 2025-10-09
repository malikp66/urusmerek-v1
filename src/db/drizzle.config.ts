// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { existsSync } from "node:fs";

existsSync(".env.local") ? config({ path: ".env.local" }) : config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl, // pastikan mengandung ?sslmode=require
    // ssl: true  // optional; url + NODE_TLS_REJECT_UNAUTHORIZED=0 sudah cukup
  },
  verbose: true,
});
