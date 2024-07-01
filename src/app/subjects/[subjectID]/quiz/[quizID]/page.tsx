import { auth } from "@clerk/nextjs/server";
import DynamicForm from "./_components/dynamicForm";
import { redirect } from "next/navigation";
import { getQuizById, getSubjectByID, getUserByAuthID } from "@/db/queries";
import { getRunningQuizID } from "@/app/subjects/_actions/getRunningQuizID";

export default async function Quiz({
  params,
}: {
  params: { subjectID: number; quizID: number };
}) {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }
  const runningQuizID = await getRunningQuizID(params.subjectID);
  if (!runningQuizID) {
    // redirect(`/subjects/${params.subjectID}/quiz/${params.quizID}/grades`);
  }
  if (runningQuizID != params.quizID) {
    throw new Error("shit");
  }
  const quiz = await getQuizById(runningQuizID);
  const subject = await getSubjectByID(params.subjectID);
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
    <DynamicForm
      time={+timeLeft}
      difficulty={quiz.difficulty}
      topic={quiz.topic || undefined}
      questions={quiz.content as any}
      quizID={quiz.id}
      subjectID={subject.id}
    />
  );
}
