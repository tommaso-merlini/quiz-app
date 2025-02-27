import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/components/lucia/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "../stripe/createCheckoutSession";
import SlideShow from "./_components/slideshow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductShowcase from "../_components/ProductShowcase";

const formSubmitted = async (formData: FormData) => {
  "use server";
  const userID = formData.get("userID") as string;

  if (userID.trim().length === 0) {
    redirect("/signup");
  }

  const checkoutURL = await createCheckoutSession(
    "price_1Q3OKkBrtv952LVmFaMpf5Pe",
    userID,
  );
  redirect(checkoutURL);
};

export default async function PricingPage() {
  const { user } = await auth();
  if (user?.isSubscribed) {
    redirect("/subjects");
  }

  const monthlyPrice = 5.99;

  const features = [
    "Unlimited Projects",
    "Unlimited Notes Uploads",
    "Test Analytics",
    "Multiple Question Types",
    "Access to Future Updates",
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md mb-20 mt-10">
        <CardHeader>
          <CardTitle className="text-center">
            <span className="text-sm">Unlimited access to</span>
            <p className="text-4xl font-bold">SlayTest</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            ${monthlyPrice}
            <span className="text-xl font-normal text-gray-500">
              /{"month"}
            </span>
          </div>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <form action={formSubmitted} className="w-full">
            <input type="hidden" value={user?.id} name="userID" />
            <Button className="w-full" size="lg" type="submit">
              Get Started
            </Button>
          </form>
        </CardFooter>
      </Card>
      <ProductShowcase />
    </div>
  );
}
