import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubjectsWithMaterialsAndQuizCount } from "./_actions/getSubjectsDeep";
import { getUserByAuthID, getUserGoals } from "@/db/queries";
import { CreateSubjectButton } from "./_components/CreateSubjectButton";
import { SubjectCard } from "./_components/SubjectCard";
import UserIntroductionCard from "./_components/UserIntroductionCard";

export default async function Subjects() {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }

  const user = await getUserByAuthID(userAuth.userId);
  if (!user) {
    throw new Error("shit");
  }

  const goals = await getUserGoals(user.id);

  const subjects = await getUserSubjectsWithMaterialsAndQuizCount(user.id);

  return (
    <div className="sm:pt-14 pt-0">
      {
        <>
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-semibold mb-6 flex items-center underline decoration-yellow-300 decoration-4 decoration-solid">
              My Subjects
            </h1>

            <CreateSubjectButton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard subject={subject} key={subject.id} />
            ))}
          </div>

          {subjects.length === 0 && (
            <h1 className="text-center mt-40">No Subject Found</h1>
          )}
        </>
      }
      {/*!goals && (
        <>
          <UserIntroductionCard />
        </>
      )*/}
    </div>
  );
}
