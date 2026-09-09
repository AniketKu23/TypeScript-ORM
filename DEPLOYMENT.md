# Publishing & Deployment Guide

This guide outlines the theoretical steps required to publish the `@light-orm/core` package to the npm registry and deploy the `todo-app` to a production hosting environment like Vercel.

## 1. Publishing `@light-orm/core` to npm

Since the project uses a monorepo structure with `pnpm`, publishing the isolated package is straightforward.

### Prerequisites
- You must have an npm account.
- Log in to your npm account via the CLI:
  ```bash
  npm login
  ```

### Steps to Publish

1. **Build the Package:**
   Ensure the latest changes are compiled and types are generated.
   ```bash
   pnpm --filter @light-orm/core build
   ```

2. **Verify Package Configuration:**
   Ensure `packages/orm/package.json` has the correct metadata:
   - `"name": "@your-scope/light-orm-core"` (Replace `@light-orm` with your actual npm scope if necessary).
   - `"version": "0.1.0"` (Ensure the version is bumped for subsequent publishes).
   - `"publishConfig": { "access": "public" }"` (Required for scoped packages).

3. **Publish:**
   Navigate into the package directory and publish:
   ```bash
   cd packages/orm
   npm publish --access public
   ```
   *(Alternatively, run `pnpm publish --filter @light-orm/core --access public` from the monorepo root)*.

---

## 2. Deploying `todo-app` to Vercel

Vercel provides zero-configuration deployments for Next.js apps, but since this app is inside a monorepo, a few specific settings are required.

### Prerequisites
- A Vercel account linked to your GitHub/GitLab repository.
- A production PostgreSQL database (e.g., Neon or Supabase) with the `todo` table initialized.

### Steps to Deploy

1. **Push to GitHub:**
   Ensure your entire monorepo is pushed to a Git repository.

2. **Import Project in Vercel:**
   - Go to the Vercel Dashboard and click **Add New... > Project**.
   - Import your monorepo repository.

3. **Configure Project Settings:**
   During the import configuration, set the following:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/todo-app`
   
   Vercel will automatically detect the `pnpm` monorepo workspace and link `@light-orm/core` correctly during the build phase.

4. **Environment Variables:**
   Under the "Environment Variables" section, add your production database URL:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
   *(Ensure you are using the transaction pooler connection string if using Supabase/Neon)*

5. **Deploy:**
   Click **Deploy**. Vercel will run `pnpm install`, build the Next.js app (which triggers the build of `@light-orm/core` via workspace dependencies), and deploy your serverless functions.

### Database Migrations in Production
Before the app is fully functional, you must initialize the production database schema. Connect to your production database using `psql` or your provider's SQL editor and run the contents of `apps/todo-app/db/schema.sql`.
