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
      const handles = Array.from(storage.handles.values());
      return res.json(handles);
    }

    if (req.method === 'POST') {
      const { handle } = req.body;
      
      if (!handle) {
        return res.status(400).json({ message: 'Handle is required' });
      }

      // Check if handle already exists
      if (storage.handles.has(handle)) {
        return res.status(400).json({ message: 'Handle already exists' });
      }

      // Fetch user info from Codeforces
      const axios = (await import('axios')).default;
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
      
      if (response.data.status !== 'OK' || !response.data.result?.length) {
        return res.status(400).json({ message: 'Invalid handle' });
      }

      const userInfo = response.data.result[0];
      
      const newHandle = {
        id: storage.handleId++,
        handle,
        rating: userInfo.rating || null,
        maxRating: userInfo.maxRating || null,
        rank: userInfo.rank || null,
        maxRank: userInfo.maxRank || null,
        avatar: userInfo.avatar || null,
        firstName: userInfo.firstName || null,
        lastName: userInfo.lastName || null,
        country: userInfo.country || null,
        city: userInfo.city || null,
        organization: userInfo.organization || null,
        createdAt: Date.now(),
      };

      storage.handles.set(handle, newHandle);
      return res.json(newHandle);
    }

    if (req.method === 'DELETE') {
      const handleToDelete = req.url?.split('/').pop();
      if (!handleToDelete) {
        return res.status(400).json({ message: 'Handle is required' });
      }

      if (storage.handles.has(handleToDelete)) {
        storage.handles.delete(handleToDelete);
        // Also delete related submissions
        for (const [key, submission] of storage.submissions) {
          if (submission.handle === handleToDelete) {
            storage.submissions.delete(key);
          }
        }
        return res.json({ message: 'Handle deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Handle not found' });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in handles API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}