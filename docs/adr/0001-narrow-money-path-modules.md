# ADR-0001: Narrow money-path modules — reject mega orchestrator

## Status

Accepted · 2026-07-29

## Context

7-rail DApp money paths each copy `lock → pre-read → gate → live-read → gate → write → clear → invalidate`. Architecture review candidate C1 proposed deepening this choreography. Multi-agent design debate produced three shapes: a fat `runMoneyWrite` orchestrator, a Mixed-only dual-gate Result algebra, and a critic arguing mega orchestration fails the deletion test.

## Decision

Deliver **two narrow deep modules**, not one cross-rail orchestrator:

1. **`submitWithUnknownReceiptLock`** (`src/web3/wallet/submit-with-unknown-receipt-lock.ts`) — owns unknown-receipt ordering only (reject if latched → success clear → unknown lock). Caller still owns `invalidate*`.
2. **`dualCheckMixedClaim`** (`src/core/assets/dual-check-mixed-claim.ts`) — frozen intent amount vs two independent snapshots; phase `intent` | `live`. Pure; no wallet / WRITE_PATH.

Migration order: Release submit first (envelope), then assets Mixed (dual-gate + envelope). Rewards Mixed later as a second dual-gate adapter — do not generalize until two real adapters exist.

## Consequences

- **Do not** introduce `runLiveWritePath` / phases state machines spanning exchange + staking + claim rails.
- **Do not** put `invalidate*` inside the unknown envelope.
- Pure `core/*-gates` and `unknown-receipt-lock` remain as they are; new modules compose them.
- Future architecture reviews should not re-suggest a mega money-path orchestrator without reopening this ADR.
