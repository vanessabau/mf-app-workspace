# 🏬 Storefront Microfrontend (Module Federation + Rspack + React 19)

This project is a **React 19 microfrontend architecture** using **Module Federation + Rspack** in a **pnpm monorepo**. It consists of:

- **Container (Host)** – runs the main shell and loads remotes
- **Products (Remote)** – exposes federated React components such as `ProductList`

The setup is intentionally minimal, fast, and deployment-friendly.

This application runs locally.

---

## ✅ Tech Stack

| Category | Technology |
|----------|------------|
| Bundler / Dev Server | **Rspack** |
| Federation Runtime | `@module-federation/rspack` |
| Language | TypeScript |
| UI Framework | React 19 |
| State (future) | Jotai |
| Data Layer (future) | TanStack Query |
| Routing (future) | TanStack Router |
| Package Manager | pnpm (workspace monorepo) |

---

## ✅ Monorepo Structure

storefront-mfe/
apps/
container/ (host)
products/ (remote)
pnpm-workspace.yaml
package.json

---
mf-app-workspace/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules/
└── apps/
    ├── container/
    │   ├── .gitignore
    │   ├── AGENTS.md
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── rspack.config.cjs
    │   ├── tsconfig.json
    │   ├── node_modules/
    │   ├── public/
    │   │   └── index.html
    │   ├── @mf-types/
    │   │   ├── index.d.ts
    │   │   └── products/
    │   │       ├── ProductList.d.ts
    │   │       ├── apis.d.ts
    │   │       └── compiled-types/
    │   │           └── ProductList.d.ts
    │   └── src/
    │       ├── App.css
    │       ├── App.tsx
    │       ├── index.css
    │       ├── main.tsx
    │       ├── federation.d.ts
    │       ├── module-federation.d.ts
    │       ├── react-env.d.ts
    │       └── assets/
    │           └── react.svg
    │
    └── products/
        ├── .gitignore
        ├── AGENTS.md
        ├── README.md
        ├── index.html
        ├── package.json
        ├── ProductListWithAdd.tsx
        ├── rspack.config.cjs
        ├── tsconfig.json
        ├── node_modules/
        └── src/
            ├── App.css
            ├── App.tsx
            ├── ProductList.tsx
            ├── index.css
            ├── main.tsx
            ├── global.d.ts
            ├── react-env.d.ts
            └── assets/
                └── react.svg

## ✅ Installation (Fresh Clone)

```sh
pnpm install
```
### ✅ Running the Apps (Development)
Start Products Remote
```bash
pnpm --filter products dev
```
Runs on: http://localhost:3001
Start Container Host
```bash
pnpm --filter container dev
```

Runs on: http://localhost:3000

## ✅ Module Federation Configuration
Remote: apps/products/rspack.config.cjs
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
  dts: false,
  runtimePlugins: [],
})
```
Host: `apps/container/rspack.config.cjs`
```js
new ModuleFederationPlugin({
  name: "container",
  remotes: {
    products: "products@http://localhost:3001/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, eager: true, requiredVersion: false },
    "react-dom": { singleton: true, eager: true, requiredVersion: false },
  },
  dts: false,
  runtimePlugins: [],
})

```
## ✅ Why This Setup Works
Win	- Reason
Rspack + MF plugin	- Fast + native federation support
No conflicting Vite dev servers	- Fewer moving parts
eager + singleton shared React	- Avoids runtime share errors
Disabled type-hint runtime	- Removes noisy websockets & console spam

## ✅ Recreating This From Scratch (Quick Start)
# Micro-Frontend Workspace (Rspack + Module Federation)

This repository is a **pnpm monorepo** containing two Rspack-based React applications wired together using **Module Federation**.

## Architecture Overview

- **Root**
  - Configuration for the pnpm workspace
- **apps/container**
  - Host application
  - Runs on **http://localhost:3000**
  - Consumes remote modules from `products`
- **apps/products**
  - Remote application
  - Runs on **http://localhost:3001**
  - Exposes the `ProductList` component
- **apps/container/@mf-types**
  - Auto-generated TypeScript types for Module Federation

---

## Prerequisites

- Node.js (v18+ recommended)
- pnpm

Install pnpm if needed:
```bash
npm install -g pnpm
## Recreate the repo from zero (mf-app-workspace)
### 0) Prereqs (no corepack)
```
node -v
pnpm -v
```

If pnpm isn’t installed:
```
npm i -g pnpm
```
### 1) Create repo + scaffold the two apps

(“creation scripts” step)
```
mkdir mf-app-workspace
cd mf-app-workspace

pnpm create rspack@latest apps/container
pnpm create rspack@latest apps/products
```

Choose React + TypeScript + EsLint for both.

This is what produces the real application scaffolding:

src/

main.tsx

App.tsx

CSS

assets

tsconfig

### 2) Turn it into a pnpm workspace

Create pnpm-workspace.yaml at the repo root:
```
packages:
  - "apps/*"
```

(Optional but handy) root package.json:
```
{
  "name": "mf-app-workspace",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev:products": "pnpm -C apps/products dev",
    "dev:container": "pnpm -C apps/container dev",
    "dev": "pnpm -C apps/products dev & pnpm -C apps/container dev"
  }
}
```
### 3) Set each app to your working dependencies + scripts

Replace the following files with your known working versions:

`apps/container/package.json`

`apps/products/package.json`

Important details from your working setup:

products runs:

`MF_DISABLE_TYPEHINTS=1 rspack serve`


container runs:

`rspack serve --config rspack.config.cjs`


These scripts are part of why the setup runs cleanly.

### 4) Install dependencies (root)
pnpm install

### 5) Add the Module Federation Rspack configs
#### 5a) apps/products/rspack.config.cjs (remote, port 3001)

This config must:

listen on 3001

output remoteEntry.js

name: "products"

expose ./ProductList from ./src/ProductList.tsx

serve from public/

have dts: false and runtimePlugins: []

Use your working apps/products/rspack.config.cjs.

### 5b) apps/container/rspack.config.cjs (host, port 3000)

Use your exact working file:

listen on 3000

remote:

products@http://localhost:3001/remoteEntry.js


same shared React singleton config

dts: false

runtimePlugins: []

### 6) Put the remote component in the right place
apps/products/src/ProductList.tsx


Use your real component (iPhone / MacBook / iPad list).

You can also keep ProductListWithAdd.tsx, but note:

It currently lives at:

apps/products/ProductListWithAdd.tsx


(outside src/)

If you want to expose it too, you must either:

move it into src/, or

expose it from its current path in rspack.config.cjs

### 7) Ensure each app’s public/index.html exists

Your configs serve the public/ directory.

Required files:

apps/products/public/index.html
apps/container/public/index.html


Each must include:

<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>


If index.html also exists at the app root, it is ignored in dev.
public/index.html is the one that matters.

### 8) Container consumes the remote

In the container app (usually App.tsx or main.tsx):

const ProductList = React.lazy(() => import("products/ProductList"));


✅ In your repo, TypeScript is handled by:

apps/container/src/federation.d.ts

apps/container/src/module-federation.d.ts

apps/container/@mf-types/...

You should NOT add a manual
declare module "products/ProductList"
unless you remove this setup.

### 9) TypeScript + @mf-types (IMPORTANT: no generation step)

There is no command in this repo that generates @mf-types.

Your setup works as follows:

@mf-types was generated once in the past

It is checked in

It is copied, not regenerated

Live DTS generation is intentionally disabled:

dts: false
runtimePlugins: []


To recreate this repo exactly:

Copy the apps/container/@mf-types directory from the working repository

Ensure these files exist:

apps/container/src/federation.d.ts
apps/container/src/module-federation.d.ts


Those files bridge the remote module names to the pre-generated types.

There is no additional step here.

### 10) Run locally (two terminals)

Terminal 1 (remote first):
```
pnpm --filter products dev
```

Check:

`http://localhost:3001/remoteEntry.js`


Terminal 2 (host):
```
pnpm --filter container dev
```

Open:

`http://localhost:3000`

Final notes

If all steps above are followed exactly:

Runtime Module Federation works

TypeScript works without hacks

@mf-types resolves correctly

No DTS plugins are required

The recreated repo matches the working one 1:1

This is now copy-paste exact for your actual setup.

## ✅ Next Steps (Planned)
### Feature	 - Status
Shared cart via Jotai	⏳
Fetch products via TanStack Query	⏳
Routing (TanStack Router)	⏳
Deploy container & products on Vercel ⏳

## ✅ Summary

You now have:

A clean React microfrontend architecture

Working runtime Module Federation

Independently runnable apps

A repeatable, teachable, and deployable foundation

To continue, run:
```js
pnpm --filter products dev
pnpm --filter container dev
```
