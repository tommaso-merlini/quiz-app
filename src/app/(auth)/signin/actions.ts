"use server";

import { getUserByEmail } from "@/db/queries";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/components/lucia/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Incorrect email or password" };
  }

  const validPassword = await verify(existingUser.hashedPassword, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return { error: "Incorrect email or password" };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/subjects");
}
