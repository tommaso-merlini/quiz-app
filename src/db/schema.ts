import { Answer, QuestionsSchema } from "@/types";
import languages from "@/utils/languages";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { db } from ".";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  isSubscribed: boolean("isSubscribed").notNull().default(false),
  canUseFreely: boolean("canUseFreely").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("userID")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const subjectsTable = pgTable("subjects", {
  id: uuid("id").primaryKey(),
  userID: uuid("userID")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const materialsTable = pgTable("materials", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  subjectID: uuid("subjectID")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const embeddingsTable = pgTable(
  "embeddings",
  {
    id: uuid("id").primaryKey(),
    materialID: uuid("materialID")
      .notNull()
      .references(() => materialsTable.id, { onDelete: "cascade" }),
    vector: vector("vector", { dimensions: 768 }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    pageNumber: integer("pageNumber").notNull(),
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

export const testsTable = pgTable("tests", {
  id: uuid("id").primaryKey(),
  subjectID: uuid("subjectID")
    .notNull()
    .references(() => subjectsTable.id, { onDelete: "cascade" }), //TODO: really deleting a subject should delete even its tests? i think not
  questions: json("questions").notNull().$type<QuestionsSchema>(),
  language: text("language", {
    enum: languages,
  }).notNull(),
  difficulty: text("difficulty", {
    enum: ["easy", "medium", "hard", "impossible"],
  }).notNull(),
  timeInMinutes: integer("timeInMinutes").notNull(),
  topic: text("topic"),
  questionsQty: integer("questionsQty").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const gradesTable = pgTable("grades", {
  id: uuid("id").primaryKey(),
  testID: uuid("testID")
    .notNull()
    .references(() => testsTable.id, { onDelete: "cascade" }),
  answers: json("answers").notNull().$type<Answer[]>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertTest = typeof testsTable.$inferInsert;
export type SelectTest = typeof testsTable.$inferSelect;

export type InsertSubject = typeof subjectsTable.$inferInsert;
export type SelectSubject = typeof subjectsTable.$inferSelect;

export type InsertMaterial = typeof materialsTable.$inferInsert;
export type SelectMaterial = typeof materialsTable.$inferSelect;

export type InsertEmbedding = typeof embeddingsTable.$inferInsert;
export type SelectEmbedding = typeof embeddingsTable.$inferSelect;

export type InsertGrade = typeof gradesTable.$inferInsert;
export type SelectGrade = typeof gradesTable.$inferSelect;

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionsTable as any,
  usersTable as any,
);
