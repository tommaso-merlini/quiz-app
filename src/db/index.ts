// import { sql } from "@vercel/postgres";
// import { drizzle } from "drizzle-orm/vercel-postgres";
//
// export const db = drizzle(sql);
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("POSTGRES URL NOT FOUND IN ENV FILE");
}

const pool = postgres(connectionString, {
  max: 10, // set the maximum number of connections in the pool
  idle_timeout: 20, // how long a connection can be idle before being closed
});

export const db = drizzle(pool);
