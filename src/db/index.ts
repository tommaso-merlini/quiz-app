// import { sql } from "@vercel/postgres";
// import { drizzle } from "drizzle-orm/vercel-postgres";
//
// export const db = drizzle(sql);
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const connectionString =
  "postgres://postgres:g.CA2lnVXMiAlGmwygcps6laRPi0kBJq@monorail.proxy.rlwy.net:38121/railway";

const pool = postgres(connectionString, {
  max: 10, // set the maximum number of connections in the pool
  idle_timeout: 20, // how long a connection can be idle before being closed
});

export const db = drizzle(pool);
