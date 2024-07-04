import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QuizApp",
  description: "Generate quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <div className="border-b-[1px] border-neutral-100 py-3 px-4">
            <div className="flex flex-row max-w-[1300px] justify-between mx-auto">
              <Link
                href="/subjects"
                className="flex items-center justify-center"
              >
                <span className="text-xl font-bold">Quizzapp</span>
              </Link>
              <SignedOut>
                <div className="flex flex-row justify-between space-x-4">
                  <SignInButton>
                    <Button size="sm" variant="outline">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button size="sm">Sign Up</Button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
          <div className="max-w-[1300px] mx-auto py-8 px-4">{children}</div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
