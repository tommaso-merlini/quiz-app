import { auth } from "@clerk/nextjs/server";
import { InstantQuizBox } from "./_components/InstantQuizBox";
import { Navbar } from "./_components/Navbar";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Home() {
  const user = auth();
  if (user.userId) {
    redirect("/subjects");
  }

  return (
    <>
      {/*<div className="bg-blue-500 h-96">
        <Navbar />
        <p className="w-full text-center text-5xl text-white font-black py-4">
          AI QUIZ GENERATOR
        </p>
      </div>
      <InstantQuizBox />*/}
    </>
  );
}
