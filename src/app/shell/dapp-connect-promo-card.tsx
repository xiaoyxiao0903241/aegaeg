import { dappAssets, homeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { Text } from '~/shared/components/text'
import { WidgetPromoCard } from '~/shared/components/widget-promo-card'

export function DappConnectPromoCard({ className }: { className?: string }) {
  const { locale, messages: t } = useI18n()
  const homeHref = withLocalePrefix(locale, '/')

  return (
    <WidgetPromoCard className={className}>
      <div className="flex min-w-0 items-center gap-2">
        <DappIcon alt="" size="token" src={homeAssets.logoMark} />
        <div className="grid min-w-0 gap-1">
          <Text as="strong" variant="headline" tone="inverse" className="text-sm/normal">
            {t.dapp.connect.promoTitle}
          </Text>
          <Text
            as="a"
            variant="copy"
            tone="primary"
            className="duration-dapp-fast m-0 inline-flex items-center gap-1 transition-opacity ease-out hover:opacity-90"
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
