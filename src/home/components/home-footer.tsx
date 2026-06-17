import { Text } from '~/components/text'
import { localeMeta } from '~/i18n/locale-meta'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/home/assets'
import type { HomeContent } from '~/home/content/types'
import { cn } from '~/lib/utils'
import { labelKey, MultilineCopy, prefixedPath } from '~/home/components/home-primitives'

const footerClass = {
  root:
    'site-footer flex flex-col items-center gap-10 bg-[#161514] pt-[72px] pb-9 text-on-dark dapp:min-h-[336px] max-dapp:gap-6 max-dapp:pt-12 max-dapp:pb-8',
  top:
    'container footer-top grid dapp:min-h-[131px] grid-cols-4 items-start gap-10 overflow-hidden max-dapp:grid-cols-3 max-dapp:gap-x-3.5 max-dapp:gap-y-6',
  brand:
    'footer-brand flex min-h-[124px] min-w-0 flex-col items-start gap-3.5 overflow-hidden max-dapp:col-span-full max-dapp:min-h-0',
  brandCopy:
    'm-0 w-[min(100%,260px)] text-sm font-normal leading-[1.5] tracking-[-0.28px] text-on-dark max-dapp:text-[13px]',
  group:
    'grid min-w-0 content-start gap-2.5 overflow-hidden pb-1.5 text-sm whitespace-nowrap max-dapp:gap-2 max-dapp:pb-0',
  rule: 'container h-px bg-[#232323]',
  bottom:
    'container footer-bottom flex min-h-4 items-start justify-between gap-6 overflow-hidden text-[13px] font-normal leading-4 tracking-[-0.26px] text-on-dark whitespace-nowrap max-dapp:block max-dapp:text-xs',
} as const

const footerLinkClass =
  'text-sm font-normal leading-[1.2] tracking-[-0.28px] max-dapp:text-[13px] max-dapp:leading-[1.5] max-dapp:nth-[n+4]:hidden'

const footerBrandClass = cn(
  'inline-flex items-center gap-[11px] whitespace-nowrap text-lg font-semibold tracking-[-0.36px] leading-none text-primary-foreground',
  'max-dapp:gap-[9px] max-dapp:text-base max-dapp:leading-[1.2] [&_img]:h-[26px]',
)

const footerBrandMarkClass = cn(
  'h-[27px] w-7 object-contain',
  'max-dapp:h-[22px] max-dapp:w-6',
)

const footerLangMarkerClass = cn(
  'mt-auto flex h-7 w-[66px] items-center justify-center gap-1.5 rounded-full border border-on-dark',
  'px-3 text-[13px] font-semibold leading-none whitespace-nowrap text-on-dark',
  'max-dapp:mt-3.5',
)

const footerLangIconClass =
  'size-4 shrink-0 fill-none stroke-current [stroke-width:1.4]'

export function HomeFooter({ content }: { content: HomeContent['footer'] }) {
  const { locale } = useI18n()

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
            <MultilineCopy copy={content.brandCopy} />
          </Text>
          <span aria-label={content.languageLabel} className={footerLangMarkerClass}>
            <svg aria-hidden="true" className={footerLangIconClass} viewBox="0 0 16 16">
              <path d="M8 14.3C11.4794 14.3 14.3 11.4794 14.3 8C14.3 4.52061 11.4794 1.7 8 1.7C4.52061 1.7 1.7 4.52061 1.7 8C1.7 11.4794 4.52061 14.3 8 14.3Z" />
              <path d="M8 1.7C4 4.2 4 11.8 8 14.3C12 11.8 12 4.2 8 1.7Z" />
              <path d="M1.7 8H14.3" />
            </svg>
            <span>{localeMeta[locale].menuCode}</span>
          </span>
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
              className="m-0 text-sm leading-[1.2] tracking-[0.56px] text-white max-dapp:text-[13px] max-dapp:leading-[1.5]"
            >
              {group.label}
            </Text>
            {group.links.map((link) => (
              <Text
                as="a"
                className={cn(footerLinkClass, 'text-on-dark')}
                href={prefixedPath(locale, link.href)}
                key={`${group.label}-${link.href}-${labelKey(link.label)}`}
              >
                {link.label}
              </Text>
            ))}
          </nav>
        ))}
      </div>
      <div className={footerClass.rule} aria-hidden="true" />
      <div className={footerClass.bottom}>
        <p className="m-0 max-dapp:whitespace-nowrap">{content.copyright}</p>
        <p className="m-0">{content.legal}</p>
      </div>
    </footer>
  )
}
