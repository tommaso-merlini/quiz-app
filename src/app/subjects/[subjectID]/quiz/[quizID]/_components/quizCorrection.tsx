"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { quizSchema } from "../schema";
import { GradeOpenEndedQuestion } from "@/ai/gradeOpenEndedQuestion";

type QuizType = z.infer<typeof quizSchema>["questionTypes"][number];

interface QuizCorrectionProps {
  questions: QuizType[];
  userAnswers: (string | undefined)[];
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
}

const QuizCorrection: React.FC<QuizCorrectionProps> = ({
  questions,
  userAnswers,
  difficulty,
  topic,
}) => {
  const [correctedAnswers, setCorrectedAnswers] = useState<
    Array<{ isCorrect: boolean; correction?: string }>
  >([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const gradeQuestions = async () => {
      const graded = await Promise.all(
        questions.map(async (question, index) => {
          const userAnswer = userAnswers[index];
          if (userAnswer === undefined) return { isCorrect: false };

          switch (question.type) {
            case "openEnded":
              const resp = await GradeOpenEndedQuestion(
                userAnswer,
                question.answer,
              );
              console.log("resp", resp);
              return { isCorrect: resp.grade > 50 };
            case "trueOrFalse":
              return { isCorrect: userAnswer === question.answer };
            case "multipleChoice":
              const correctAnswerIndex = question.answers.findIndex(
                (a) => a.isCorrect,
              );
              return {
                isCorrect: userAnswer === correctAnswerIndex.toString(),
              };
            default:
              return { isCorrect: false };
          }
        }),
      );

      setCorrectedAnswers(graded);
      setScore(graded.filter((g) => g.isCorrect).length);
    };

    gradeQuestions();
  }, [questions, userAnswers]);

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

  return (
    <div className="space-y-4 max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty} difficulty
          </Badge>
          {topic && <Badge variant="outline">{topic}</Badge>}
        </div>
        <Badge variant="secondary" className="text-lg">
          Score: {score}/{questions.length}
        </Badge>
      </div>
      {questions.map((question, index) => (
        <div
          key={index}
          className={`space-y-4 border-4 p-4 rounded ${
            correctedAnswers[index]?.isCorrect
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <h3 className="text-lg font-semibold">{question.topic}</h3>
          <p className="text-md">{question.question}</p>
          {renderAnswer(
            question,
            userAnswers[index],
            correctedAnswers[index]?.correction,
          )}
        </div>
      ))}
    </div>
  );
};

const renderAnswer = (
  question: QuizType,
  userAnswer: string | undefined,
  correction?: string,
) => {
  switch (question.type) {
    case "openEnded":
      return (
        <div>
          <p>
            <strong>Your Answer:</strong> {userAnswer || "No answer provided"}
          </p>
          <p>
            <strong>Correct Answer:</strong> {question.answer}
          </p>
          {correction && (
            <p>
              <strong>Correction:</strong> {correction}
            </p>
          )}
        </div>
      );
    case "trueOrFalse":
      return (
        <div>
          <p>
            <strong>Your Answer:</strong> {userAnswer || "No answer provided"}
          </p>
          <p>
            <strong>Correct Answer:</strong> {question.answer}
          </p>
        </div>
      );
    case "multipleChoice":
      const correctAnswer = question.answers.find((a) => a.isCorrect);
      return (
        <div>
          <p>
            <strong>Your Answer:</strong>{" "}
            {userAnswer !== undefined
              ? question.answers[parseInt(userAnswer)].text
              : "No answer provided"}
          </p>
          <p>
            <strong>Correct Answer:</strong> {correctAnswer?.text}
          </p>
        </div>
      );
  }
};

export default QuizCorrection;
