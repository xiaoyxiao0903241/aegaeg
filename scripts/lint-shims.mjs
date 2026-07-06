#!/usr/bin/env node
/**
 * Validates migration shims are one-line re-exports and tracks removal target (R8-refactor).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** @type {{ path: string; removeBy: string }[]} */
const SHIMS = [
  // core/swap
  { path: 'src/lib/swap/swap-pair.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/swap/token-amount.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/swap/calc-sqrt-price-impact-bps.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/swap/quote-v3-exact-input.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/swap/build-swap-deadline.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/swap/calc-amount-out-min.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/swap/resolve-swap-action.ts', removeBy: 'R8-refactor' },
  // core/presale
  { path: 'src/lib/presale/presale-math.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/presale/rank.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/presale/tier-progress.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/presale/tier-table.ts', removeBy: 'R8-refactor' },
  // core/auth + views/dapp/auth
  { path: 'src/lib/api/auth/auth-machine.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/resolve-auth-status.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/auth-address.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/jwt.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/session.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/login-signature-cache.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/build-login-message.ts', removeBy: 'R8-refactor' },
  { path: 'src/lib/api/auth/login-with-wallet.ts', removeBy: 'R8-refactor' },
  // views/dapp/swap
  { path: 'src/app/tabs/swap-tab.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/index.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/flash-swap-content.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/flash-swap-widget-context.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/flash-swap-widget.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-hub-about-card.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-hub-content.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-hub-widget.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-mode-card.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-program-cards.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-subview-providers.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/swap-widget-header.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/token-about-card.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/trade-swap-content.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/trade-swap-widget-context.tsx', removeBy: 'R8-refactor' },
  { path: 'src/app/tabs/swap/trade-swap-widget.tsx', removeBy: 'R8-refactor' },
]

const SHIM_PATTERN = /^export \* from '~\/[^']+'\s*;?\s*$/

let failed = false

for (const { path, removeBy } of SHIMS) {
  const absolute = resolve(path)
  let content
  try {
    content = readFileSync(absolute, 'utf8').trim()
  } catch {
    console.error(`lint:shims — missing shim: ${path} (remove by ${removeBy})`)
    failed = true
    continue
  }

  if (!SHIM_PATTERN.test(content)) {
    console.error(`lint:shims — invalid shim (expected one-line export *): ${path}`)
    failed = true
  }
}

if (failed) {
  process.exit(1)
}

console.log(`lint:shims — ${SHIMS.length} shims OK`)
