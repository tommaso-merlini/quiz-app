import { auth } from "@/components/lucia/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { getTestByID } from "@/db/queries";
import { gradesTable } from "@/db/schema";
import { Answer } from "@/types";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Grade({
  params,
}: {
  params: { gradeID: string };
}) {
  const { user } = await auth();
  if (!user) {
    redirect("/");
  }
  const grade = (
    await db
      .select()
      .from(gradesTable)
      .where(eq(gradesTable.id, params.gradeID))
      .limit(1)
  )[0];
  if (!grade) {
    throw new Error("shit");
  }
  const test = await getTestByID(grade.testID);
  const questions = test.questions;
  const answers = grade.answers as Answer[];

  const getDifficultyColor = (
    difficulty: "easy" | "medium" | "hard" | "impossible",
  ) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      case "impossible":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  let score = 0;
  answers.map((c: any) => {
    if (c.isCorrect) {
      score++;
    }
  });

  return (
    <div className="space-y-4 max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Badge className={getDifficultyColor(test.difficulty)}>
            {test.difficulty} difficulty
          </Badge>
          {test.topic && <Badge variant="outline">{test.topic}</Badge>}
        </div>
        <Badge variant="secondary" className="text-lg">
          Score: {score}/{test.questionsQty}
        </Badge>
      </div>
      {answers.map((answer, index: number) => (
        <Card key={index} className={`space-y-4`}>
          <CardHeader>
            <CardTitle>{questions[index].topic}</CardTitle>
            <CardDescription className="text-md">
              {questions[index].question}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{answer.userAnswer}</p>
            {!answer.isCorrect && (
              <div className="bg-red-100 border-[2px] border-red-300 rounded p-4 mt-4">
                {answer.correctAnswer}
              </div>
            )}
            {answer.isCorrect && questions[index].type === "openEnded" && (
              <div className="bg-yellow-100 border-[2px] border-yellow-300 rounded p-4 mt-4">
                {answer.correctAnswer}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <br />
      <div className="flex flex-row justify-end space-x-4">
        <Link href={`/subjects`}>
          <Button variant="outline">Return to subject</Button>
        </Link>
        <Link href={`/grades`}>
          <Button>Return to grades</Button>
        </Link>
      </div>
    </div>
  );
}
