"use server";
import { redirect } from "next/navigation";
import { lucia } from "@/components/lucia/auth";
import { cookies } from "next/headers";
import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { usersTable } from "@/db/schema";
import { hash } from "@node-rs/argon2";
import { sql } from "drizzle-orm";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    let user;

    await db.transaction(async (tx) => {
      const [insertedUser] = await tx
        .insert(usersTable)
        .values({
          id: uuidv4(),
          email,
          hashedPassword: passwordHash,
        })
        .returning();

      user = insertedUser;
      if (!user) {
        throw new Error("Failed to create user");
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred during signup. Please try again." };
  } finally {
    return redirect("/pricing");
  }
}
