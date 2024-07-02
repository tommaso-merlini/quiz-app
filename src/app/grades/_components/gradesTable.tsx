"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Answer } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getUserGrades } from "@/db/queries";
import { useRouter } from "next/navigation";

function getScore(answers: Answer[]) {
  let score = 0;
  answers.map((a) => {
    if (a.isCorrect) {
      score++;
    }
  });
  return score;
}

export type UserGrades =
  ReturnType<typeof getUserGrades> extends Promise<infer T> ? T : never;

export default function GradesTable({ grades }: { grades: UserGrades }) {
  const router = useRouter();

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent grades.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow
              onClick={() => {
                router.push(`/grades/${grade.grade.id}`);
              }}
              key={grade.grade.id}
              className="cursor-pointer"
            >
              <TableCell className="font-semibold">
                {grade.subject.name}
              </TableCell>
              <TableCell>{grade.quiz.topic}</TableCell>
              <TableCell>
                {getScore(grade.grade.answers as Answer[])}/
                {grade.quiz.questions}
              </TableCell>
              <TableCell>{grade.quiz.questions} questions</TableCell>
              <TableCell>{grade.quiz.time} time</TableCell>
              <TableCell>{grade.quiz.difficulty}</TableCell>
              <TableCell className="text-right">
                {formatDate(grade.grade.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
