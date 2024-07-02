import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { grades } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserByAuthID, getUserGrades } from "@/db/queries";
import { Answer } from "@/types";
import { formatDate } from "@/utils/formatDate";
import GradesTable from "./_components/gradesTable";

function getScore(answers: Answer[]) {
  let score = 0;
  answers.map((a) => {
    if (a.isCorrect) {
      score++;
    }
  });
  return score;
}

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
