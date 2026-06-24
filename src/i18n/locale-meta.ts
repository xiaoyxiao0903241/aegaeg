import type { Locale } from '~/i18n/locales'

export type LocaleMeta = {
  /** Short label in the language switcher trigger */
  label: string
  /** BCP 47 tag for `<html lang>` */
  htmlLang: string
  /** Compact code shown in the menu list */
  menuCode: string
  /** Native language name */
  menuName: string
  /** English descriptor in the menu list */
  menuLabel: string
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: {
    label: 'EN',
    htmlLang: 'en',
    menuCode: 'EN',
    menuName: 'English',
    menuLabel: 'English (US)',
  },
  zh: {
    label: '简',
    htmlLang: 'zh-CN',
    menuCode: '简',
    menuName: '简体中文',
    menuLabel: 'Chinese, Simplified',
  },
  zht: {
    label: '繁',
    htmlLang: 'zh-Hant',
    menuCode: '繁',
    menuName: '繁體中文',
    menuLabel: 'Chinese, Traditional',
  },
  id: {
    label: 'ID',
    htmlLang: 'id',
    menuCode: 'ID',
    menuName: 'Indonesia',
    menuLabel: 'Indonesian',
  },
  ko: {
    label: 'KO',
    htmlLang: 'ko',
    menuCode: 'KO',
    menuName: '한국어',
    menuLabel: 'Korean',
  },
  ja: {
    label: 'JA',
    htmlLang: 'ja',
    menuCode: 'JA',
    menuName: '日本語',
    menuLabel: 'Japanese',
  },
  vi: {
    label: 'VI',
    htmlLang: 'vi',
    menuCode: 'VI',
    menuName: 'Tiếng Việt',
    menuLabel: 'Vietnamese',
  },
  es: {
    label: 'ES',
    htmlLang: 'es',
    menuCode: 'ES',
    menuName: 'Español',
    menuLabel: 'Spanish',
  },
  ru: {
    label: 'RU',
    htmlLang: 'ru',
    menuCode: 'RU',
    menuName: 'Русский',
    menuLabel: 'Russian',
  },
  hi: {
    label: 'HI',
    htmlLang: 'hi',
    menuCode: 'HI',
    menuName: 'हिंदी',
    menuLabel: 'Hindi',
  },
  tr: {
    label: 'TR',
    htmlLang: 'tr',
    menuCode: 'TR',
    menuName: 'Türkçe',
    menuLabel: 'Turkish',
  },
}

export function getHtmlLang(locale: Locale): string {
  return localeMeta[locale].htmlLang
}
