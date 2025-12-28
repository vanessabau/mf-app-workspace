# Container App (Host)

This is the **host application** in the Module Federation setup. It loads and orchestrates remote micro-frontends.

## Setup

Install the dependencies from the root of the monorepo:

```bash
cd ../..
pnpm install
```

## Development

Start the dev server (runs on **http://localhost:3000**):

```bash
pnpm run dev
```

Or from the root:

```bash
pnpm --filter container dev
```

**Note:** Always start the products app first before starting the container app in development.

## Build for Production

Build the app:

```bash
pnpm run build
```

This creates a `dist/` directory with production-ready files.

## Deployment (Vercel)

This app is configured for deployment on Vercel with `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "cd ../.. && pnpm install"
}
```

### Deployment Steps:

1. Create a Vercel project
2. Set **Root Directory** to `apps/container`
3. Add environment variables:
   - `CONTAINER_URL` = `https://your-container-app.vercel.app/`
   - `PRODUCTS_URL` = `https://your-products-app.vercel.app/`
4. Deploy

**Important:** Deploy the products app first, then the container app.

## Module Federation Configuration

This app acts as a **host** and consumes remote modules:

```js
new ModuleFederationPlugin({
  name: "container",
  remotes: {
    products: `products@${PRODUCTS_URL}remoteEntry.js`,
  },
  shared: {
    react: { singleton: true, eager: true, requiredVersion: false },
    "react-dom": { singleton: true, eager: true, requiredVersion: false },
  },
});
```

## Learn more

- [Rspack documentation](https://rspack.rs)
- [Module Federation documentation](https://module-federation.io/)
- [Rspack GitHub repository](https://github.com/web-infra-dev/rspack)
