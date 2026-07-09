import { useI18n } from '~/i18n/use-i18n'
import { withLocalePrefix } from '~/i18n/locale'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { homeAssets, dappAssets } from '~/app/assets'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { Text } from '~/shared/ui/text'
import { WidgetPromoCard } from '~/shared/ui/widget-promo-card'

export function DappConnectPromoCard({ className }: { className?: string }) {
  const { locale, messages: t } = useI18n()
  const homeHref = withLocalePrefix(locale, '/')

  return (
    <WidgetPromoCard className={className}>
      <div className="flex min-w-0 items-center gap-2">
        <DappIcon alt="" size="token" src={homeAssets.logoMark} />
        <div className="grid min-w-0 gap-1">
          <Text as="strong" variant="headline" tone="inverse" className="text-sm leading-normal">
            {t.dapp.connect.promoTitle}
          </Text>
          <Text
            as="a"
            variant="caption"
            tone="primary"
            className="m-0 inline-flex items-center gap-1 text-xs leading-normal transition-opacity duration-180 ease-out hover:opacity-90"
            href={homeHref}
          >
            {t.dapp.connect.promoBrandLine}
            <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
          </Text>
        </div>
      </div>
      <div aria-hidden="true" className="h-1.5 shrink-0" />
      <WalletConnectChip density="inverse" fullWidth variant="primary" />
    </WidgetPromoCard>
  )
}
