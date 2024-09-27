import { auth } from "@/components/lucia/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await auth();
  if (user) {
    redirect("/subjects");
  }

  return (
    <>
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Infinite Tests from your Notes.
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
      <div className="w-full bg-neutral-50 mt-4 rounded-xl mb-10 relative">
        <Image
          src="/image.png"
          width={1000}
          height={600}
          layout="responsive"
          alt="ciao"
        />
      </div>
      <p className="text-gray-500 mb-10 text-center text-sm">Built with love</p>
    </>
  );
}
