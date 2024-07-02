import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByAuthID, getUserGrades } from "@/db/queries";
import GradesTable from "./_components/gradesTable";

export default async function Grades() {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }
  const user = await getUserByAuthID(userAuth.userId);
  const grades = await getUserGrades(user.id);

  return (
    <div>
      <GradesTable grades={grades} />
    </div>
  );
}
