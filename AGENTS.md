# AGENTS.md

This repository is a Bun workspace monorepo for an unofficial saizeriya-compatible
mock server, client library, and 3rd-party client app.

## Repo layout

- `packages/server` (`@repo/saizeriya-server`) — Hono-based mock server that
  emulates the real ordering pages (`/saizeriya2/`, `/saizeriya3/`) and PHP
  endpoints (`/src/cmd/*.php`). Has a debug UI at `/dashboard`.
  Entry: `packages/server/src/main.ts`. HTML templates live in
  `packages/server/src/template/`, seed data in `src/data/menu.json`,
  static assets under `packages/server/assets/`.
- `packages/client` (`saizeriya.js`) — public npm package + CLI. Wraps the
  ordering flow: parses HTML responses with `node-html-parser` to extract
  `nextId` / `token` / `sessionId`, then submits the next form. Requests are
  serialized through `createQueueLocker` because the real backend dislikes
  concurrent calls.
- `apps/betterzeriya` — SvelteKit 5 + Tailwind 4 client app. Depends on
  `saizeriya.js` via `workspace:*`. Three adapters are wired (node, cloudflare,
  vercel); the active one is selected by `CLOUDFLARE=1` / `VERCEL=1` env vars
  at build time.
- `.agents/menu-image-assets/` — Agent Skill for fetching menu images.

## Toolchain

The project standardises on **`vite-plus` (`vp`)** for format / lint / test —
not ESLint, Prettier, or Vitest directly. Always go through the root scripts:

| Task              | Command                                                         |
| ----------------- | --------------------------------------------------------------- |
| Format + autofix  | `bun check:fix`                                                 |
| Format check only | `bun run format:check`                                          |
| Lint              | `bun run lint` (or `lint:fix`)                                  |
| Run tests         | `bun run test`                                                  |
| Watch tests       | `bun run test:watch`                                            |
| Mock server dev   | `bun dev` (serves `packages/server`, dashboard at `/dashboard`) |
| Betterzeriya dev  | `bun run dev:app`                                               |
| Build app         | `bun run betterzeriya:build`                                    |
| Start built app   | `bun run betterzeriya:start`                                    |

Tests are written against `vite-plus/test` (Vitest-compatible API:
`describe` / `it` / `expect`). The client tests exercise the real mock server
in-process by passing `mockServer.fetch` as `fetchSource` — keep that contract
intact when changing either side.

Type checking for the SvelteKit app: `bun run --cwd apps/betterzeriya check`.

## Conventions

- Runtime: **Bun** for scripts and the mock server (`Bun.file`, `bun --watch`).
  Don't introduce Node-only APIs in `packages/server` or in scripts.
- Module system: ESM only (`"type": "module"`). No CommonJS.
- Imports: keep extension-less TS imports; the client publishes `.mjs` + `.d.mts`
  via `vp pack`.
- The mock server responses must stay byte-shape compatible with the real
  saizeriya pages (the client parses them with regex/DOM selectors). When you
  edit a `template/*.ts` file, run `bun run test` — the client tests will catch
  most regressions.
- Don't commit anything that depends on a real saizeriya endpoint. Tests must
  run fully offline against the in-process mock server.

## Pull request hygiene

- Run `bun check:fix` and `bun run test` before opening a PR.
- Keep changes scoped to one of `packages/server`, `packages/client`, or
  `apps/betterzeriya` when possible; cross-package changes should explain the
  contract that's moving.
