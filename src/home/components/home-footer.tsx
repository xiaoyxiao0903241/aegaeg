import { Text } from '~/components/text'
import {
  COMMUNITY_SOCIAL_LINKS,
  resolveCommunitySocialLink,
  type CommunitySocialLinkId,
} from '~/config/community-links'
import { resolveHomeNotionLink } from '~/home/notion-links'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/home/assets'
import { cn } from '~/lib/utils'

function resolveFooterLinkHref(
  locale: ReturnType<typeof useI18n>['locale'],
  link: { href?: string; linkId?: string; socialId?: string },
) {
  if (link.socialId && link.socialId in COMMUNITY_SOCIAL_LINKS) {
    return resolveCommunitySocialLink(link.socialId as CommunitySocialLinkId)
  }

  if (link.linkId === 'whitepaper' || link.linkId === 'docs' || link.linkId === 'economicModel') {
    return resolveHomeNotionLink(locale, link.linkId)
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
    'site-footer flex flex-col items-center gap-10 bg-[#161514] pt-18 pb-9 text-on-dark dapp:min-h-80 max-dapp:gap-6 max-dapp:pt-12 max-dapp:pb-8',
  top:
    'container footer-top grid dapp:min-h-32 grid-cols-4 items-start gap-10 overflow-hidden max-dapp:grid-cols-3 max-dapp:gap-x-3.5 max-dapp:gap-y-6',
  brand:
    'footer-brand flex min-w-0 flex-col items-start gap-3.5 overflow-hidden max-dapp:col-span-full max-dapp:min-h-0',
  brandCopy:
    'm-0 w-full max-w-64 text-sm font-normal leading-[1.5] tracking-[-0.28px] text-on-dark max-dapp:max-w-none max-dapp:text-xs',
  group:
    'grid min-w-0 content-start gap-2.5 overflow-hidden pb-1.5 text-sm whitespace-nowrap max-dapp:gap-2 max-dapp:pb-0 max-dapp:whitespace-normal',
  rule: 'container h-px bg-[#232323]',
  bottom:
    'container footer-bottom flex min-h-4 items-start overflow-hidden text-xs font-normal leading-4 tracking-[-0.26px] text-on-dark whitespace-nowrap max-dapp:text-xs',
} as const

const footerLinkClass =
  'text-sm font-normal leading-[1.2] tracking-[-0.28px] max-dapp:text-xs max-dapp:leading-[1.5]'

const footerBrandClass = cn(
  'inline-flex items-center gap-2.5 whitespace-nowrap text-lg font-semibold tracking-[-0.36px] leading-none text-primary-foreground',
  'max-dapp:gap-2 max-dapp:text-base max-dapp:leading-[1.2] [&_img]:h-6',
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
            <span>AEGIS X</span>
          </a>
          <Text as="p" className={footerClass.brandCopy} tone="onDark">
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
              weight="semibold"
              className="m-0 text-sm leading-[1.2] tracking-[0.56px] text-white max-dapp:text-xs max-dapp:leading-[1.5]"
            >
              {group.label}
            </Text>
            {group.links.map((link) => {
              const href = resolveFooterLinkHref(locale, link)
              return (
              <Text
                as="a"
                className={cn(footerLinkClass, 'text-on-dark')}
                href={href}
                key={`${group.label}-${link.label}`}
                rel={isExternalHref(href) ? 'noopener noreferrer' : undefined}
                target={isExternalHref(href) ? '_blank' : undefined}
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
        <p className="m-0 max-dapp:whitespace-nowrap">{content.copyright}</p>
      </div>
    </footer>
  )
}
