import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

import { flattenCssCascadeLayers } from '../../../vite-plugins/flatten-css-cascade-layers.ts'

test('flattenCssCascadeLayers: unwraps @layer blocks and drops layer statements', () => {
  const input = [
    '@layer properties{@supports (color:green){*,:before{--x:0}}}',
    '@layer components;',
    '@layer utilities{.flex{display:flex}.hidden{display:none}}',
    ':root{--primary:#e66a47}',
    '.example-cta{background:var(--primary)}',
  ].join('')

  const out = flattenCssCascadeLayers(input)

  assert.equal(out.includes('@layer'), false)
  assert.match(out, /\.flex\{display:flex\}/)
  assert.match(out, /\.hidden\{display:none\}/)
  assert.match(out, /:root\{--primary:#e66a47\}/)
  assert.match(out, /\.example-cta\{background:var\(--primary\)\}/)
})

test('flattenCssCascadeLayers: preserves nested braces inside a layer', () => {
  const input = '@layer utilities{@media (max-width:820px){.foo{color:red}}.bar{color:blue}}'
  const out = flattenCssCascadeLayers(input)

  assert.match(out, /@media \(max-width:820px\)\{\.foo\{color:red\}\}/)
  assert.match(out, /\.bar\{color:blue\}/)
})

test('flattenCssCascadeLayers: handles escaped quotes in Tailwind selector tokens', () => {
  const input =
    '@layer utilities{.before\\:content-\\[\\"\\"\\]:before{--tw-content:"";content:var(--tw-content)}}'
  const out = flattenCssCascadeLayers(input)

  assert.equal(out.includes('@layer'), false)
  assert.ok(out.includes('.before\\:content-'))
})

test('flattenCssCascadeLayers: production Home bundle keeps flex utilities', () => {
  const cssPath = resolve('dist/assets/main-BRK-R6I2.css')
  let css

  try {
    css = readFileSync(cssPath, 'utf8')
  } catch {
    return
  }

  const out = flattenCssCascadeLayers(css)

  assert.equal(out.includes('@layer'), false)
  assert.match(out, /\.flex\{display:flex\}/)
})
