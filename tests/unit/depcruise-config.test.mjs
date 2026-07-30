import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('dependency-cruiser config defines required rules', () => {
  const configSource = readFileSync('.dependency-cruiser.cjs', 'utf8')
  const config = Function(
    `"use strict"; return (${configSource.replace('module.exports =', '')})`,
  )()

  const ruleNames = config.forbidden.map((rule) => rule.name)
  assert.ok(ruleNames.includes('core-is-pure'))
  assert.ok(ruleNames.includes('shared-no-views'))
  assert.ok(ruleNames.includes('stores-no-views'))
  assert.ok(ruleNames.includes('hooks-no-views'))
  assert.ok(ruleNames.includes('home-no-web3'))
  assert.ok(ruleNames.includes('web3-gateway'))
  assert.ok(ruleNames.includes('ui-is-dumb'))
  assert.ok(ruleNames.includes('stores-no-app'))
  assert.ok(ruleNames.includes('views-no-cross-tab'))
  assert.ok(ruleNames.includes('app-views-composition'))

  const homeNoWeb3 = config.forbidden.find((rule) => rule.name === 'home-no-web3')
  assert.match(homeNoWeb3.to.path, /viem/)

  const storesNoApp = config.forbidden.find((rule) => rule.name === 'stores-no-app')
  assert.equal(storesNoApp.severity, 'error')

  const viewsNoCrossTab = config.forbidden.find((rule) => rule.name === 'views-no-cross-tab')
  assert.equal(viewsNoCrossTab.severity, 'error')
  assert.match(viewsNoCrossTab.to.pathNot, /\$1/)
})
