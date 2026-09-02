import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

const OFFICIAL_USDT = '0x55d398326f99059fF775485246999027B3197955'
const STAGING_USDT = '0x5CeDC73b36624caa24581D8567b02a07d3cCeF2A'

function parseEnvValues(text) {
  const values = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue
    values[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1).trim()
  }
  return values
}

function readEnv(relativePath) {
  return parseEnvValues(readFileSync(resolve(root, relativePath), 'utf8'))
}

test('env/prod.env and env/staging.env are complete vs .env.example', () => {
  const catalog = readEnv('.env.example')
  const prod = readEnv('env/prod.env')
  const staging = readEnv('env/staging.env')
  const catalogKeys = Object.keys(catalog)

  assert.ok(catalogKeys.length > 40, 'example catalog should list runtime keys')

  for (const key of catalogKeys) {
    assert.ok(key in prod, `env/prod.env missing ${key}`)
    assert.ok(prod[key], `env/prod.env empty ${key}`)
    assert.ok(key in staging, `env/staging.env missing ${key}`)
    assert.ok(staging[key], `env/staging.env empty ${key}`)
  }

  assert.deepEqual(Object.keys(staging).sort(), Object.keys(prod).sort())

  const prodLines = readFileSync(resolve(root, 'env/prod.env'), 'utf8').split('\n')
  const stagingLines = readFileSync(resolve(root, 'env/staging.env'), 'utf8').split('\n')
  assert.equal(
    stagingLines.length,
    prodLines.length,
    'prod/staging must share the same line skeleton',
  )
  for (let i = 0; i < prodLines.length; i++) {
    const prodKey = assignmentKey(prodLines[i])
    const stagingKey = assignmentKey(stagingLines[i])
    assert.equal(stagingKey, prodKey, `line ${i + 1} key mismatch`)
  }
})

function assignmentKey(line) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return null
  return trimmed.slice(0, trimmed.indexOf('='))
}

test('staging profile overrides API host and test USDT; secrets are filled', () => {
  const prod = readEnv('env/prod.env')
  const staging = readEnv('env/staging.env')

  assert.equal(prod.VITE_BSC_USDT, OFFICIAL_USDT)
  assert.equal(staging.VITE_BSC_USDT, STAGING_USDT)
  assert.equal(staging.VITE_BSC_XX_TOKEN, STAGING_USDT)
  assert.equal(staging.VITE_API_BASE_URL, 'https://api.xdpro.cc/api')
  assert.equal(staging.VITE_APP_HOST, 'xdpro.cc')
  assert.equal(prod.VITE_APP_HOST, 'aegis-x.io')

  assert.ok(prod.VITE_THIRDWEB_CLIENT_ID)
  assert.ok(prod.VITE_WALLETCONNECT_PROJECT_ID)
  assert.ok(prod.VITE_BSC_RPC_URL)
  assert.equal(staging.VITE_THIRDWEB_CLIENT_ID, prod.VITE_THIRDWEB_CLIENT_ID)
  assert.equal(staging.VITE_WALLETCONNECT_PROJECT_ID, prod.VITE_WALLETCONNECT_PROJECT_ID)
  assert.equal(staging.VITE_BSC_RPC_URL, prod.VITE_BSC_RPC_URL)
})
