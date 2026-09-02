import type { Locale } from '~/i18n'
import { appEnv } from '~/shared/config/env'

const zhNotionLinks = {
  whitepaper: appEnv.notionZhWhitepaperUrl,
  docs: appEnv.notionZhDocsUrl,
  economicModel: appEnv.notionZhEconomicModelUrl,
} as const

const enNotionLinks = {
  whitepaper: appEnv.notionEnWhitepaperUrl,
  docs: appEnv.notionEnDocsUrl,
  economicModel: appEnv.notionEnEconomicModelUrl,
} as const

export type NotionLinkKey = keyof typeof zhNotionLinks

/** 按语言返回 Notion 链接表（zh/zht 用中文，其余用英文）。 */
export function getNotionLinks(locale: Locale) {
  return locale === 'zh' || locale === 'zht' ? zhNotionLinks : enNotionLinks
}

/** 按语言与 key 返回对应 Notion 链接。 */
export function notionLink(locale: Locale, key: NotionLinkKey) {
  return getNotionLinks(locale)[key]
}
