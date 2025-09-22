# Daily Planner

A focused full-stack planner for managing your day. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma (SQLite), Zustand, React Query, dnd-kit, and date-fns.

## Features

- **Remember card** with autosave rich-text note per day (limited to 280 chars).
- **Time-blocked scheduling** with drag and drop reordering and quick-add parser (`2:30 p review lecture 45m #BIOL112 @UNI !P`).
- **Priority, On, and Should/Could columns** with drag-and-drop between buckets and completion tracking.
- **Notes** linked to tasks and **Dump Box** with promote-to-task dialog.
- **Date switcher** with calendar, search, and filters (context, energy, tags, hide done).
- Optimistic updates, toast notifications, and responsive layout (desktop first, mobile friendly).
- Prisma SQLite persistence with initial seed data for the current day.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Create an `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

For SQLite the default `DATABASE_URL="file:./dev.db"` is sufficient. If you prefer Supabase, set the connection URL in `.env` before running migrations.

### 3. Generate the Prisma client & run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed initial data

```bash
npm run seed
```

### 5. Start the development server

```bash
npm run dev
```

Visit http://localhost:3000/today to use the planner.

### 6. Run tests

```bash
npm run test
```

This executes Vitest unit tests for the quick-add parser and validation schemas.

## Project structure

- `app/` – Next.js App Router pages and UI components.
- `components/ui/` – shadcn/ui primitives customized for the planner.
- `lib/` – Utilities, Prisma client, validation schemas, quick-add parser.
- `store/` – Zustand planner store for date and filter state.
- `prisma/` – Prisma schema and seed script.
- `tests/` – Vitest unit tests.

## Scripts

- `npm run dev` – Start the Next.js dev server.
- `npm run build` – Create a production build.
- `npm run start` – Start the production server.
- `npm run lint` – Run Next.js ESLint checks.
- `npm run seed` – Seed the database with starter content for today.
- `npm run test` – Run Vitest unit tests.

## License

MIT
