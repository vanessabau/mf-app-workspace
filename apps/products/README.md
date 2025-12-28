# Products App (Remote)

This is the **remote application** in the Module Federation setup. It exposes components to be consumed by the container (host) app.

## Setup

Install the dependencies from the root of the monorepo:

```bash
cd ../..
pnpm install
```

## Development

Start the dev server (runs on **http://localhost:3001**):

```bash
pnpm run dev
```

Or from the root:

```bash
pnpm --filter products dev
```

**Note:** Start this app before starting the container app in development.

## Build for Production

Build the app:

```bash
pnpm run build
```

This creates a `dist/` directory with production-ready files, including `remoteEntry.js`.

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
2. Set **Root Directory** to `apps/products`
3. Add environment variable:
   - `PRODUCTS_URL` = `https://your-products-app.vercel.app/`
4. Deploy

**Important:** This app should be deployed **first** before the container app.

## Module Federation Configuration

This app acts as a **remote** and exposes components:

```js
new ModuleFederationPlugin({
  name: "products",
  filename: "remoteEntry.js",
  exposes: {
    "./ProductList": "./src/ProductList.tsx",
  },
  shared: {
    react: { singleton: true, eager: true, requiredVersion: false },
    "react-dom": { singleton: true, eager: true, requiredVersion: false },
  },
});
```

### Exposed Components:

- `./ProductList` - Product listing component

## Learn more

- [Rspack documentation](https://rspack.rs)
- [Module Federation documentation](https://module-federation.io/)
- [Rspack GitHub repository](https://github.com/web-infra-dev/rspack)
