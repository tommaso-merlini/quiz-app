import DynamicForm from "./_components/dynamicForm";
import { redirect } from "next/navigation";
import { getSubjectByID, getTestByID } from "@/db/queries";
import { isRunningTest } from "./actions";
import { auth } from "@/components/lucia/auth";

export default async function Test({ params }: { params: { testID: string } }) {
  const { user } = await auth();
  if (!user) {
    redirect("/");
  }
  const isRunning = await isRunningTest(params.testID);
  if (!isRunning) {
    redirect(`/grades`);
  }
  const test = await getTestByID(params.testID);
  const subject = await getSubjectByID(test.subjectID);
  if (subject.userID != user.id) {
    throw new Error("unauthorized");
  }
  const now = new Date() as any;
  const diff = (now - (test.createdAt as any)) / 1000 / 60;
  const timeLeft = (test.timeInMinutes - diff).toFixed(2);

  return (
    <div className="pb-10">
      <DynamicForm
        time={+timeLeft}
        difficulty={test.difficulty}
        topic={test.topic || undefined}
        questions={test.questions}
        testID={test.id}
        subjectID={test.subjectID}
      />
    </div>
  );
}
