# Thriver

A scalable React starter built with **Vite**, **React 19**, **TypeScript (strict)** and **Tailwind CSS v4**.

| Concern      | Tool                                           |
| ------------ | ---------------------------------------------- |
| Routing      | React Router (lazy-loaded routes)              |
| Server state | TanStack Query                                 |
| Client state | Zustand                                        |
| Validation   | Zod (env vars + API responses)                 |
| Quality      | ESLint, Prettier, Husky + lint-staged          |
| Testing      | Vitest + React Testing Library, Playwright e2e |
| CI           | GitHub Actions                                 |

## Getting started

Requires Node 24 LTS (or 22.22.2+; see `.nvmrc`) and pnpm (`corepack enable`).

```bash
pnpm install
cp .env.example .env.local   # optional; defaults are provided
pnpm dev                     # http://localhost:5173
```

## Scripts

| Script                         | What it does                                  |
| ------------------------------ | --------------------------------------------- |
| `pnpm dev`                     | Start the dev server                          |
| `pnpm build`                   | Type-check and build for production (`dist/`) |
| `pnpm preview`                 | Serve the production build                    |
| `pnpm lint`                    | Run ESLint                                    |
| `pnpm format` / `format:check` | Format with Prettier / check formatting       |
| `pnpm typecheck`               | Run the TypeScript compiler                   |
| `pnpm test` / `test:watch`     | Run unit tests once / in watch mode           |
| `pnpm test:e2e`                | Build, serve, and run Playwright tests        |

First-time e2e setup: `pnpm exec playwright install chromium`.

## Folder structure

```
src/
  app/            App shell: providers, router, mobile layout with tab bar, error boundaries, styles
  features/       One folder per domain feature
    posts/          Example feature (data fetching)
      api/            API calls (use shared/lib/apiClient)
      components/     Feature UI (+ colocated *.test.tsx)
      hooks/          React Query hooks and query keys
      types.ts        Zod schemas and inferred types
      index.ts        Public API: the only file other modules may import
    appointments/   Appointments calendar: month view, day list, upcoming, add/delete
    home/           Home screen sections (greeting, activities, focus, recommendations)
    medication/     Medications with daily dose times and a today checklist
    mood-check-in/  Daily mood check-in, streak/stats and weekly mood (Zustand, persisted)
    profile/        Profile header with editable display name (Zustand, persisted)
    splash/         Animated splash screen shown when the app opens
    theme/          Dark-mode store + toggle (not currently mounted)
  pages/          Thin route components that compose features (default export, lazy-loaded)
  shared/         Feature-agnostic code
    config/         Validated env config
    lib/            API client, query client
    ui/             Reusable UI primitives (Button, Spinner, ...)
    utils/          Pure helpers
  test/           Test setup and render helpers
e2e/              Playwright tests
```

## Conventions

- **Imports:** use the `@/` alias for cross-folder imports. Import a feature only through its `index.ts`
  (`@/features/posts`, never `@/features/posts/components/...`). ESLint enforces this.
- **Dependency direction:** `pages → features → shared`. `shared` never imports from `features` or `pages`.
- **Server data** goes through TanStack Query, never Zustand. Keep Zustand for UI/client state.
- **API responses** are validated with a Zod schema passed to `apiClient`.
- **Env vars** must be added to `src/shared/config/env.ts` and `.env.example`.
- **Tests** live next to the code they test (`Foo.tsx` → `Foo.test.tsx`).

## Adding a feature

1. Create `src/features/<name>/` with `types.ts`, `api/`, `hooks/`, `components/` as needed.
2. Export the public pieces from `src/features/<name>/index.ts`.
3. Add a page in `src/pages/<Name>Page.tsx` (default export).
4. Register the route in `src/app/router.tsx` with `lazy: lazyPage(() => import('@/pages/<Name>Page'))`.
5. Add tests and run `pnpm lint && pnpm typecheck && pnpm test`.
