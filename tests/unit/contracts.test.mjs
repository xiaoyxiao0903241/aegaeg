import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { loadModule } from './load-module.mjs'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const CONTRACT_ENV_KEYS = {
  VITE_BSC_WBNB: 'wbnb',
  VITE_BSC_USD1: 'usd1',
  VITE_BSC_USDT: 'usdt',
  VITE_BSC_PANCAKE_ROUTER: 'pancakeRouter',
  VITE_BSC_PANCAKE_PAIR: 'pancakePair',
  VITE_BSC_MULTICALL3: 'multicall3',
  VITE_BSC_PRESALE: 'preSale',
  VITE_BSC_COMMUNITY_FUND_VAULT: 'communityFundVault',
  VITE_BSC_REFERRAL: 'referral',
  VITE_BSC_REWARD_CLAIMER: 'rewardClaimer',
  VITE_BSC_USD1_SWAP: 'usd1Swap',
  VITE_BSC_AGX: 'agx',
  VITE_BSC_GAGX: 'gagx',
  VITE_BSC_X_TOKEN: 'xToken',
  VITE_BSC_AGX_CONTRIBUTION_SWAP: 'agxContributionSwap',
  VITE_BSC_TURBINE: 'turbine',
  VITE_BSC_LIQUID_STAKING: 'liquidStaking',
  VITE_BSC_LOCKED_STAKING_180D: 'lockedStaking180d',
  VITE_BSC_LOCKED_STAKING_360D: 'lockedStaking360d',
  VITE_BSC_LOCKED_STAKING_540D: 'lockedStaking540d',
  VITE_BSC_BOND_HELPER: 'bondHelper',
  VITE_BSC_BOND_DEPOSITORY_180D: 'bondDepository180d',
  VITE_BSC_BOND_DEPOSITORY_360D: 'bondDepository360d',
  VITE_BSC_BOND_DEPOSITORY_540D: 'bondDepository540d',
  VITE_BSC_BURN_BOND_DEPOSITORY_180D: 'burnBondDepository180d',
  VITE_BSC_BURN_BOND_DEPOSITORY_360D: 'burnBondDepository360d',
  VITE_BSC_BURN_BOND_DEPOSITORY_540D: 'burnBondDepository540d',
  VITE_BSC_X_STAKING_POOL: 'xStakingPool',
}

function normalizeAddress(address) {
  return address.toLowerCase()
}

function parseEnvFile(path) {
  if (!existsSync(path)) return {}

  const snapshot = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const envKey = trimmed.slice(0, separatorIndex)
    snapshot[envKey] = trimmed.slice(separatorIndex + 1).trim()
  }
  return snapshot
}

/** Vite 文件序：`.env` → `.env.local`（与 `load-module` 写入 process.env 一致）。 */
function resolveViteEnvContracts() {
  const merged = {
    ...parseEnvFile(resolve(projectRoot, '.env')),
    ...parseEnvFile(resolve(projectRoot, '.env.local')),
  }

  const snapshot = {}
  for (const [envKey, field] of Object.entries(CONTRACT_ENV_KEYS)) {
    const value = merged[envKey]
    if (!value) {
      throw new Error(`Missing ${envKey} in .env / .env.local (fail-closed; no code defaults)`)
    }
    snapshot[field] = normalizeAddress(value)
  }
  return snapshot
}

test('DEFAULT_BSC_CONTRACTS is removed (no code address fallbacks)', async () => {
  const mod = await loadModule('/src/shared/config/contracts.ts')
  assert.equal(mod.DEFAULT_BSC_CONTRACTS, undefined)
})

test('BSC_CONTRACTS matches Vite-resolved env (fail-closed)', async () => {
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const expected = resolveViteEnvContracts()

  assert.equal(BSC_CONTRACTS.chainId, 56)
  for (const [field, address] of Object.entries(expected)) {
    assert.equal(
      normalizeAddress(BSC_CONTRACTS[field]),
      address,
      `${field} must equal env (got ${BSC_CONTRACTS[field]})`,
    )
  }
})

test('env/manual.bsc.addresses.env matches docs/onchain-manual/00-addresses.md', () => {
  const md = readFileSync(resolve(projectRoot, 'docs/onchain-manual/00-addresses.md'), 'utf8')
  const envText = readFileSync(resolve(projectRoot, 'env/manual.bsc.addresses.env'), 'utf8')

  const mdAddresses = [...md.matchAll(/`\[?(0x[a-fA-F0-9]{40})`\]?/g)].map((m) =>
    m[1].toLowerCase(),
  )

  assert.ok(mdAddresses.length >= 40, 'manual should list deployment addresses')

  for (const addr of new Set(mdAddresses)) {
    assert.ok(
      envText.toLowerCase().includes(addr),
      `manual address ${addr} missing from env/manual.bsc.addresses.env`,
    )
  }
})
