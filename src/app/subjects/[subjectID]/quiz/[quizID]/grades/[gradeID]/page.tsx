import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getQuizById } from "@/db/queries";
import { grades } from "@/db/schema";
import { QuizContent } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Quiz({
  params,
}: {
  params: { subjectID: number; quizID: number; gradeID: number };
}) {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }
  const quiz = await getQuizById(params.quizID);
  const questions = quiz.content as QuizContent;
  if (!quiz) {
    throw new Error("shit");
  }
  const grade = (
    await db.select().from(grades).where(eq(grades.id, params.gradeID)).limit(1)
  )[0];
  if (!grade) {
    throw new Error("shit");
  }

  const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  let score = 0;
  grade.answers.map((c: any) => {
    if (c.isCorrect) {
      score++;
    }
  });

  return (
    <div className="space-y-4 max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Badge className={getDifficultyColor(quiz.difficulty)}>
            {quiz.difficulty} difficulty
          </Badge>
          {quiz.topic && <Badge variant="outline">{quiz.topic}</Badge>}
        </div>
        <Badge variant="secondary" className="text-lg">
          Score: {score}/{quiz.questions}
        </Badge>
      </div>
      {grade.answers.map((answer: any, index: number) => (
        <div
          key={index}
          className={`space-y-4 border-4 p-4 rounded ${
            answer.isCorrect
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
          }`}
        >
          <h3 className="text-lg font-semibold">{questions[index].topic}</h3>
          <p className="text-md">{questions[index].question}</p>
          <div>
            <p>
              <strong>Your Answer:</strong> {answer.userAnswer}
            </p>
            <p>
              <strong>Correct Answer:</strong> {answer.correctAnswer}
            </p>
          </div>
        </div>
      ))}
      <Link href={`/subjects/${params.subjectID}`}>
        <Button>Return to subject</Button>
      </Link>
    </div>
  );
}
