"use server";

import { db } from "@/db";
import { subjects, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSubject(fd: FormData) {
  const userAuth = auth();
  if (!userAuth.userId) {
    throw new Error("not authenticated");
  }

  const name = fd.get("name");
  if (!name) {
    throw new Error("shit");
  }

  const user = (
    await db.select().from(users).where(eq(users.authID, userAuth.userId))
  )[0];
  if (!user) {
    throw new Error("shit");
  }

  await db.insert(subjects).values({
    userID: user.id,
    name: name as string,
  });

  revalidatePath("/subjects");
}
