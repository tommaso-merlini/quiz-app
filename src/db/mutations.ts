"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { materials } from "./schema";

export async function deleteMaterial(materialID: number) {
  await db.delete(materials).where(eq(materials.id, materialID));
}
