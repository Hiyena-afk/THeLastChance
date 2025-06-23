# Complete Vercel Deployment Tutorial

This tutorial will guide you through deploying your Codeforces Dashboard to Vercel in under 5 minutes.

## Prerequisites

- A GitHub account
- Node.js installed on your computer
- Your project code ready

## Method 1: Deploy via GitHub (Recommended - Easiest)

### Step 1: Push Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `codeforces-dashboard` (or any name you prefer)
   - Make it public or private
   - Click "Create repository"

2. **Upload your code to GitHub:**
   ```bash
   # Initialize git in your project folder
   git init
   
   # Add all files
   git add .
   
   # Commit the files
   git commit -m "Initial commit"
   
   # Add your GitHub repository as remote
   git remote add origin https://github.com/YOUR_USERNAME/codeforces-dashboard.git
   
   # Push to GitHub
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign up" and sign in with your GitHub account

2. **Import your project:**
   - Click "New Project"
   - You'll see your GitHub repositories
   - Find your `codeforces-dashboard` repository
   - Click "Import"

3. **Configure deployment:**
   - Project Name: `codeforces-dashboard` (or your preferred name)
   - Framework Preset: Vercel will auto-detect it
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (should be auto-detected)
   - Output Directory: `dist/public` (should be auto-detected)
   - Install Command: `npm install` (should be auto-detected)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your GitHub account.

### Step 3: Deploy Your Project

1. **Navigate to your project directory:**
   ```bash
   cd path/to/your/codeforces-dashboard
   ```

2. **Run the deployment:**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts:**
   ```
   ? Set up and deploy "~/codeforces-dashboard"? [Y/n] Y
   ? Which scope do you want to deploy to? [Your Account]
   ? Link to existing project? [y/N] N
   ? What's your project's name? codeforces-dashboard
   ? In which directory is your code located? ./
   ```

4. **Wait for deployment:**
   - Vercel will build and deploy your app
   - You'll get a live URL like `https://codeforces-dashboard-abc123.vercel.app`

### Step 4: Set up Auto-Deployments (Optional)

To enable automatic deployments when you push to GitHub:

```bash
# Link your project to GitHub
vercel --prod
# Follow prompts to connect to GitHub repository
```

## Method 3: Using the Deploy Script

If you're in the project directory, you can use the included deploy script:

```bash
# Make the script executable (Linux/Mac)
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

## Verification Steps

After deployment, verify your app is working:

1. **Visit your Vercel URL**
2. **Test the main features:**
   - Add a Codeforces handle (try "tourist" or "jiangly")
   - Add a problem (try "1500A" or "1200B")
   - Check the dashboard updates

3. **Test API endpoints:**
   ```bash
   # Test handles endpoint
   curl https://your-app.vercel.app/api/handles
   
   # Test problems endpoint
   curl https://your-app.vercel.app/api/problems
   
   # Test dashboard endpoint
   curl https://your-app.vercel.app/api/dashboard
   ```

## Troubleshooting

### Common Issues and Solutions

**1. Build fails with "Command not found"**
```
Solution: Make sure package.json has the correct build script
```

**2. API routes return 404**
```
Solution: Check that your api/ folder is in the root directory
```

**3. Frontend loads but API doesn't work**
```
Solution: Verify CORS headers are set in your API functions
```

**4. Function timeout errors**
```
Solution: Codeforces API might be slow. The functions have 30s timeout limit.
```

### Getting Help

If you encounter issues:

1. **Check Vercel logs:**
   - Go to your project dashboard on vercel.com
   - Click on the failed deployment
   - View the build logs

2. **Check function logs:**
   - Go to your project dashboard
   - Click "Functions" tab
   - View real-time logs

## Domain Setup (Optional)

To use a custom domain:

1. **Go to your project dashboard on Vercel**
2. **Click "Settings" → "Domains"**
3. **Add your custom domain**
4. **Update your DNS settings** as instructed by Vercel

## Environment Variables (If Needed)

If you need to add environment variables:

1. **Go to project settings on Vercel**
2. **Click "Environment Variables"**
3. **Add your variables**
4. **Redeploy your project**

## Success! 🎉

Your Codeforces Dashboard is now live on Vercel! 

- **Automatic HTTPS** - Secured with SSL certificate
- **Global CDN** - Fast loading worldwide
- **Auto-scaling** - Handles traffic spikes automatically
- **Zero configuration** - No server management needed

## Next Steps

1. **Share your URL** with friends to track their progress
2. **Add more handles** and problems to track
3. **Consider adding a database** for persistent data (Vercel KV, PlanetScale)
4. **Set up monitoring** to track usage and performance

Your app URL: `https://your-project-name.vercel.app`