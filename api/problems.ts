import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const problems = Array.from(storage.problems.values());
      return res.json(problems);
    }

    if (req.method === 'POST') {
      const { problemId } = req.body;
      
      if (!problemId) {
        return res.status(400).json({ message: 'Problem ID is required' });
      }

      // Check if problem already exists
      if (storage.problems.has(problemId)) {
        return res.status(400).json({ message: 'Problem already exists' });
      }

      // Parse problem ID (e.g., "1500A" -> contestId: 1500, index: "A")
      const match = problemId.match(/^(\d+)([A-Z]\d*)$/);
      if (!match) {
        return res.status(400).json({ message: 'Invalid problem ID format' });
      }

      const [, contestId, index] = match;

      // Fetch problem info from Codeforces
      const axios = (await import('axios')).default;
      const response = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
      
      if (response.data.status !== 'OK') {
        return res.status(400).json({ message: 'Invalid problem ID' });
      }

      const problem = response.data.result.problems.find((p: any) => p.index === index);
      if (!problem) {
        return res.status(400).json({ message: 'Problem not found' });
      }

      const newProblem = {
        id: storage.problemId++,
        problemId,
        name: problem.name || null,
        contestId: parseInt(contestId),
        index,
        rating: problem.rating || null,
        tags: problem.tags || [],
        createdAt: Date.now(),
      };

      storage.problems.set(problemId, newProblem);
      return res.json(newProblem);
    }

    if (req.method === 'DELETE') {
      const problemToDelete = req.url?.split('/').pop();
      if (!problemToDelete) {
        return res.status(400).json({ message: 'Problem ID is required' });
      }

      if (storage.problems.has(problemToDelete)) {
        storage.problems.delete(problemToDelete);
        return res.json({ message: 'Problem deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Problem not found' });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in problems API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}