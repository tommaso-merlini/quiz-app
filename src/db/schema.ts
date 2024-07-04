import languages from "@/utils/languages";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  authID: text("authID").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  userID: integer("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  subjectID: integer("subjectID")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }), //TODO: really deleting a subject should delete even its quizzes? i think not
  content: json("content").notNull(),
  language: text("language", {
    enum: languages,
  }).notNull(),
  difficulty: text("difficulty", {
    enum: ["easy", "medium", "hard"],
  }).notNull(),
  time: integer("time").notNull(),
  topic: text("topic"),
  questions: integer("questions").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  quizID: integer("quizID")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  answers: json("answers").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subjectID: integer("subjectID")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["text", "image", "pdf"],
  }).notNull(),
  url: text("url"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userID: integer("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  betterGrades: boolean("betterGrades"),
  moreTimeStudying: boolean("moreTimeStudying"),
});

export const embeddings = pgTable(
  "embeddings",
  {
    id: serial("id").primaryKey(),
    materialID: integer("materialID")
      .notNull()
      .references(() => materials.id, { onDelete: "cascade" }),
    vector: vector("vector", { dimensions: 1536 }),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.vector.op("vector_cosine_ops"),
    ),
  }),
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertQuiz = typeof quizzes.$inferInsert;
export type SelectQuiz = typeof quizzes.$inferSelect;

export type InsertSubject = typeof subjects.$inferInsert;
export type SelectSubject = typeof subjects.$inferSelect;

export type InsertMaterial = typeof materials.$inferInsert;
export type SelectMaterial = typeof materials.$inferSelect;

export type InsertEmbedding = typeof embeddings.$inferInsert;
export type SelectEmbedding = typeof embeddings.$inferSelect;

export type InsertGrade = typeof grades.$inferInsert;
export type SelectGrade = typeof grades.$inferSelect;

export type InsertGoal = typeof goals.$inferInsert;
export type SelectGoal = typeof goals.$inferSelect;
