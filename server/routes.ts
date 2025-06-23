import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHandleSchema, insertProblemSchema } from "@shared/schema";
import axios from "axios";

interface CodeforcesUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

interface CodeforcesProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  rating?: number;
  tags: string[];
}

interface CodeforcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: CodeforcesProblem;
  author: {
    contestId: number;
    members: { handle: string }[];
    participantType: string;
    ghost: boolean;
    startTimeSeconds: number;
  };
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

async function fetchCodeforcesUserInfo(handle: string): Promise<CodeforcesUser | null> {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (response.data.status === "OK" && response.data.result.length > 0) {
      return response.data.result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user info for ${handle}:`, error);
    return null;
  }
}

async function fetchCodeforcesProblem(problemId: string): Promise<CodeforcesProblem | null> {
  try {
    // Parse problem ID (e.g., "119A" -> contestId: 119, index: "A")
    const match = problemId.match(/^(\d+)([A-Z]\d*)$/);
    if (!match) return null;
    
    const contestId = parseInt(match[1]);
    const index = match[2];
    
    const response = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
    if (response.data.status === "OK" && response.data.result.problems) {
      const problem = response.data.result.problems.find((p: CodeforcesProblem) => p.index === index);
      return problem || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching problem info for ${problemId}:`, error);
    return null;
  }
}

async function fetchUserSubmissions(handle: string, problemIds: string[]): Promise<CodeforcesSubmission[]> {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
    if (response.data.status === "OK") {
      return response.data.result.filter((submission: CodeforcesSubmission) => {
        const submissionProblemId = `${submission.problem.contestId}${submission.problem.index}`;
        return problemIds.includes(submissionProblemId);
      });
    }
    return [];
  } catch (error) {
    console.error(`Error fetching submissions for ${handle}:`, error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all handles
  app.get("/api/handles", async (req, res) => {
    try {
      const handles = await storage.getHandles();
      res.json(handles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch handles" });
    }
  });

  // Add handle
  app.post("/api/handles", async (req, res) => {
    try {
      const { handle } = insertHandleSchema.parse(req.body);
      
      // Check if handle already exists
      const existingHandle = await storage.getHandle(handle);
      if (existingHandle) {
        return res.status(400).json({ message: "Handle already exists" });
      }

      // Fetch user info from Codeforces
      const userInfo = await fetchCodeforcesUserInfo(handle);
      if (!userInfo) {
        return res.status(400).json({ message: "Invalid Codeforces handle" });
      }

      // Create handle with fetched info
      const newHandle = await storage.createHandle({
        handle: userInfo.handle,
        rating: userInfo.rating,
        maxRating: userInfo.maxRating,
        rank: userInfo.rank,
        maxRank: userInfo.maxRank,
        avatar: userInfo.avatar,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        country: userInfo.country,
        city: userInfo.city,
        organization: userInfo.organization,
      });

      res.json(newHandle);
    } catch (error) {
      console.error("Error adding handle:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Delete handle
  app.delete("/api/handles/:handle", async (req, res) => {
    try {
      const { handle } = req.params;
      await storage.deleteSubmissionsByHandle(handle);
      const deleted = await storage.deleteHandle(handle);
      if (deleted) {
        res.json({ message: "Handle deleted successfully" });
      } else {
        res.status(404).json({ message: "Handle not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete handle" });
    }
  });

  // Get all problems
  app.get("/api/problems", async (req, res) => {
    try {
      const problems = await storage.getProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  // Add problem
  app.post("/api/problems", async (req, res) => {
    try {
      const { problemId } = insertProblemSchema.parse(req.body);
      
      // Check if problem already exists
      const existingProblem = await storage.getProblem(problemId);
      if (existingProblem) {
        return res.status(400).json({ message: "Problem already exists" });
      }

      // Fetch problem info from Codeforces
      const problemInfo = await fetchCodeforcesProblem(problemId);
      if (!problemInfo) {
        return res.status(400).json({ message: "Invalid problem ID" });
      }

      // Create problem with fetched info
      const newProblem = await storage.createProblem({
        problemId,
        name: problemInfo.name,
        contestId: problemInfo.contestId,
        index: problemInfo.index,
        rating: problemInfo.rating,
        tags: problemInfo.tags,
      });

      res.json(newProblem);
    } catch (error) {
      console.error("Error adding problem:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Delete problem
  app.delete("/api/problems/:problemId", async (req, res) => {
    try {
      const { problemId } = req.params;
      const deleted = await storage.deleteProblem(problemId);
      if (deleted) {
        res.json({ message: "Problem deleted successfully" });
      } else {
        res.status(404).json({ message: "Problem not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete problem" });
    }
  });

  // Get dashboard data (handles with solve status)
  app.get("/api/dashboard", async (req, res) => {
    try {
      const handles = await storage.getHandles();
      const problems = await storage.getProblems();
      const problemIds = problems.map(p => p.problemId);

      const dashboardData = [];

      for (const handle of handles) {
        // Fetch submissions for this handle
        const submissions = await fetchUserSubmissions(handle.handle, problemIds);
        
        // Process submissions to get solve status
        const solvedProblems = new Set<string>();
        submissions.forEach(submission => {
          if (submission.verdict === "OK") {
            const submissionProblemId = `${submission.problem.contestId}${submission.problem.index}`;
            solvedProblems.add(submissionProblemId);
          }
        });

        // Create problem status for each problem
        const problemStatus = problemIds.map(problemId => ({
          problemId,
          solved: solvedProblems.has(problemId)
        }));

        dashboardData.push({
          ...handle,
          solvedCount: solvedProblems.size,
          totalProblems: problemIds.length,
          solveRate: problemIds.length > 0 ? Math.round((solvedProblems.size / problemIds.length) * 100) : 0,
          problemStatus
        });
      }

      // Sort by solved count (descending)
      dashboardData.sort((a, b) => b.solvedCount - a.solvedCount);

      res.json({
        users: dashboardData,
        problems,
        totalUsers: handles.length,
        totalProblems: problems.length,
        totalSolved: dashboardData.reduce((sum, user) => sum + user.solvedCount, 0),
        averageRate: handles.length > 0 ? Math.round(dashboardData.reduce((sum, user) => sum + user.solveRate, 0) / handles.length) : 0
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
