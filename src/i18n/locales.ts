export const locales = ['en', 'zh'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  zh: '中文',
}

export type LanguageMeta = {
  code: string
  name: string
  label: string
  locale?: Locale
}

export const allLanguageOptions: LanguageMeta[] = [
  { code: 'EN', name: 'English', label: 'English (US)', locale: 'en' },
  { code: '简', name: '简体中文', label: 'Chinese, Simplified', locale: 'zh' },
  { code: '繁', name: '繁體中文', label: 'Chinese, Traditional' },
  { code: 'KO', name: '한국어', label: 'Korean' },
  { code: 'JA', name: '日本語', label: 'Japanese' },
  { code: 'VI', name: 'Tiếng Việt', label: 'Vietnamese' },
  { code: 'ES', name: 'Español', label: 'Spanish' },
  { code: 'RU', name: 'Русский', label: 'Russian' },
]
