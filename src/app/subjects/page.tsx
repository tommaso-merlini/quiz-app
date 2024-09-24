import { redirect } from "next/navigation";
import { getUserSubjectsWithMaterialsAndTestCount } from "./_actions/getSubjectsDeep";
import { getUserGrades } from "@/db/queries";
import { CreateSubjectButton } from "./_components/CreateSubjectButton";
import { SubjectCard } from "./_components/SubjectCard";
import Chart from "./_components/Chart";
import { UserGrades } from "../grades/_components/gradesTable";
import { auth } from "@/components/lucia/auth";
import { Library, LibrarySquare } from "lucide-react";

export default async function Subjects() {
  const { user } = await auth();
  if (!user) {
    redirect("/");
  }
  if (!user.isSubscribed && !user.canUseFreely) {
    redirect("/pricing");
  }

  const subjects = await getUserSubjectsWithMaterialsAndTestCount(user.id);
  const grades: UserGrades = await getUserGrades(user.id);

  return (
    <div className="sm:pt-14 pt-0">
      {
        <>
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-semibold mb-6 flex items-center underline decoration-yellow-300 decoration-4 decoration-solid">
              <span>My Subjects</span>
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
          <div className="mt-10">
            <Chart grades={grades} />
          </div>
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
