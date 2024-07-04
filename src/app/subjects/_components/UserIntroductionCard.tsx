"use client";

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
import { useState } from "react";

export default function UserIntroductionCard() {
  const [name, setName] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          Please, Introduce{" "}
          <span className="underline decoration-yellow-300 decoration-4">
            Yourself
          </span>
        </CardTitle>
        <CardDescription className="pb-4">
          sadlkfjdklasfjkldasjfklsdja
        </CardDescription>
        {step == 1 && (
          <>
            <Label>How would you prefer to get called?</Label>
            <Input onChange={(e) => setName(e.target.value)} />
          </>
        )}
        <CardFooter className="p-0 pt-4 justify-end space-x-4">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Go back
            </Button>
          )}
          <Button
            className="w-40 m-0 space-x-2 justify-center"
            onClick={() => setStep(step + 1)}
          >
            <span>Go on</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="#ffffff"
              fill="none"
            >
              <path
                d="M20 12L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </CardFooter>
      </CardHeader>
    </Card>
  );
}

function step1() {}
