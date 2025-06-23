// Redirect to appropriate serverless function
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Route to appropriate handler based on URL
  const url = req.url || '';
  
  if (url.includes('/handles')) {
    const { default: handlesHandler } = await import('./handles.js');
    return handlesHandler(req, res);
  }
  
  if (url.includes('/problems')) {
    const { default: problemsHandler } = await import('./problems.js');
    return problemsHandler(req, res);
  }
  
  if (url.includes('/dashboard')) {
    const { default: dashboardHandler } = await import('./dashboard.js');
    return dashboardHandler(req, res);
  }

  return res.status(404).json({ message: 'Not found' });
}