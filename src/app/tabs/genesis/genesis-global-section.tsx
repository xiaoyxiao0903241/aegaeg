import { Button } from '~/components/button'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import { BSC_CONTRACTS } from '~/config/contracts'
import { bscscanAddress } from '~/config/explorer'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { DappSkeleton } from '~/app/components/dapp-skeleton'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { dappDetailSectionGapClass } from '~/app/dapp-detail-layout'
import {
  dappCaptionClass,
  dappKickerClass,
  dappTitleSmClass,
} from '~/app/dapp-type-scale'

export function GenesisGlobalSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  return (
    <section className={cn(dappDetailSectionGapClass, 'max-dapp:hidden')}>
      <div
        className={cn(
          revealClass(),
          'relative min-h-32 overflow-hidden rounded-md bg-dark p-6 shadow-card',
        )}
        data-reveal
      >
        <div className="relative z-1 flex max-w-[70ch] flex-col gap-2">
          <span className={cn(dappKickerClass, 'text-coral-bright')}>
            {t.genesis.globalLabel}
          </span>
          <strong className={cn('block text-white', dappTitleSmClass)}>
            {genesis.isLoading && genesis.phases.length === 0 ? (
              <DappSkeleton className="h-6 w-40" tone="dark" />
            ) : genesis.globalPurchasedLoading ? (
              <DappSkeleton className="h-6 w-40" tone="dark" />
            ) : (
              `$${genesis.globalPurchasedLabel}`
            )}
          </strong>
          <p className={cn('m-0 text-on-dark', dappCaptionClass)}>
            {t.genesis.globalBody}
          </p>
        </div>
        <Button
          className={cn(
            'absolute right-5.5 top-11 z-[2] !gap-1.5 !border-[oklch(100%_0_0/45%)] !bg-transparent !px-4.5 !text-white',
            'hover:!border-[oklch(100%_0_0/80%)] focus-visible:!border-[oklch(100%_0_0/80%)]',
            '[&_img]:size-[var(--dapp-icon-action)] [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
          )}
          onClick={() =>
            window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
          }
          size="md"
          type="button"
          variant="secondary"
        >
          {t.genesis.viewContract}
          <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
        </Button>
        <img
          alt=""
          className="pointer-events-none absolute top-0 right-9 h-auto w-[44%] max-w-80 select-none opacity-[0.78]"
          draggable={false}
          height={250}
          loading="lazy"
          src={dappAssets.genesisGlobe}
          width={597}
        />
      </div>
    </section>
  )
}
