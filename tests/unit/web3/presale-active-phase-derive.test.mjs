import assert from 'node:assert/strict'
import test from 'node:test'

test('usePresaleActivePhaseQuery must not revive retired Multicall reader', async () => {
  const source = await import('node:fs/promises').then((fs) =>
    fs.readFile(
      new URL('../../../src/web3/presale/use-presale-queries.ts', import.meta.url),
      'utf8',
    ),
  )

  assert.doesNotMatch(source, /readActivePresalePhase/)
})
