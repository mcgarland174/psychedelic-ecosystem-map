# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy this Next.js application.

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**:
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add:
     - `AIRTABLE_API_KEY` = your Airtable Personal Access Token
     - `AIRTABLE_BASE_ID` = `appQkt2yYzVKhRaXx`
   - Click "Deploy"

4. **Access your site**:
   - Your site will be live at `https://your-project-name.vercel.app`
   - You can add a custom domain in the Vercel dashboard

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd psychedelic-ecosystem-map
   vercel
   ```

4. **Add Environment Variables**:
   When prompted or via:
   ```bash
   vercel env add AIRTABLE_API_KEY
   vercel env add AIRTABLE_BASE_ID
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables**:
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`

## Deploy to AWS Amplify

1. **Push to GitHub** (if not already done)

2. **Connect to AWS Amplify**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository

3. **Configure Build Settings**:
   - Amplify auto-detects Next.js
   - Add environment variables in the Amplify console

4. **Deploy**:
   - Click "Save and deploy"

## Environment Variables Required

For all deployment platforms, you need:

```
AIRTABLE_API_KEY=your_personal_access_token
AIRTABLE_BASE_ID=appQkt2yYzVKhRaXx
```

### How to Get Your Airtable API Key

1. Go to [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Give it a name (e.g., "Ecosystem Map Production")
4. Add scopes:
   - `data.records:read`
   - `schema.bases:read`
5. Add access to your "PSI CRM" base
6. Click "Create token" and copy the value

## Custom Domain

### Vercel
- Go to your project settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

### Netlify
- Go to Domain settings
- Add custom domain
- Configure DNS records

## Post-Deployment Checklist

- [ ] Test the network visualization loads correctly
- [ ] Verify filtering works
- [ ] Check that organization details display
- [ ] Test the Airtable embed tab
- [ ] Verify on mobile devices
- [ ] Check console for any errors
- [ ] Test with different ecosystem role filters
- [ ] Ensure search functionality works

## Monitoring & Analytics

Consider adding:
- **Vercel Analytics**: Built-in, just enable in dashboard
- **Google Analytics**: Add tracking code to `app/layout.tsx`
- **Sentry**: For error tracking

## Performance Optimization

The app is already optimized with:
- Next.js App Router for fast page loads
- Dynamic imports for the network graph
- Server-side data fetching
- Tailwind CSS for minimal CSS bundle

## Troubleshooting Deployment

### "Module not found" errors
```bash
npm install
npm run build
```

### Environment variables not working
- Ensure variables are added to the deployment platform
- Restart the deployment after adding variables
- Check variable names match exactly

### Network graph not rendering
- Check browser console for errors
- Verify vis-network is in dependencies
- Clear build cache and redeploy

## Cost Estimates

### Vercel
- **Free tier**:
  - 100 GB bandwidth
  - Perfect for small to medium traffic
- **Pro**: $20/month for higher limits

### Netlify
- **Free tier**:
  - 100 GB bandwidth
  - 300 build minutes/month
- **Pro**: $19/month

### AWS Amplify
- Pay per use:
  - ~$0.15 per GB served
  - ~$0.01 per build minute

## Security Considerations

- Never commit `.env.local` to git (it's in `.gitignore`)
- Rotate API keys regularly
- Use environment variables for all secrets
- Enable HTTPS (automatic on Vercel/Netlify)
- Consider rate limiting for API routes

## Updating the Deployment

### Vercel
- Push to GitHub → Auto-deploys
- Or use: `vercel --prod`

### Manual Updates
1. Pull latest changes
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy using your platform's method

## Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify environment variables are set correctly
3. Test locally first with `npm run dev`
4. Check [Next.js deployment docs](https://nextjs.org/docs/deployment)
