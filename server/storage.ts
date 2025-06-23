import { handles, problems, submissions, type Handle, type Problem, type Submission, type InsertHandle, type InsertProblem, type InsertSubmission } from "@shared/schema";

export interface IStorage {
  // Handle operations
  getHandles(): Promise<Handle[]>;
  getHandle(handle: string): Promise<Handle | undefined>;
  createHandle(handle: InsertHandle): Promise<Handle>;
  updateHandle(handle: string, data: Partial<InsertHandle>): Promise<Handle | undefined>;
  deleteHandle(handle: string): Promise<boolean>;

  // Problem operations
  getProblems(): Promise<Problem[]>;
  getProblem(problemId: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  deleteProblem(problemId: string): Promise<boolean>;

  // Submission operations
  getSubmissions(): Promise<Submission[]>;
  getSubmissionsByHandle(handle: string): Promise<Submission[]>;
  getSubmissionsByProblem(problemId: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  deleteSubmissionsByHandle(handle: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private handles: Map<string, Handle>;
  private problems: Map<string, Problem>;
  private submissions: Map<string, Submission>;
  private currentHandleId: number;
  private currentProblemId: number;
  private currentSubmissionId: number;

  constructor() {
    this.handles = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.currentHandleId = 1;
    this.currentProblemId = 1;
    this.currentSubmissionId = 1;
  }

  // Handle operations
  async getHandles(): Promise<Handle[]> {
    return Array.from(this.handles.values());
  }

  async getHandle(handle: string): Promise<Handle | undefined> {
    return this.handles.get(handle);
  }

  async createHandle(insertHandle: InsertHandle): Promise<Handle> {
    const handle: Handle = {
      ...insertHandle,
      id: this.currentHandleId++,
      createdAt: Date.now(),
    };
    this.handles.set(handle.handle, handle);
    return handle;
  }

  async updateHandle(handle: string, data: Partial<InsertHandle>): Promise<Handle | undefined> {
    const existingHandle = this.handles.get(handle);
    if (!existingHandle) return undefined;

    const updatedHandle: Handle = {
      ...existingHandle,
      ...data,
    };
    this.handles.set(handle, updatedHandle);
    return updatedHandle;
  }

  async deleteHandle(handle: string): Promise<boolean> {
    return this.handles.delete(handle);
  }

  // Problem operations
  async getProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getProblem(problemId: string): Promise<Problem | undefined> {
    return this.problems.get(problemId);
  }

  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const problem: Problem = {
      ...insertProblem,
      id: this.currentProblemId++,
      createdAt: Date.now(),
    };
    this.problems.set(problem.problemId, problem);
    return problem;
  }

  async deleteProblem(problemId: string): Promise<boolean> {
    return this.problems.delete(problemId);
  }

  // Submission operations
  async getSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values());
  }

  async getSubmissionsByHandle(handle: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.handle === handle
    );
  }

  async getSubmissionsByProblem(problemId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.problemId === problemId
    );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const submission: Submission = {
      ...insertSubmission,
      id: this.currentSubmissionId++,
      createdAt: Date.now(),
    };
    const key = `${submission.handle}-${submission.problemId}`;
    this.submissions.set(key, submission);
    return submission;
  }

  async deleteSubmissionsByHandle(handle: string): Promise<boolean> {
    let deleted = false;
    for (const [key, submission] of this.submissions) {
      if (submission.handle === handle) {
        this.submissions.delete(key);
        deleted = true;
      }
    }
    return deleted;
  }
}

export const storage = new MemStorage();
