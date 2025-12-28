# Deployment Guide

This Module Federation application can be deployed to various hosting platforms. This guide covers GitHub Pages deployment (with alternatives noted).

## Quick Start - GitHub Pages

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment" → Source: Select **GitHub Actions**

### 2. Configure URLs (if needed)

The deployment workflow is pre-configured for GitHub Pages with the pattern:

- Container: `https://<username>.github.io/<repo>/`
- Products: `https://<username>.github.io/<repo>/products/`

If you need different URLs, edit `.github/workflows/deploy.yml` and update the `CONTAINER_URL` and `PRODUCTS_URL` environment variables.

### 3. Push to main branch

```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

### 4. Monitor deployment

- Go to the **Actions** tab in your GitHub repository
- Watch the "Deploy Module Federation Apps" workflow run
- Once complete, your app will be live at `https://<username>.github.io/<repo>/`

## Local Production Build

To test the production build locally:

```bash
# Build both apps
pnpm build

# Serve locally (requires a static server)
npx serve apps/container/dist -p 3000 &
npx serve apps/products/dist -p 3001
```

## Alternative Deployment Platforms

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Update URLs in the workflow or use `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "deploy",
  "installCommand": "pnpm install"
}
```

3. Deploy: `vercel --prod`

### Netlify

1. Add `netlify.toml`:

```toml
[build]
  command = "pnpm build && mkdir -p deploy && cp -r apps/container/dist/* deploy/ && mkdir -p deploy/products && cp -r apps/products/dist/* deploy/products/"
  publish = "deploy"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `CONTAINER_URL`: Your Netlify domain
   - `PRODUCTS_URL`: Your Netlify domain + `/products/`

### AWS S3 + CloudFront

1. Build the apps
2. Upload to S3:
   - Container → bucket root
   - Products → `/products` prefix
3. Set up CloudFront distribution
4. Update rspack configs with CloudFront URL

## Environment Variables

For production deployments, set these environment variables:

- `NODE_ENV=production` - Enables production mode
- `CONTAINER_URL` - Full URL where container app is hosted (with trailing slash)
- `PRODUCTS_URL` - Full URL where products app is hosted (with trailing slash)

## Troubleshooting

### Module not loading

- Check browser console for CORS errors
- Verify `PRODUCTS_URL` in container config matches actual products deployment URL
- Ensure both apps are deployed and accessible

### 404 errors

- Verify the `publicPath` in rspack configs matches your deployment structure
- Check that files are in the correct directories

### Blank page

- Check browser console for errors
- Verify environment variables are set correctly during build
- Test production build locally first

## Custom Domain

If using a custom domain:

1. Update the `CONTAINER_URL` and `PRODUCTS_URL` in `.github/workflows/deploy.yml`
2. Configure DNS records with your hosting provider
3. Add CNAME file to deployment (for GitHub Pages)

Example with custom domain:

```yaml
env:
  CONTAINER_URL: https://www.yourdomain.com/
  PRODUCTS_URL: https://www.yourdomain.com/products/
```
