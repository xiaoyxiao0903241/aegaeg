/**
 * Flatten home bundle: { desktop, mobile } → string (desktop wins).
 * Icon card: { desktop, mobile } → body
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh', 'en', 'ko', 'ja', 'vi', 'es', 'ru']

function isResponsivePair(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'desktop' in value &&
    'mobile' in value &&
    Object.keys(value).length === 2
  )
}

function flattenIconCard(card) {
  if (!card || typeof card !== 'object') return card
  const { title, desktop, mobile, index } = card
  const body = desktop ?? mobile ?? ''
  const out = { title, body }
  if (index !== undefined) out.index = index
  return out
}

function flattenNode(value, path = '') {
  if (isResponsivePair(value)) {
    return value.desktop ?? value.mobile ?? ''
  }

  if (Array.isArray(value)) {
    if (path.endsWith('.cards') && value[0]?.title && ('desktop' in (value[0] ?? {}))) {
      return value.map(flattenIconCard)
    }
    if (path.endsWith('.checks')) {
      return value.map((item) =>
        typeof item === 'string' ? item : (item.desktop ?? item.mobile ?? ''),
      )
    }
    return value.map((item, index) => flattenNode(item, `${path}[${index}]`))
  }

  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, child] of Object.entries(value)) {
      out[key] = flattenNode(child, path ? `${path}.${key}` : key)
    }
    return out
  }

  return value
}

function formatHomeFile(locale, home) {
  const json = JSON.stringify(home, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'")
    .replace(/'(\d+)':/g, '$1:')
  return `import type { HomeContentBundle } from '~/home/content/types'

const home: HomeContentBundle = ${json.replace(/^/gm, (line, offset) => (offset === 0 ? line : line))}

export default home
`
}

for (const locale of locales) {
  const path = resolve(root, `src/i18n/messages/home/${locale}.ts`)
  const source = readFileSync(path, 'utf8')
  const match = source.match(/const home: HomeContentBundle = (\{[\s\S]*\n\})/)
  if (!match) {
    console.error(`skip ${locale}: parse failed`)
    continue
  }
  // eslint-disable-next-line no-eval
  const home = eval(`(${match[1]})`)
  const flat = flattenNode(home)
  const body = `import type { HomeContentBundle } from '~/home/content/types'

const home = ${JSON.stringify(flat, null, 2)} satisfies HomeContentBundle

export default home
`
  writeFileSync(path, body, 'utf8')
  console.log(`flattened ${locale}`)
}
