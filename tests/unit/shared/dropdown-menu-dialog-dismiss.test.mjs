import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { loadModule } from '../load-module.mjs'

function targetWithClosest(hit) {
  return {
    closest: (selector) => (selector.includes('data-dropdown-menu-panel') && hit ? {} : null),
  }
}

test('isPortaledMenuEventTarget: panel and nested text keep the dialog open', async () => {
  const { isPortaledMenuEventTarget } = await loadModule('/src/shared/components/dialog.tsx')

  assert.equal(isPortaledMenuEventTarget(null), false)
  assert.equal(isPortaledMenuEventTarget(targetWithClosest(false)), false)
  assert.equal(isPortaledMenuEventTarget(targetWithClosest(true)), true)
  assert.equal(
    isPortaledMenuEventTarget({
      parentElement: targetWithClosest(true),
    }),
    true,
    'clicking option label text still counts as inside the panel',
  )
})

test('dropdown panel is clickable while a dialog locks the page', async () => {
  const menuSrc = await readFile(
    fileURLToPath(new URL('../../../src/shared/components/dropdown-menu.tsx', import.meta.url)),
    'utf8',
  )
  const dialogSrc = await readFile(
    fileURLToPath(new URL('../../../src/shared/components/dialog.tsx', import.meta.url)),
    'utf8',
  )
  assert.match(
    menuSrc,
    /pointer-events-auto/,
    'panel portals onto body; dialog sets the page unclickable, so the panel must re-enable pointer events',
  )
  assert.match(menuSrc, /data-dropdown-menu-panel/)
  assert.match(dialogSrc, /onInteractOutside=\{preventDismissOnPortaledMenu\}/)
})
