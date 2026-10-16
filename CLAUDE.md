# CLAUDE.md

Guidance for AI assistants working in this repo. See README.md for the full overview.

## Stack

Vite + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`), Tailwind CSS v4 (configured in
`src/app/styles.css`, no `tailwind.config.js`), React Router (data router, lazy routes), TanStack
Query, Zustand, Zod. Package manager: **pnpm**.

## Commands

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`: run all four before committing.
- `pnpm format` to apply Prettier (no semicolons, single quotes, width 100, Tailwind class sorting).
- `pnpm test:e2e` for Playwright (set `PLAYWRIGHT_CHROMIUM_PATH` to use a preinstalled Chromium).

## Architecture rules

- Feature-based layout: `src/app` (shell), `src/features/<name>` (domain), `src/pages` (route
  components), `src/shared` (generic). Dependencies flow `app/pages → features → shared`.
- Other modules import a feature only via `@/features/<name>` (its `index.ts`). Inside a feature,
  use relative imports. ESLint `no-restricted-imports` enforces this.
- Pages are default exports and are lazy-loaded via `lazyPage()` in `src/app/router.tsx`.
- Server state: TanStack Query hooks in `features/<name>/hooks`, with a `xxxKeys` query-key factory.
  Client/UI state: Zustand stores inside the owning feature.
- All HTTP goes through `apiClient` in `src/shared/lib/apiClient.ts` with a Zod `schema`.
- Read env vars only via `env` from `src/shared/config/env.ts`; add new ones to its Zod schema and
  to `.env.example`.
- `erasableSyntaxOnly` is on: no enums, namespaces, or constructor parameter properties.
- Use `import type` for type-only imports (enforced).

## Records assistant (server/)

- `server/recordsAssistant.ts` runs one Claude turn (model, instructions, tools fixed server-side);
  `server/vitePlugin.ts` serves it at `/api/records-assistant` in dev/preview. Key: `ANTHROPIC_API_KEY`
  in `.env.local` (server-only). The agent loop and the `read_record` tool run in the browser
  (`src/features/records/assistant/assistantClient.ts`) because record files live in IndexedDB.
- Echo assistant `content` back unchanged (thinking/fallback blocks); send all tool results for a
  turn in one user message.

## Testing

- Colocate unit tests as `*.test.tsx`. Use `renderWithProviders` from `@/test/utils` for anything
  that needs React Query or the router. Mock `fetch` with `vi.spyOn(globalThis, 'fetch')`.
- Query by role/label (Testing Library best practice), not by class or test id.
