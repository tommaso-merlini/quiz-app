import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubjectsWithMaterialsAndQuizCount } from "./_actions/getSubjectsDeep";
import { getUserByAuthID } from "@/db/queries";
import { CreateSubjectButton } from "./_components/CreateSubjectButton";
import { SubjectCard } from "./_components/SubjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Subjects() {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }

  const user = await getUserByAuthID(userAuth.userId);
  if (!user) {
    throw new Error("shit");
  }

  const subjects = await getUserSubjectsWithMaterialsAndQuizCount(user.id);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
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
    </div>
  );
}
