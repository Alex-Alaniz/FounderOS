# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Step 6: Roadmap microsite implementation"
   git push origin step6-roadmap-composer
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `roadmap-microsite` directory as root

3. **Configure Environment Variables**
   - Add `NOTION_API_KEY` with your Notion integration token
   - Get token from [Notion Integrations](https://www.notion.so/my-integrations)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

## Environment Variables

### Required
- `NOTION_API_KEY` - Your Notion integration API key

### Optional (for token gating)
- `UNLOCK_NETWORK` - Unlock Protocol network ID
- `UNLOCK_LOCK_ADDRESS` - Unlock Protocol lock address

## Notion Database Setup

1. **Share Database**
   - Open Product Roadmap database in Notion
   - Click "Share" → "Share to Web" (for public access)
   - OR add your integration to the database (for private access)

2. **Verify Database ID**
   - Current ID: `2b26468866ef8093a5bfe0775e96abda`
   - Update in `app/api/roadmap/route.ts` if different

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be auto-generated

## Performance Optimization

### Enable ISR (Incremental Static Regeneration)

Update `app/api/roadmap/route.ts`:

```typescript
export const revalidate = 3600 // Revalidate every hour
```

### Enable Edge Runtime

```typescript
export const runtime = 'edge'
```

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Consider Sentry or similar
- **Performance**: Use Vercel Speed Insights

## Troubleshooting

### API Route Not Working
- Verify `NOTION_API_KEY` is set correctly
- Check Notion database is shared with integration
- Verify database ID matches

### Animations Not Smooth
- Check browser console for errors
- Verify GSAP is loaded correctly
- Test on different devices

### Build Failures
- Check TypeScript errors: `npm run build`
- Verify all dependencies installed
- Check Node.js version (18+ required)

