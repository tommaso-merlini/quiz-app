import { auth } from "@clerk/nextjs/server";
import DynamicForm from "./_components/dynamicForm";
import { redirect } from "next/navigation";
import { getQuizById, getSubjectByID, getUserByAuthID } from "@/db/queries";
import { isRunningQuiz } from "./actions";

export default async function Quiz({ params }: { params: { quizID: number } }) {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/");
  }
  const isRunning = await isRunningQuiz(params.quizID);
  if (!isRunning) {
    redirect(`/grades`);
  }
  const quiz = await getQuizById(params.quizID);
  const subject = await getSubjectByID(quiz.subjectID);
  if (quiz.subjectID != subject.id) {
    throw new Error("shit");
  }
  const user = await getUserByAuthID(userAuth.userId);
  if (subject.userID != user.id) {
    throw new Error("shit");
  }
  const now = new Date() as any;
  const diff = (now - (quiz.createdAt as any)) / 1000 / 60;
  const timeLeft = (quiz.time - diff).toFixed(2);

  return (
    <div className="pb-10">
      <DynamicForm
        time={+timeLeft}
        difficulty={quiz.difficulty}
        topic={quiz.topic || undefined}
        questions={quiz.content as any}
        quizID={quiz.id}
        subjectID={subject.id}
      />
    </div>
  );
}
