import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const handles = pgTable("handles", {
  id: serial("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  rating: integer("rating"),
  maxRating: integer("max_rating"),
  rank: text("rank"),
  maxRank: text("max_rank"),
  avatar: text("avatar"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  country: text("country"),
  city: text("city"),
  organization: text("organization"),
  createdAt: integer("created_at").notNull(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  problemId: text("problem_id").notNull().unique(),
  name: text("name"),
  contestId: integer("contest_id"),
  index: text("index"),
  rating: integer("rating"),
  tags: text("tags").array(),
  createdAt: integer("created_at").notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  handle: text("handle").notNull(),
  problemId: text("problem_id").notNull(),
  verdict: text("verdict").notNull(),
  submissionId: integer("submission_id").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const insertHandleSchema = createInsertSchema(handles).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
});

export type InsertHandle = z.infer<typeof insertHandleSchema>;
export type Handle = typeof handles.$inferSelect;

export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
