import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/db";
import {
  materials,
  SelectMaterial,
  SelectSubject,
  subjects,
  users,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { UploadFiles } from "./_components/uploadFiles";
import { CustomizeQuizForm } from "./_components/customizeQuizForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { getRunningQuizID } from "./_actions/getRunningQuizID";
import { deleteMaterialAndFile } from "./_actions/deleteMaterialAndFile";

export type SubjectWithMaterials = SelectSubject & {
  materials: SelectMaterial[];
};

const handleSubmit = async (fd: FormData) => {
  "use server";
  const userAuth = auth();
  if (!userAuth.userId) {
    throw new Error("not authenticated");
  }

  const name = fd.get("name");
  if (!name) {
    throw new Error("shit");
  }

  const user = (
    await db.select().from(users).where(eq(users.authID, userAuth.userId))
  )[0];
  if (!user) {
    throw new Error("shit");
  }

  await db.insert(subjects).values({
    userID: user.id,
    name: name as string,
  });

  revalidatePath("/subjects");
};

async function getUserSubjectsWithMaterials(
  userId: number,
): Promise<SubjectWithMaterials[]> {
  "use server";
  const result = await db
    .select({
      subject: subjects,
      material: materials,
    })
    .from(subjects)
    .leftJoin(materials, eq(materials.subjectID, subjects.id))
    .where(eq(subjects.userID, userId))
    .orderBy(desc(subjects.createdAt));

  const subjectsMap = new Map<number, SubjectWithMaterials>();

  for (const row of result) {
    if (!subjectsMap.has(row.subject.id)) {
      subjectsMap.set(row.subject.id, {
        ...row.subject,
        materials: [],
      });
    }

    if (row.material) {
      subjectsMap.get(row.subject.id)!.materials.push(row.material);
    }
  }

  return Array.from(subjectsMap.values());
}

export default async function Subjects() {
  const userAuth = auth();
  if (!userAuth.userId) {
    redirect("/login");
  }

  const user = (
    await db
      .select()
      .from(users)
      .where(eq(users.authID, userAuth.userId))
      .limit(1)
  )[0];
  if (!user) {
    throw new Error("shit");
  }

  const subjectWithMaterials = await getUserSubjectsWithMaterials(user.id);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create a New Subject</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form action={handleSubmit}>
            <DialogHeader className="mb-4">
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Create a new subject here. Click create when youre done
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Math"
              name="name"
              className="mb-4"
            />
            <DialogFooter>
              <DialogTrigger asChild>
                <Button type="submit" size="lg">
                  Create
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          My Subjects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectWithMaterials.map((subject, k) => (
            <Card key={k} className="relative">
              <CardHeader className="flex flex-row justify-between pb-24">
                <CardTitle className="text-2xl text-wrap pr-4">
                  {subject.name}
                </CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <p className="text-sm text-gray-500 cursor-pointer hover:underline whitespace-nowrap">
                      {subject.materials.length}{" "}
                      {subject.materials.length === 1
                        ? "material"
                        : "materials"}
                    </p>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <ScrollArea className="max-h-72 w-full rounded-md p-4">
                      {subject.materials.length > 0 &&
                        subject.materials.map((m, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2  cursor-pointer rounded px-2"
                          >
                            <Link
                              href={m.url || "#"}
                              className="max-w-[80%] break-all"
                            >
                              {m.name}
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    delete your Material.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <form
                                    action={async () => {
                                      "use server";
                                      await deleteMaterialAndFile(m.id);
                                      //TODO: metterlo come client e fare un toast
                                    }}
                                  >
                                    <AlertDialogAction type="submit">
                                      Continue
                                    </AlertDialogAction>
                                  </form>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      {subject.materials.length === 0 && "no material found"}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardFooter className="absolute bottom-0 space-x-4 w-full">
                <TakeQuizButton subject={subject} />
                <DumpMaterialButton subject={subject} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

async function TakeQuizButton({ subject }: { subject: SubjectWithMaterials }) {
  const runningQuizID = await getRunningQuizID(subject.id);
  if (runningQuizID) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="flex flex-1 justify-evenly" variant="destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              color="#ffffff"
              fill="none"
            >
              <path
                d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M6.5 10L10.5 10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M13.5 11C13.5 11 14 11 14.5 12C14.5 12 16.0882 9.5 17.5 9"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.5 16L10.5 16"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M13.5 17C13.5 17 14 17 14.5 18C14.5 18 16.0882 15.5 17.5 15"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Take Quiz
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You have a quiz running on this subject
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are trying to create a quiz on this subject but you alredy did
              that and havent finished it. If you want to discard the previous
              quiz just complete it blank.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <Link href={`/quiz/${runningQuizID}`}>
              <AlertDialogAction>Finish quiz</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    if (subject.materials.length === 0) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex flex-1 justify-evenly">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                color="#ffffff"
                fill="none"
              >
                <path
                  d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.5 10L10.5 10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M13.5 11C13.5 11 14 11 14.5 12C14.5 12 16.0882 9.5 17.5 9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.5 16L10.5 16"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M13.5 17C13.5 17 14 17 14.5 18C14.5 18 16.0882 15.5 17.5 15"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Take Quiz
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                You havent dumped any material yet
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are trying to start a quiz without any material. Please Dump
                some material before creating a quiz
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Ok, I undertand</AlertDialogAction>{" "}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    } else {
      return (
        <CustomizeQuizForm subject={subject}>
          <Button className="flex flex-1 justify-evenly">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              color="#ffffff"
              fill="none"
            >
              <path
                d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M6.5 10L10.5 10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M13.5 11C13.5 11 14 11 14.5 12C14.5 12 16.0882 9.5 17.5 9"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.5 16L10.5 16"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M13.5 17C13.5 17 14 17 14.5 18C14.5 18 16.0882 15.5 17.5 15"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Take Quiz
          </Button>
        </CustomizeQuizForm>
      );
    }
  }
}

function DumpMaterialButton({ subject }: { subject: SubjectWithMaterials }) {
  return <UploadFiles subjectID={subject.id} />;
}
