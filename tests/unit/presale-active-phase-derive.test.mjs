import assert from 'node:assert/strict'
import test from 'node:test'

test('usePresaleActivePhaseQuery derives from phases without a second Multicall reader', async () => {
  const source = await import('node:fs/promises').then((fs) =>
    fs.readFile(new URL('../../src/web3/use-presale-queries.ts', import.meta.url), 'utf8'),
  )

  assert.match(source, /findActivePresalePhase/)
  assert.doesNotMatch(source, /readActivePresalePhase/)
})
