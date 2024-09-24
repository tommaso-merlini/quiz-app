import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2Icon, CalendarIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2Icon className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Subscription Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Thank you for subscribing. Your monthly plan is now active.
          </p>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Billing Cycle</span>
            </div>
            <span className="text-sm">Monthly</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCardIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Next Billing Date</span>
            </div>
            <span className="text-sm">{getNextBillingDate()}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/subjects">Start Studying!</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function getNextBillingDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
