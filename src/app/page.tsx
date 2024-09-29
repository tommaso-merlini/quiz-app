import { auth } from "@/components/lucia/auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import SlideShow from "./pricing/_components/slideshow";

export default async function Home() {
  const { user } = await auth();
  if (user) {
    redirect("/subjects");
  }

  return (
    <>
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Infinite Tests from your Notes
        </h1>
        <span
          className="max-w-[600px] text-center text-lg font-light text-foreground"
          // className="display: inline-block; vertical-align: top; text-decoration: inherit; max-width: 502px;"
        >
          Turn your notes into tests that actually prep you for exams. Upload
          once, practice infinitely.
        </span>
        <Link href="/pricing">
          <Button size="lg">Start Studying!</Button>
        </Link>
      </section>
      <Tabs
        defaultValue="test"
        className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test">Tests</TabsTrigger>
          <TabsTrigger value="grade">Grades</TabsTrigger>
          <TabsTrigger value="subject">Subjects</TabsTrigger>
        </TabsList>
        <TabsContent value="test">
          <video autoPlay muted loop playsInline className="object-cover">
            <source src="/test.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </TabsContent>
        <TabsContent value="grade">
          <video autoPlay muted loop playsInline className="object-cover">
            <source src="/grade.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </TabsContent>
        <TabsContent value="subject">
          <video autoPlay muted loop playsInline className="object-cover">
            <source src="/subject.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </TabsContent>
      </Tabs>
      <p className="text-gray-500 mb-10 text-center text-sm">Built with love</p>
    </>
  );
}
