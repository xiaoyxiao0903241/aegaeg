# Issue tracker: Local Markdown

Issues and specs (you may know a spec as a PRD) for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec may live at `.scratch/<feature-slug>/spec.md` **or** under `docs/superpowers/specs/` when published there (still referenced from the map)
- **Wayfinder decision issues**: one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`
- **Implement tickets** (after `/to-tickets`): `.scratch/<feature-slug>/tickets/<NN>-<slug>.md` — agent-ready build slices; **not** the same as decision `issues/`
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## Implement ticket template

Use for files under `tickets/`. Product bullets may list example labels (e.g. 活期/180); **Ownership** must say where code and copy live. See [`implement-checklist.md`](./implement-checklist.md) and root `AGENTS.md` §8.0.

```markdown
# NN — <short title>

**What to build:** <user-visible outcome>

**Blocked by:** None | <ticket ids>

**Status:** ready-for-agent

## Ownership

- **Chrome** (if any): `src/shared/ui/…` — visual / a11y / motion only; no domain options or locale strings
- **Call site**: `src/views/dapp/<tab>/…` — assembles options, wires state, money path
- **Copy / aria-label**: `src/i18n/messages/…` (PC SSOT); pass into components as props
- **On-chain / addresses**: `docs/frontend-manual/` + `VITE_BSC_*` via `shared/config` — never hardcode in UI

## Acceptance

- [ ] …
- [ ] … (`options` / labels from call site + i18n when using Segment / Slider / similar)

## Parent

Spec: `…` · Wayfinder `…`
```

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.

After the map clears: `/to-spec` → `/to-tickets` → implement files under `tickets/` → `/implement` per ticket (fresh context; checklist above).
