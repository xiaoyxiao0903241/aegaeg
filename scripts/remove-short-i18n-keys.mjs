import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh', 'en', 'ko', 'ja', 'vi', 'es', 'ru']

const shortKeys = [
  'directShort',
  'titleShort',
  'statDirectVolumeShort',
  'statTeamVolumeShort',
  'statGenesisTodayShort',
  'discShort',
  'agxShort',
  'personalShort',
  'bonusShort',
  'rankShort',
  'postLaunchShort',
  'volumeShort',
]

for (const locale of locales) {
  const path = resolve(root, `src/i18n/messages/${locale}.ts`)
  let source = readFileSync(path, 'utf8')
  for (const key of shortKeys) {
    source = source.replace(new RegExp(`\\n\\s+${key}: [^,\\n]+,`, 'g'), '\n')
  }
  writeFileSync(path, source, 'utf8')
  console.log(`removed Short keys from ${locale}.ts`)
}
