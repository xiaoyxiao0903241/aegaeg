/**
 * Split locale message files: DApp keys → messages/app/{locale}.ts
 * Locale root files become thin merge of app + home.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['en', 'zh', 'ko', 'ja', 'vi', 'es', 'ru']
const messagesDir = resolve(root, 'src/i18n/messages')
const appDir = resolve(messagesDir, 'app')

mkdirSync(appDir, { recursive: true })

for (const locale of locales) {
  const path = resolve(messagesDir, `${locale}.ts`)
  const source = readFileSync(path, 'utf8')
  const match = source.match(/defineMessages\(\{([\s\S]*)\}\)\s*\n/)
  if (!match) {
    console.error(`skip ${locale}: parse failed`)
    continue
  }

  let body = match[1].trimEnd()
  body = body.replace(/\n\s*home,\s*$/, '')

  const appFile = `import { defineMessages } from '../define-messages'

const app = defineMessages({
${body}
})

export default app
`

  writeFileSync(resolve(appDir, `${locale}.ts`), appFile, 'utf8')

  const localeFile = `import { defineMessages } from './define-messages'
import app from './app/${locale}'
import home from './home/${locale}'

const ${locale} = defineMessages({
  ...app,
  home,
})

export default ${locale}
`

  writeFileSync(path, localeFile, 'utf8')
  console.log(`split ${locale}`)
}

const indexFile = `import type { Locale } from '~/i18n/locales'
import appEn from './en'
import appEs from './es'
import appJa from './ja'
import appKo from './ko'
import appRu from './ru'
import appVi from './vi'
import appZh from './zh'

export const appMessagesByLocale = {
  en: appEn,
  zh: appZh,
  ko: appKo,
  ja: appJa,
  vi: appVi,
  es: appEs,
  ru: appRu,
} satisfies Record<Locale, typeof appEn>

export type AppMessages = typeof appEn
`

writeFileSync(resolve(appDir, 'index.ts'), indexFile, 'utf8')

const bundlesDir = resolve(root, 'src/home/content/bundles')
try {
  rmSync(bundlesDir, { recursive: true, force: true })
  console.log('removed src/home/content/bundles')
} catch {
  // ignore
}
