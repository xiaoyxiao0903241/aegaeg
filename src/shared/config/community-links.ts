import type { Locale } from '~/i18n'
import { appEnv } from '~/shared/config/env'
import { notionLink } from '~/shared/config/notion-links'

export const COMMUNITY_SOCIAL_LINKS = {
  youtube: appEnv.communityYoutubeUrl,
  medium: appEnv.communityMediumUrl,
  twitter: appEnv.communityTwitterUrl,
  telegram: appEnv.communityTelegramUrl,
} as const

export type CommunitySocialLinkId = keyof typeof COMMUNITY_SOCIAL_LINKS

/** 按 id 返回社区社交链接（来自环境配置）。 */
export function communitySocialLink(id: CommunitySocialLinkId) {
  return COMMUNITY_SOCIAL_LINKS[id]
}

export interface CommunityQuickLinkLabels {
  docs: string
  youtube: string
  medium: string
  twitter: string
  telegram: string
}

/** 社区快捷链接项的形状（由宿主页面的 QuickLink 消费）。 */
export interface CommunityQuickLinkItem {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: string
}

const COMMUNITY_LINK_ICONS = {
  docs: '/assets/figma/dapp/ic-docs.svg',
  youtube: '/assets/figma/dapp/ic-youtube.svg',
  medium: '/assets/figma/dapp/ic-medium.svg',
  twitter: '/assets/figma/dapp/ic-twitter.svg',
  telegram: '/assets/figma/dapp/ic-telegram.svg',
} as const

/** 组装社区快捷链接条目：文档链接加四个社交平台。 */
export function communityQuickLinkItems(
  labels: CommunityQuickLinkLabels,
  locale: Locale,
): CommunityQuickLinkItem[] {
  return [
    {
      href: notionLink(locale, 'docs'),
      icon: COMMUNITY_LINK_ICONS.docs,
      label: labels.docs,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.youtube,
      icon: COMMUNITY_LINK_ICONS.youtube,
      iconTone: 'plain',
      label: labels.youtube,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.medium,
      icon: COMMUNITY_LINK_ICONS.medium,
      iconTone: 'plain',
      label: labels.medium,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.twitter,
      icon: COMMUNITY_LINK_ICONS.twitter,
      iconTone: 'dark',
      label: labels.twitter,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.telegram,
      icon: COMMUNITY_LINK_ICONS.telegram,
      iconTone: 'plain',
      label: labels.telegram,
    },
  ]
}
