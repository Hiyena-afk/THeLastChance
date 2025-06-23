# Codeforces Dashboard

A web application to track Codeforces problem-solving progress for multiple users.

## Features

- Add and manage Codeforces handles
- Add and track specific problems
- View solve status for each user
- Dashboard with statistics and rankings

## Deployment to Vercel

### Quick Setup (5 minutes)

1. **Fork/Clone this repository**

2. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel** (choose one method):
   
   **Option A - Using the deploy script:**
   ```bash
   ./deploy.sh
   ```
   
   **Option B - Manual deployment:**
   ```bash
   vercel --prod
   ```
   
   Follow the prompts:
   - Link to existing project? `N`
   - Project name: `codeforces-dashboard` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? `N`

4. **That's it!** Your app will be live at the provided `.vercel.app` URL.

### Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

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