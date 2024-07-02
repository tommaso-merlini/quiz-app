import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" });
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.POSTGRES_URL,
    url: "postgres://postgres:g.CA2lnVXMiAlGmwygcps6laRPi0kBJq@monorail.proxy.rlwy.net:38121/railway",
  },
});
