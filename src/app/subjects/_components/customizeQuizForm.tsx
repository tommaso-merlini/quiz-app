"use client";

import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import languages from "@/utils/languages";
import { createQuiz } from "../_actions/createQuiz";
import { useState } from "react";
import { SubjectWithMaterials } from "@/types";

export function CustomizeQuizForm({
  children,
  subject,
}: {
  children: any;
  subject: SubjectWithMaterials;
}) {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <form
          action={createQuiz}
          onSubmit={() => {
            setIsSubmitted(true);
          }}
        >
          <input type="hidden" name="subjectID" value={subject.id} />
          <DialogHeader>
            <DialogTitle>Customize Quiz</DialogTitle>
            <DialogDescription>
              Create your new quiz in one-click.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full items-center gap-4 pt-4">
            <div className="flex flex-col space-y-3">
              <Label htmlFor="languages">Language</Label>
              <Select name="language" required defaultValue="Auto">
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
              <Select name="questions" required defaultValue="5">
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
              <Select name="difficulty" required defaultValue="medium">
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
              <Select name="time" required defaultValue="5">
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
          <DialogFooter className="pt-8 flex flex-row justify-between">
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DialogTrigger>
            <Button size="lg" type="submit" disabled={isSubmitted}>
              {!isSubmitted ? "Start Quiz!" : "Creating Quiz..."}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
