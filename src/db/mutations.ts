"use server";

import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { db } from ".";
import { materials } from "./schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { VercelPgQueryResultHKT } from "drizzle-orm/vercel-postgres";

type TransactionType = PgTransaction<
  VercelPgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export async function deleteMaterial(materialID: number, tx?: TransactionType) {
  const queryBuilder = tx || db;
  await queryBuilder.delete(materials).where(eq(materials.id, materialID));
}
