import { useI18n } from '~/i18n/use-i18n'
import { withLocalePrefix } from '~/i18n/locale'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { homeAssets, dappAssets } from '~/app/assets'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { WidgetPromoCard } from '~/shared/ui/widget-promo-card'

export function DappConnectPromoCard({ className }: { className?: string }) {
  const { locale, messages: t } = useI18n()
  const homeHref = withLocalePrefix(locale, '/')

  return (
    <WidgetPromoCard className={className}>
      <div className="flex min-w-0 items-center gap-2">
        <DappIcon alt="" size="token" src={homeAssets.logoMark} />
        <div className="grid min-w-0 gap-1">
          <strong className="text-sm font-semibold leading-normal tracking-[-0.28px] text-white">
            {t.dapp.connect.promoTitle}
          </strong>
          <a
            className="m-0 inline-flex items-center gap-1 text-xs leading-normal tracking-[-0.24px] text-primary transition-opacity duration-180 ease-out hover:opacity-90"
            href={homeHref}
          >
            {t.dapp.connect.promoBrandLine}
            <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
          </a>
        </div>
      </div>
      <div aria-hidden="true" className="h-1.5 shrink-0" />
      <div className="[&_.aegis-thirdweb-button-primary]:!min-h-9.5 [&_.aegis-thirdweb-button-primary]:!h-9.5 [&_.aegis-thirdweb-button-primary]:!text-xs">
        <WalletConnectChip fullWidth variant="primary" />
      </div>
    </WidgetPromoCard>
  )
}
