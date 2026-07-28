# AEGIS X DApp

React + Vite + TypeScript frontend for the AEGIS X protocol (BSC).

## Requirements

- Node.js **22+** (see `.nvmrc`)
- **pnpm 11.17+** via Corepack (`packageManager` in `package.json`)

```bash
corepack enable
corepack prepare pnpm@11.17.0 --activate
```

## Setup

```bash
cp .env.example .env
# Fill VITE_* values as needed; unset vars fall back to src/shared/config/*

pnpm install
pnpm dev
```

- App: `http://127.0.0.1:5174`
- Staging/prod env switch: `pnpm env:staging` | `pnpm env:prod` | `pnpm env:status`

## Quality gates

| Command             | Purpose                                                                              |
| ------------------- | ------------------------------------------------------------------------------------ |
| `pnpm check`        | Typecheck, ESLint (errors), architecture, hex, CSS, knip, Prettier check, unit tests |
| `pnpm build`        | Production build                                                                     |
| `pnpm probe:bundle` | Home bundle budget / pollution probe (run after `build`)                             |
| `pnpm audit:prod`   | Production dependency audit (`high+`; CI reports, may soft-fail on transitive vulns) |

Agent / CI command SSOT: [`docs/agents/commands.md`](docs/agents/commands.md).

## Naming

Business vocabulary first — see [`UBIQUITOUS_LANGUAGE.md`](UBIQUITOUS_LANGUAGE.md) and [`docs/naming.md`](docs/naming.md).
