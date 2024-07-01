// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { db } from "@/db";
// import {
//   embeddings,
//   InsertEmbedding,
//   materials,
//   quizzes,
//   subjects,
//   users,
// } from "@/db/schema";
// import { utapi } from "@/server/uploadthing";
// import { UploadButton } from "@/utils/uploadthing";
// import { auth } from "@clerk/nextjs/server";
// import { and, desc, eq } from "drizzle-orm";
// import { redirect, useRouter } from "next/navigation";
// import fs from "fs/promises";
// import { processPDF } from "./actions";
// import { revalidatePath } from "next/cache";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import Link from "next/link";
//
// async function uploadFiles(formData: FormData) {
//   "use server";
//   const userAuth = auth();
//   if (!userAuth.userId) {
//     throw new Error("shit");
//   }
//
//   const files = formData.getAll("files") as File[];
//   const subjectID = formData.get("subjectID");
//   if (subjectID == null) {
//     throw new Error("subjectid not provided");
//   }
//   const allFilesEmbeddings: InsertEmbedding[] = [];
//   await db.transaction(async (tx) => {
//     await utapi.uploadFiles(files);
//     for await (const f of files) {
//       const m = await tx
//         .insert(materials)
//         .values({
//           name: f.name,
//           subjectID: +subjectID,
//         })
//         .returning();
//       if (f.type === "application/pdf") {
//         //TODO: images
//         const embeddings = await processPDF(f, m[0].id);
//         allFilesEmbeddings.push(...embeddings);
//       }
//     }
//     await db.insert(embeddings).values(allFilesEmbeddings);
//   });
//   revalidatePath(`/subjects/${subjectID}`);
// }
//
// export default async function Subject({
//   params,
// }: {
//   params: { subjectID: number };
// }) {
//   const userAuth = auth();
//   if (!userAuth.userId) {
//     redirect("/login");
//   }
//
//   const user = (
//     await db
//       .select()
//       .from(users)
//       .where(eq(users.authID, userAuth.userId))
//       .limit(1)
//   )[0];
//   if (!user) {
//     throw new Error("shit");
//   }
//
//   const subject = (
//     await db
//       .select()
//       .from(subjects)
//       .where(
//         and(eq(subjects.id, params.subjectID), eq(subjects.userID, user.id)),
//       )
//   )[0];
//   if (!subject) {
//     throw new Error("shit");
//   }
//
//   const userMaterials = await db
//     .select()
//     .from(materials)
//     .where(eq(materials.subjectID, subject.id));
//
//   const userQuizzes = await db
//     .select()
//     .from(quizzes)
//     .where(eq(quizzes.subjectID, params.subjectID))
//     .orderBy(desc(quizzes.createdAt));
//
//   return (
//     <>
//       <Breadcrumb className="mb-8">
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/">Home</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/subjects">Subjects</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <BreadcrumbItem>
//             <BreadcrumbLink>{subject.name}</BreadcrumbLink>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>
//       <Link href={`/subjects/${subject.id}/quiz`}>
//         <Button
//           className="bg-orange-600 hover:bg-orange-800 border-4 border-orange-700 mb-4 mr-4"
//           size="lg"
//         >
//           Start a Quiz
//         </Button>
//       </Link>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button
//             className="bg-blue-600 hover:bg-blue-800 border-4 border-blue-700 mb-4"
//             size="lg"
//           >
//             Dump your Material
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Choose the Material you want to upload</DialogTitle>
//             <DialogDescription>
//               <form action={uploadFiles}>
//                 <Input id="files" type="file" name="files" multiple />
//                 <Input type="hidden" name="subjectID" value={subject.id} />
//                 <Button type="submit">upload</Button>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//       {userMaterials.map((m, k) => (
//         <Link
//           href={``}
//           key={k}
//           className="flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 border-[1px] border-neutral-100 p-16 rounded-lg text-xl font-semibold"
//         >
//           <p>{m.name}</p>
//         </Link>
//       ))}
//       {userMaterials.length === 0 && (
//         <p className="text-center text-lg mt-16">
//           You havent dumped any material yet
//         </p>
//       )}
//       <h1 className="mt-16 text-2xl font-normal">Your Past Quizzes</h1>
//       <div>
//         {userQuizzes.map((q, k) => (
//           <div key={k}>
//             <Link href={`/subjects/${params.subjectID}/quiz/${q.id}`}>
//               {q.id}
//             </Link>
//           </div>
//         ))}
//       </div>
//       {userQuizzes.length === 0 && (
//         <p className="text-center text-lg mt-8">You havent took any quiz yet</p>
//       )}
//     </>
//   );
// }
