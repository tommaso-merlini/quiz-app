"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { GetGrade } from "../actions";
import { QuizContent } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DynamicFormProps {
  questions: QuizContent;
  difficulty: "easy" | "medium" | "hard";
  time: number;
  topic?: string;
  quizID: number;
  subjectID: number;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  questions,
  difficulty,
  time,
  topic,
  quizID,
  subjectID,
}) => {
  const [timeLeft, setTimeLeft] = useState(time * 60); // Convert minutes to seconds
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<{ answers: any[] }>({
    resolver: zodResolver(z.object({ answers: z.array(z.any()) })),
    defaultValues: { answers: questions.map(() => undefined) },
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      form.handleSubmit(onSubmit)();
      return;
    }

    const timer = setInterval(() => {
      if (!isSubmitting && timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  async function onSubmit(values: { answers: any[] }) {
    setIsSubmitting(true);
    const resp = await GetGrade(values.answers, quizID);
    console.log(resp);
  }

  const renderQuestionField = (
    question: QuizContent[number],
    index: number,
  ) => {
    switch (question.type) {
      case "openEnded":
        return (
          <FormField
            control={form.control}
            name={`answers.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Answer</FormLabel>
                <FormControl>
                  <Textarea {...field} maxLength={1000} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "trueOrFalse":
        return (
          <FormField
            control={form.control}
            name={`answers.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Answer</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">True</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">False</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "multipleChoice":
        return (
          <FormField
            control={form.control}
            name={`answers.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Answer</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {question.answers.map((answer, answerIndex) => (
                      <FormItem
                        key={answerIndex}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={answerIndex.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {answer.text}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="space-y-4 relative">
      <div className="fixed bottom-4 right-4 z-10">
        <Badge
          variant={timeLeft > 60 ? "secondary" : "destructive"}
          className="text-lg font-bold px-3 py-1 shadow-lg"
        >
          {formatTime(timeLeft)}
        </Badge>
      </div>
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="space-x-2">
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty} difficulty
          </Badge>
          {topic && <Badge variant="outline">{topic}</Badge>}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {questions.map((question, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{question.topic}</CardTitle>
                  <CardDescription className="text-md">
                    {question.question}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderQuestionField(question, index)}
                </CardContent>
              </Card>
            ))}
            <div className="flex flex-row justify-end">
              <Button size="lg" type="submit" disabled={isSubmitting}>
                {!isSubmitting ? "Submit Quiz" : "Grading your Quiz..."}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DynamicForm;
