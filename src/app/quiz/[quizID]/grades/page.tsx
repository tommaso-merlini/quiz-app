import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { grades } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Quiz({
  params,
}: {
  params: { subjectID: number; quizID: number };
}) {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }
  const userGrades = await db
    .select()
    .from(grades)
    .where(eq(grades.quizID, params.quizID));
  return (
    <div>
      {userGrades.length > 0 &&
        userGrades.map((g, k) => (
          <Link href={`/quiz/${params.quizID}/grades/${g.id}`} key={k}>
            {g.id}
          </Link>
        ))}
      {userGrades.length === 0 && (
        <div>
          <h1>No grades found for this quiz</h1>
          <Link href="/subjects">
            <Button>Go to subjects</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
