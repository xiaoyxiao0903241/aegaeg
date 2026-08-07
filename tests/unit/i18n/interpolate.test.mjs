import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('interpolate fills named {placeholders}', async () => {
  const { interpolate } = await loadModule('/src/i18n/interpolate.ts')
  assert.equal(interpolate('约 {days} 天', { days: 30 }), '约 30 天')
  assert.equal(
    interpolate('burn {burnPct} / inject {injectPct}', { burnPct: '40%', injectPct: '60%' }),
    'burn 40% / inject 60%',
  )
  assert.equal(interpolate('{days} 天', { days: '' }).trim(), '天')
  assert.equal(interpolate('keep {missing}', {}), 'keep {missing}')
  assert.equal(interpolate('x {n}', { n: null }), 'x ')
  assert.equal(interpolate('x {n}', { n: 0n }), 'x 0')
})
