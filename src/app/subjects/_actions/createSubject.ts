"use server";

import { auth } from "@/components/lucia/auth";
import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createSubject(fd: FormData) {
  const name = fd.get("name");
  if (!name) {
    throw new Error("shit");
  }

  const { user } = await auth();
  if (!user) {
    throw new Error("not authenticated");
  }

  await db.insert(subjectsTable).values({
    id: uuidv4(),
    userID: user.id,
    name: name as string,
  });

  revalidatePath("/subjects");
}
