# 🚀 5-Minute Vercel Deployment

**The fastest way to get your Codeforces Dashboard online:**

## Option 1: GitHub + Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Deploy to Vercel"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project" → Import your repo
   - Click "Deploy"
   - Done! ✅

## Option 2: One Command Deploy

```bash
npm install -g vercel
vercel --prod
```

**That's it!** Your app will be live in 2-3 minutes.

## What You Get

✅ Live URL (e.g., `your-app.vercel.app`)  
✅ HTTPS certificate  
✅ Global CDN  
✅ Auto-scaling  
✅ Zero maintenance  

## Test Your App

Visit your URL and try:
- Add handle: `tourist`
- Add problem: `1500A`
- View dashboard

**Need help?** Check `VERCEL_DEPLOYMENT_TUTORIAL.md` for detailed instructions.