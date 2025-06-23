import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Simple in-memory storage for Vercel deployment
const storage = {
  handles: new Map(),
  problems: new Map(),
  submissions: new Map(),
  handleId: 1,
  problemId: 1,
  submissionId: 1
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const handles = Array.from(storage.handles.values());
    const problems = Array.from(storage.problems.values());
    const problemIds = problems.map((p: any) => p.problemId);

    const dashboardData = [];

    for (const handle of handles) {
      try {
        // Fetch submissions for this handle
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle.handle}&from=1&count=1000`);
        
        let submissions = [];
        if (response.data.status === 'OK') {
          submissions = response.data.result.filter((submission: any) => {
            const submissionProblemId = `${submission.problem.contestId}${submission.problem.index}`;
            return problemIds.includes(submissionProblemId);
          });
        }
        
        // Process submissions to get solve status
        const solvedProblems = new Set<string>();
        submissions.forEach((submission: any) => {
          if (submission.verdict === 'OK') {
            const submissionProblemId = `${submission.problem.contestId}${submission.problem.index}`;
            solvedProblems.add(submissionProblemId);
          }
        });

        // Create problem status for each problem
        const problemStatus = problemIds.map((problemId: string) => ({
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
      } catch (error) {
        // If we can't fetch submissions for a handle, add it with 0 solved
        const problemStatus = problemIds.map((problemId: string) => ({
          problemId,
          solved: false
        }));

        dashboardData.push({
          ...handle,
          solvedCount: 0,
          totalProblems: problemIds.length,
          solveRate: 0,
          problemStatus
        });
      }
    }

    // Sort by solved count (descending)
    dashboardData.sort((a: any, b: any) => b.solvedCount - a.solvedCount);

    const result = {
      users: dashboardData,
      problems,
      totalUsers: handles.length,
      totalProblems: problems.length,
      totalSolved: dashboardData.reduce((sum: number, user: any) => sum + user.solvedCount, 0),
      averageRate: handles.length > 0 ? Math.round(dashboardData.reduce((sum: number, user: any) => sum + user.solveRate, 0) / handles.length) : 0
    };

    return res.json(result);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
}