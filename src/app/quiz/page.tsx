import { GenerateQuiz } from "@/ai/generateQuiz";
import getSimilarSubjectEmbeddings from "@/ai/similarSubjectEmbeddings";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/db";
import { getSubjectByID, getUserByAuthID } from "@/db/queries";
import { quizzes } from "@/db/schema";
import languages from "@/utils/languages";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

async function createQuiz(fd: FormData) {
  "use server";

  const FormDataSchema = z.object({
    subjectID: z.string(),
    language: z.enum(languages),
    questions: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    topic: z.string(),
    time: z.string(),
  });

  const formDataObject = {
    subjectID: fd.get("subjectID"),
    language: fd.get("language"),
    questions: fd.get("questions"),
    difficulty: fd.get("difficulty"),
    time: fd.get("time"),
    topic: fd.get("topic"),
  };

  const validatedData = FormDataSchema.parse(formDataObject);

  const userAuth = auth();
  if (!userAuth.userId) {
    throw new Error("shit");
  }

  const res = await getSimilarSubjectEmbeddings(
    validatedData.topic,
    +validatedData.subjectID,
  );
  if (res.length === 0) {
    alert("no similar embeddings found");
    return;
  }
  const context: any = [];
  res.map((r) => {
    context.push({
      type: "text",
      text: r.content,
    });
  });

  const { questionTypes } = await GenerateQuiz(context, {
    questions: +validatedData.questions,
    language: validatedData.language,
    difficulty: validatedData.difficulty,
  });
  const q = (
    await db
      .insert(quizzes)
      .values({
        subjectID: +validatedData.subjectID,
        content: questionTypes,
        language: validatedData.language,
        difficulty: validatedData.difficulty,
        time: +validatedData.time,
        questions: +validatedData.questions,
        topic: validatedData.topic,
      })
      .returning()
  )[0];
  if (!q) {
    throw new Error("shit");
  }

  redirect(`/quiz/${q.id}`);
}

export default async function Quiz({
  params,
}: {
  params: { subjectID: number };
}) {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }
  const user = await getUserByAuthID(userAuth.userId);
  const subject = await getSubjectByID(params.subjectID);
  if (subject.userID != user.id) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/subjects">Subjects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/subjects/${subject.id}`}>
              {subject.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Quiz</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="max-w-lg m-auto">
        <form action={createQuiz}>
          <input type="hidden" name="subjectID" value={subject.id} />
          <CardHeader>
            <CardTitle>Customize Quiz</CardTitle>
            <CardDescription>
              Create your new quiz in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-3">
                <Label htmlFor="languages">Language</Label>
                <Select name="language">
                  <SelectTrigger id="languages">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {languages.map((l, k) => (
                      <SelectItem value={l} key={k}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  type="text"
                  name="topic"
                  placeholder="a topic you want to get quizzed on"
                />
                <Label htmlFor="questions">Questions Amount</Label>
                <Select name="questions">
                  <SelectTrigger id="questions">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="5">5 questions</SelectItem>
                    <SelectItem value="10">10 questions</SelectItem>
                    <SelectItem value="15">15 questions</SelectItem>
                    <SelectItem value="20">20 questions</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="difficulties">Difficulty</Label>
                <Select name="difficulty">
                  <SelectTrigger id="difficulties">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="easy">easy</SelectItem>
                    <SelectItem value="medium">medium</SelectItem>
                    <SelectItem value="hard">hard</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="timeLimits">Time Limit</Label>
                <Select name="time">
                  <SelectTrigger id="timeLimits">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/subjects/${subject.id}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button size="lg" type="submit">
              Start Quiz!
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
