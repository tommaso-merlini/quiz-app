"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UserGrades } from "@/app/grades/_components/gradesTable";
import { Answer } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "@/components/ui/badge";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Chart({ grades }: { grades: UserGrades }) {
  const chartData: { date: Date; grade: number }[] = [];
  grades.map((g) => {
    let correctAnswersCount = 0;
    const answers = g.grade.answers as Answer[];
    answers.map((a) => {
      if (a.isCorrect) correctAnswersCount++;
    });
    chartData.push({
      date: g.grade.createdAt,
      grade: (100 * correctAnswersCount) / g.quiz.questions,
    });
  });
  chartData.reverse();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes overview</CardTitle>
        <CardDescription>Showing trend of your grades</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid />
            <ChartTooltip
              content={(value) => {
                const payload = value.payload;
                if (!payload || !payload[0]) {
                  return "";
                }
                const content = payload[0].payload as {
                  grade: number;
                  date: Date;
                };
                if (!content) {
                  return "";
                }
                return (
                  <div className="bg-white p-2 rounded border border-neutral-50">
                    {formatDate(content.date)}
                    <Badge
                      variant={content.grade < 60 ? "destructive" : "outline"}
                      className="ml-4"
                    >
                      {content.grade}%
                    </Badge>
                  </div>
                );
              }}
            />
            <Line
              dataKey="grade"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
