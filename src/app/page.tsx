import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = auth();
  if (user.userId) {
    redirect("/subjects");
  }

  return (
    <>
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Generate quizzes for free
        </h1>
        <span
          className="max-w-[600px] text-center text-lg font-light text-foreground"
          // className="display: inline-block; vertical-align: top; text-decoration: inherit; max-width: 502px;"
        >
          Beautifully designed components that you can copy and paste into your
          apps. Accessible. Customizable. Open Source.
        </span>
        <SignUpButton>
          <Button>Check it out</Button>
        </SignUpButton>
      </section>
      <div className="w-full h-[600px] bg-neutral-50 mt-10 rounded-xl mb-10"></div>
      <p className="text-gray-500 mb-10 text-center text-sm">Built with love</p>
    </>
  );
}
