# Codeforces Dashboard

A web application to track Codeforces problem-solving progress for multiple users.

## Features

- Add and manage Codeforces handles
- Add and track specific problems
- View solve status for each user
- Dashboard with statistics and rankings

## Deployment to Vercel

### 🚀 Quick Deploy (2 minutes)

See [`QUICK_START.md`](QUICK_START.md) for the fastest deployment method.

### 📖 Detailed Tutorial

See [`VERCEL_DEPLOYMENT_TUTORIAL.md`](VERCEL_DEPLOYMENT_TUTORIAL.md) for step-by-step instructions with screenshots and troubleshooting.

### ⚡ One-Command Deploy

```bash
npm install -g vercel
vercel --prod
```

**Alternative: Use GitHub + Vercel Dashboard**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository → Deploy

### Environment Variables

No environment variables are required for the basic setup as it uses in-memory storage.

## Local Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5000`

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **API**: Codeforces API
- **Storage**: In-memory (for demo purposes)
- **Deployment**: Vercel

## API Endpoints

- `GET /api/handles` - Get all handles
- `POST /api/handles` - Add a new handle
- `DELETE /api/handles` - Delete a handle
- `GET /api/problems` - Get all problems
- `POST /api/problems` - Add a new problem
- `DELETE /api/problems` - Delete a problem
- `GET /api/dashboard` - Get dashboard data with solve status

## Notes

- Uses in-memory storage for simplicity (data resets on deployment)
- For production use, consider integrating with a database like Vercel KV or PlanetScale
- Serverless functions automatically handle scaling and cold starts