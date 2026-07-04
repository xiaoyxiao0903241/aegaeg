import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const CONTRACT_ENV_KEYS = {
  VITE_BSC_USD1: 'usd1',
  VITE_BSC_USDT: 'usdt',
  VITE_BSC_PANCAKE_V3_SWAP_ROUTER: 'pancakeV3SwapRouter',
  VITE_BSC_PANCAKE_V3_QUOTER: 'pancakeV3Quoter',
  VITE_BSC_USDT_USD1_POOL: 'usdtUsd1Pool',
  VITE_BSC_PRESALE: 'preSale',
  VITE_BSC_COMMUNITY_FUND_VAULT: 'communityFundVault',
  VITE_BSC_REFERRAL: 'referral',
  VITE_BSC_REWARD_CLAIMER: 'rewardClaimer',
  VITE_BSC_USD1_SWAP: 'usd1Swap',
}

function normalizeAddress(address) {
  return address.toLowerCase()
}

function contractAddressSnapshot(contracts) {
  return Object.fromEntries(
    Object.values(CONTRACT_ENV_KEYS).map((field) => [
      field,
      normalizeAddress(contracts[field]),
    ]),
  )
}

function snapshotsEqual(left, right) {
  return Object.keys(left).every((key) => left[key] === right[key])
}

function parseStagingLocalContractSnapshot() {
  const stagingPath = resolve(projectRoot, 'env/staging.local')
  if (!existsSync(stagingPath)) return null

  const snapshot = {}
  for (const line of readFileSync(stagingPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const envKey = trimmed.slice(0, separatorIndex)
    const field = CONTRACT_ENV_KEYS[envKey]
    if (!field) continue

    snapshot[field] = normalizeAddress(trimmed.slice(separatorIndex + 1))
  }

  return Object.keys(snapshot).length > 0 ? snapshot : null
}

test('DEFAULT_BSC_CONTRACTS matches prod deployment snapshot', async () => {
  const { DEFAULT_BSC_CONTRACTS } = await loadModule('/src/config/contracts.ts')

  assert.equal(DEFAULT_BSC_CONTRACTS.chainId, 56)
  assert.deepEqual(contractAddressSnapshot(DEFAULT_BSC_CONTRACTS), {
    usd1: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
    usdt: '0x55d398326f99059ff775485246999027b3197955',
    pancakeV3SwapRouter: '0x1b81d678ffb9c0263b24a97847620c99d213eb14',
    pancakeV3Quoter: '0xb048bbc1ee6b733fffcfb9e9cef7375518e25997',
    usdtUsd1Pool: '0x9c4ee895e4f6ce07ada631c508d1306db7502cce',
    preSale: '0xcb8ebebd2b4a03ab16a28021ad9ed50b125be618',
    communityFundVault: '0xef11751f13ff5578c6fa1c6e9ef99bb917a4d5e6',
    referral: '0xfe7803230d11bc6fb248f1629a3353e409a2db29',
    rewardClaimer: '0xc6b3d73ba06594dc78be538f65307c6eb348e13e',
    usd1Swap: '0xae1155cf325277acce615cc310dd52da8e46c6e3',
  })
})

test('BSC_CONTRACTS runtime matches prod defaults or staging env template', async () => {
  const { BSC_CONTRACTS, DEFAULT_BSC_CONTRACTS } = await loadModule('/src/config/contracts.ts')

  assert.equal(BSC_CONTRACTS.chainId, 56)

  const runtime = contractAddressSnapshot(BSC_CONTRACTS)
  const prod = contractAddressSnapshot(DEFAULT_BSC_CONTRACTS)
  const staging = parseStagingLocalContractSnapshot()

  const matchesProd = snapshotsEqual(runtime, prod)
  const matchesStaging = staging !== null && snapshotsEqual(runtime, staging)

  assert.ok(
    matchesProd || matchesStaging,
    'BSC_CONTRACTS must match DEFAULT_BSC_CONTRACTS (prod) or env/staging.local overrides',
  )
})
