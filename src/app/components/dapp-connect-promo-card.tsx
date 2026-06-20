import { useI18n } from '~/i18n/use-i18n'
import { DappIcon } from '~/app/components/dapp-icon'
import { homeAssets, dappAssets } from '~/app/assets'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { Card } from '~/components/card'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export function DappConnectPromoCard({ className }: { className?: string }) {
  const { messages: t } = useI18n()

  return (
    <Card
      as="section"
      tone="dark"
      className={cn(
        revealClass(),
        'grid gap-1 px-4.5 py-4',
        'max-dapp:rounded-2xl max-dapp:px-4.5 max-dapp:py-4',
        className,
      )}
      data-reveal
    >
      <div className="flex min-w-0 items-center gap-2">
        <DappIcon alt="" size="token" src={homeAssets.logoMark} />
        <div className="grid min-w-0 gap-1">
          <strong className="text-sm font-semibold leading-normal tracking-[-0.28px] text-white">
            {t.dapp.connect.promoTitle}
          </strong>
          <p className="m-0 inline-flex items-center gap-1 text-xs leading-normal tracking-[-0.24px] text-primary">
            {t.dapp.connect.promoBrandLine}
            <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="h-1.5 shrink-0" />
      <div className="[&_.aegis-thirdweb-button-primary]:!min-h-9.5 [&_.aegis-thirdweb-button-primary]:!h-9.5 [&_.aegis-thirdweb-button-primary]:!text-xs">
        <WalletConnectChip fullWidth variant="primary" />
      </div>
    </Card>
  )
}
