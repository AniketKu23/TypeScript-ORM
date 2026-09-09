# Light-ORM & Next.js Todo App

This monorepo contains a hand-rolled, minimal TypeScript ORM package (`@light-orm/core`) and a Next.js reference application (`todo-app`) that consumes it. The project is built using `pnpm` workspaces.

## Setup Instructions

1. **Install Dependencies**
   Run the following command at the root of the workspace to install all dependencies:
   ```bash
   pnpm install
   ```

2. **Build the ORM**
   Build the `@light-orm/core` package:
   ```bash
   pnpm build
   ```

## Database Configuration

This project requires a Postgres database. It has been optimized for serverless Postgres poolers (like Neon or Supabase) with transaction-pooling mode (`prepare: false`).

1. **Environment Variables**
   In the `apps/todo-app` directory, copy `.env.local.example` to `.env.local`:
   ```bash
   cp apps/todo-app/.env.local.example apps/todo-app/.env.local
   ```
   Edit `.env.local` and add your database connection string:
   ```env
   DATABASE_URL=postgres://user:password@host/db?sslmode=require
   ```

2. **Database Initialization**
   Run the schema script to create the required `todo` table in your Postgres instance. You can do this by executing `apps/todo-app/db/schema.sql` via `psql` or the query runner in your Supabase/Neon dashboard.

## Running Locally

To run both the ORM's build watcher and the Next.js development server concurrently, run the following at the root:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Next.js Todo application.

## Known Limitations

- **WHERE Clause**: `where` supports equality filters only, combined with `AND`. No `OR`, no `IN`, no comparison operators, no nested/relational filters in this version.
- **Naming**: The table name is taken directly from the string passed to `defineModel` — no pluralization or naming-convention magic.
- **Numeric Columns**: `int8`/`bigint` Postgres columns are out of scope for the `number()` builder in this version. The schema uses `SERIAL`/`INTEGER` (`int4`) columns only, so `number()` stays a true `number` at runtime.
- **Relations**: No relational support (`hasMany`/`belongsTo`) is included.
- **Migrations**: No migration engine; bootstrap DDL is manual.

## Time Spent
Total time spent on this assignment: ~2 hours.

## AI Tools Used
During development, AI tooling (Google Antigravity / Gemini) was used to:
- Generate boilerplate configuration files (`package.json`, `tsconfig.json`, Tailwind setup).
- Construct the initial drafts for documentation and Markdown files.
- Scaffold the Next.js UI components with Tailwind CSS utility classes.
- Ensure type-safety logic and generic inferences aligned perfectly with the assignment brief.
