"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createQuiz } from "../actions";
import { Textarea } from "@/components/ui/textarea";

export type SourceType = "text" | "topic" | "image" | "pdf";

export const InstantQuizBox = () => {
  const [sourceType, setSourceType] = useState<SourceType>("text");

  return (
    <form
      action={(f) => createQuiz(sourceType, f)}
      className="max-w-3xl mx-auto bg-white border-4 border-neutral-100 rounded-3xl mt-[-200px] p-4"
    >
      <div className="flex flex-row justify-between pb-4">
        <div className="flex flex-row items-center space-x-4">
          <Badge
            className="cursor-pointer"
            variant={sourceType === "text" ? "default" : "outline"}
            onClick={() => {
              setSourceType("text");
            }}
          >
            Text
          </Badge>
          <Badge
            className="cursor-pointer"
            variant={sourceType === "topic" ? "default" : "outline"}
            onClick={() => {
              setSourceType("topic");
            }}
          >
            Topic
          </Badge>
          <Badge
            className="cursor-pointer"
            variant={sourceType === "pdf" ? "default" : "outline"}
            onClick={() => {
              setSourceType("pdf");
            }}
          >
            Pdf
          </Badge>
          <Badge
            className="cursor-pointer"
            variant={sourceType === "image" ? "default" : "outline"}
            onClick={() => {
              setSourceType("image");
            }}
          >
            Image
          </Badge>
        </div>
        <div>ciao</div>
      </div>
      {sourceType === "text" && (
        <Textarea
          name="source"
          className="textarea w-full h-72 bg-neutral-100 rounded-lg"
        ></Textarea>
      )}
      {sourceType === "topic" && (
        <Textarea
          name="source"
          className="textarea w-full h-72 bg-neutral-100 rounded-lg"
        ></Textarea>
      )}
      {sourceType === "image" && (
        <div className="textarea w-full h-72 bg-neutral-100 rounded-lg">
          metti immagine
        </div>
      )}
      {sourceType === "pdf" && (
        <div className="w-full h-72 bg-neutral-100 rounded-lg">
          You cant upload Pdfs on the free tier.
        </div>
      )}
      <div className="flex flex-row justify-between pt-4">
        <div className="flex flex-row items-center space-x-4">
          <Select defaultValue="auto" name="language">
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="italy">Italy</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue="medium" name="difficulty">
            <SelectTrigger>
              <SelectValue placeholder="Select a Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Difficulty</SelectLabel>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue="5" name="time">
            <SelectTrigger>
              <SelectValue placeholder="Select a Time Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Limit</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue="5" name="questions">
            <SelectTrigger>
              <SelectValue placeholder="Select The Amount of Questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Questions Amount</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-blue-500 hover:bg-blue-700 border-4 border-blue-600"
          size="lg"
          type="submit"
        >
          Start Quiz
        </Button>
      </div>
    </form>
  );
};
