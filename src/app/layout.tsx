import type { Metadata } from "next";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { auth, lucia } from "@/components/lucia/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Library, AreaChart, LibrarySquare } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

async function logout() {
  "use server";
  const { session } = await auth();
  if (!session) {
    throw new Error("Unauthorized");
    // return {
    //   error: "Unauthorized",
    // };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/");
}

export const metadata: Metadata = {
  title: "SlayTest",
  description:
    "Turn your notes into tests that actually prep you for exams. Upload once, practice infinitely.",
  icons: {
    icon: "favicon.ico",
  },
};
// <LibrarySquare className="mr-2 size-8" />

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await auth();
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <div className="border-b-[1px] border-neutral-100 py-3 px-4">
          <div className="flex flex-row max-w-[1300px] justify-between mx-auto">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/books.png"
                width={30}
                height={30}
                alt="SlayTest"
                className="mr-1"
              />
              <span className="text-2xl font-bold">SlayTest</span>
            </Link>
            {!user ? (
              <div className="flex flex-row justify-between space-x-4">
                <Link href="/signin">
                  <Button size="sm" variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="secondary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">My Profile</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/subjects">
                    <DropdownMenuItem>
                      <Library className="mr-2 h-4 w-4" />
                      <span>Subjects</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/grades">
                    <DropdownMenuItem>
                      <AreaChart className="mr-2 h-4 w-4" />
                      <span>Grades</span>
                    </DropdownMenuItem>
                  </Link>
                  <form action={logout} className="w-full">
                    <button type="submit" className="w-full">
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="max-w-[1300px] mx-auto py-8 px-4">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
