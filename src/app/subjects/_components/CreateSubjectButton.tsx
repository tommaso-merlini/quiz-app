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
import { createSubject } from "../_actions/createSubject";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}

export function CreateSubjectButton() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await createSubject(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            required
          />
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
