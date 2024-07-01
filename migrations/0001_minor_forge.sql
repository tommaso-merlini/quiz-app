ALTER TABLE "quizzes" ADD COLUMN "language" text;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "difficulty" text;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "time" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "questions" integer NOT NULL;