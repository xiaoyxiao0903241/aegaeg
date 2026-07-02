import type { QuickLinkProps } from '~/app/components/quick-link'
import { dappAssets } from '~/app/assets'
import { resolveHomeNotionLink } from '~/home/notion-links'
import type { Locale } from '~/i18n/locales'

export const COMMUNITY_SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@AegisxDAO',
  medium: 'https://medium.com/@AegisX__',
  twitter: 'https://x.com/AegisX__',
  telegram: 'https://t.me/xdao_officialchannel',
} as const

export type CommunitySocialLinkId = keyof typeof COMMUNITY_SOCIAL_LINKS

export function resolveCommunitySocialLink(id: CommunitySocialLinkId) {
  return COMMUNITY_SOCIAL_LINKS[id]
}

export interface CommunityQuickLinkLabels {
  docs: string
  youtube: string
  medium: string
  twitter: string
  telegram: string
}

export function buildCommunityQuickLinkItems(
  labels: CommunityQuickLinkLabels,
  locale: Locale,
): QuickLinkProps[] {
  return [
    {
      href: resolveHomeNotionLink(locale, 'docs'),
      icon: dappAssets.docs,
      label: labels.docs,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.youtube,
      icon: dappAssets.youtube,
      iconTone: 'plain',
      label: labels.youtube,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.medium,
      icon: dappAssets.medium,
      iconTone: 'plain',
      label: labels.medium,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.twitter,
      icon: dappAssets.twitter,
      iconTone: 'dark',
      label: labels.twitter,
    },
    {
      href: COMMUNITY_SOCIAL_LINKS.telegram,
      icon: dappAssets.telegram,
      iconTone: 'plain',
      label: labels.telegram,
    },
  ]
}
