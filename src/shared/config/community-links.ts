import type { Locale } from '~/i18n'
import { notionLink } from '~/shared/config/notion-links'

export const COMMUNITY_SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@AegisxDAO',
  medium: 'https://medium.com/@AegisX__',
  twitter: 'https://x.com/AegisX__',
  telegram: 'https://t.me/xdao_officialchannel',
} as const

export type CommunitySocialLinkId = keyof typeof COMMUNITY_SOCIAL_LINKS

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

/** 社区快捷链接项的形状（由外壳页面的 QuickLink 消费）。 */
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
