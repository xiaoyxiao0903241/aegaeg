import { Text } from '~/shared/ui/text'
import {
  COMMUNITY_SOCIAL_LINKS,
  communitySocialLink,
  type CommunitySocialLinkId,
} from '~/shared/config/community-links'
import { notionLink } from '~/shared/config/notion-links'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/shared/assets/home'

function footerLinkHref(
  locale: ReturnType<typeof useI18n>['locale'],
  link: { href?: string; linkId?: string; socialId?: string },
) {
  if (link.socialId && link.socialId in COMMUNITY_SOCIAL_LINKS) {
    return communitySocialLink(link.socialId as CommunitySocialLinkId)
  }

  if (link.linkId === 'whitepaper' || link.linkId === 'docs' || link.linkId === 'economicModel') {
    return notionLink(locale, link.linkId)
  }

  const href = link.href ?? '#'
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
    return href
  }

  return withLocalePrefix(locale, href)
}

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

function FooterBrandCopy({ copy }: { copy: string }) {
  const lines = copy.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  )
}

export function HomeFooter() {
  const { locale, messages } = useI18n()
  const content = messages.home.footer

  return (
    <footer className="flex flex-col items-center gap-10 bg-footer pt-18 pb-9 text-inverse-muted dapp:min-h-80 max-dapp:gap-6 max-dapp:pt-12 max-dapp:pb-8">
      <div className="container grid grid-cols-4 items-start gap-10 overflow-hidden dapp:min-h-32 max-dapp:grid-cols-3 max-dapp:gap-x-3.5 max-dapp:gap-y-6">
        <div
          className="flex min-w-0 flex-col items-start gap-3.5 overflow-hidden max-dapp:col-span-full max-dapp:min-h-0"
          data-footer-brand
        >
          <a
            className="inline-flex items-center gap-2.5 whitespace-nowrap max-dapp:gap-2 [&_img]:h-6"
            href="#top"
          >
            <img
              className="size-7 object-contain max-dapp:h-5.5 max-dapp:w-6"
              src={homeAssets.logoMark}
              alt=""
              width="28"
              height="26"
            />
            <Text
              as="span"
              variant="brand"
              tone="inverse"
              className="text-lg leading-none tracking-[-0.02em] max-dapp:text-base max-dapp:leading-[1.2]"
            >
              AEGIS X
            </Text>
          </a>
          <Text
            as="p"
            tone="inverse-muted"
            className="m-0 w-full max-w-64 text-sm/normal max-dapp:max-w-none max-dapp:text-xs"
            variant="copy"
          >
            <FooterBrandCopy copy={content.brandCopy} />
          </Text>
        </div>
        {content.groups.map((group) => (
          <nav
            className="grid min-w-0 content-start gap-2.5 overflow-hidden pb-1.5 whitespace-nowrap max-dapp:gap-2 max-dapp:pb-0 max-dapp:whitespace-normal"
            aria-label={group.ariaLabel}
            key={group.label}
          >
            <Text
              as="h3"
              tone="inverse"
              className="m-0 text-sm leading-[1.2] max-dapp:text-xs/normal"
              variant="headline"
            >
              {group.label}
            </Text>
            {group.links.map((link) => {
              const href = footerLinkHref(locale, link)
              return (
                <Text
                  as="a"
                  tone="inverse-muted"
                  className="text-sm leading-[1.2] max-dapp:text-xs/normal"
                  href={href}
                  key={`${group.label}-${link.label}`}
                  rel={isExternalHref(href) ? 'noopener noreferrer' : undefined}
                  target={isExternalHref(href) ? '_blank' : undefined}
                  variant="copy"
                >
                  {link.label}
                </Text>
              )
            })}
          </nav>
        ))}
      </div>
      <div className="container h-px bg-white/10" aria-hidden="true" />
      <Text
        as="div"
        tone="inverse-muted"
        variant="caption"
        className="container flex min-h-4 items-start overflow-hidden text-xs/4 whitespace-nowrap max-dapp:text-xs"
        data-footer-copyright
      >
        {content.copyright}
      </Text>
    </footer>
  )
}
