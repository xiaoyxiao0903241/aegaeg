import { Text } from '~/shared/ui/text'
import {
  COMMUNITY_SOCIAL_LINKS,
  resolveCommunitySocialLink,
  type CommunitySocialLinkId,
} from '~/shared/config/community-links'
import { resolveNotionLink } from '~/shared/config/notion-links'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/views/home/assets'
import { cn } from '~/shared/lib/utils'

function resolveFooterLinkHref(
  locale: ReturnType<typeof useI18n>['locale'],
  link: { href?: string; linkId?: string; socialId?: string },
) {
  if (link.socialId && link.socialId in COMMUNITY_SOCIAL_LINKS) {
    return resolveCommunitySocialLink(link.socialId as CommunitySocialLinkId)
  }

  if (link.linkId === 'whitepaper' || link.linkId === 'docs' || link.linkId === 'economicModel') {
    return resolveNotionLink(locale, link.linkId)
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

const footerClass = {
  root:
    'site-footer flex flex-col items-center gap-10 bg-[#161514] pt-18 pb-9 dapp:min-h-80 max-dapp:gap-6 max-dapp:pt-12 max-dapp:pb-8',
  top:
    'container footer-top grid dapp:min-h-32 grid-cols-4 items-start gap-10 overflow-hidden max-dapp:grid-cols-3 max-dapp:gap-x-3.5 max-dapp:gap-y-6',
  brand:
    'footer-brand flex min-w-0 flex-col items-start gap-3.5 overflow-hidden max-dapp:col-span-full max-dapp:min-h-0',
  brandCopy: 'm-0 w-full max-w-64 max-dapp:max-w-none',
  group:
    'grid min-w-0 content-start gap-2.5 overflow-hidden pb-1.5 whitespace-nowrap max-dapp:gap-2 max-dapp:pb-0 max-dapp:whitespace-normal',
  rule: 'container h-px bg-[#232323]',
  bottom:
    'container footer-bottom flex min-h-4 items-start overflow-hidden whitespace-nowrap',
} as const

const footerLinkClass = ''

const footerBrandClass = cn(
  'inline-flex items-center gap-2.5 whitespace-nowrap',
  'max-dapp:gap-2 [&_img]:h-6',
)

const footerBrandMarkClass = cn(
  'h-7 w-7 object-contain',
  'max-dapp:h-5.5 max-dapp:w-6',
)

function FooterBrandCopy({ copy }: { copy: string }) {
  const lines = copy.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <Text as="span" key={`${line}-${index}`} tone="on-dark" variant="body">
          {index > 0 ? <br /> : null}
          {line}
        </Text>
      ))}
    </>
  )
}

export function HomeFooter() {
  const { locale, messages } = useI18n()
  const content = messages.home.footer

  return (
    <footer className={footerClass.root}>
      <div className={footerClass.top}>
        <div className={footerClass.brand}>
          <a className={footerBrandClass} href="#top">
            <img
              className={footerBrandMarkClass}
              src={homeAssets.logoMark}
              alt=""
              width="28"
              height="26"
            />
            <Text as="span" tone="inverse" variant="lead" weight="semibold">
              AEGIS X
            </Text>
          </a>
          <Text
            as="p"
            className={footerClass.brandCopy}
            tone="on-dark"
            variant="body"
          >
            <FooterBrandCopy copy={content.brandCopy} />
          </Text>
        </div>
        {content.groups.map((group) => (
          <nav
            className={footerClass.group}
            aria-label={group.ariaLabel}
            key={group.label}
          >
            <Text
              as="h3"
              className="m-0"
              tone="inverse"
              variant="body"
              weight="semibold"
            >
              {group.label}
            </Text>
            {group.links.map((link) => {
              const href = resolveFooterLinkHref(locale, link)
              return (
              <Text
                as="a"
                className={footerLinkClass}
                href={href}
                key={`${group.label}-${link.label}`}
                rel={isExternalHref(href) ? 'noopener noreferrer' : undefined}
                target={isExternalHref(href) ? '_blank' : undefined}
                tone="on-dark"
                variant="body"
              >
                {link.label}
              </Text>
              )
            })}
          </nav>
        ))}
      </div>
      <div className={footerClass.rule} aria-hidden="true" />
      <div className={footerClass.bottom}>
        <Text
          as="p"
          className="m-0 max-dapp:whitespace-nowrap"
          tone="on-dark"
          variant="caption"
        >
          {content.copyright}
        </Text>
      </div>
    </footer>
  )
}
