import { redirect } from "next/navigation";
import { getUserGrades } from "@/db/queries";
import GradesTable from "./_components/gradesTable";
import { auth } from "@/components/lucia/auth";

export default async function Grades() {
  const { user } = await auth();
  if (!user) {
    redirect("/");
  }
  if (!user.canUseFreely && !user.isSubscribed) {
    redirect("/pricing");
  }

  const grades = await getUserGrades(user.id);

  return (
    <div>
      <GradesTable grades={grades} />
    </div>
  );
}
