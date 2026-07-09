import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappSkeleton } from '~/app/shell/components/dapp-skeleton'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { cn } from '~/shared/lib/utils'

const genesisGlobeWidth = 597
const genesisGlobeHeight = 250

const genesisGlobalCard = tv({
  slots: {
    root: cn(dappDarkBanner().root(), 'min-h-32 p-6 max-dapp:p-4.5'),
    content: cn(dappDarkBanner().content(), 'max-dapp:max-w-none'),
    // H5: EN "View contract" ~150px; pr-28 was too tight → title wrapped into the button.
    kicker: 'max-dapp:block max-dapp:pr-44',
    // Outline CTA must beat Button secondary + md/pill `w-full` (absolute hug + right).
    contractButton: cn(
      'absolute right-5.5 top-11 z-[2] max-dapp:top-4.5 max-dapp:right-4.5',
      '!w-auto !gap-1.5 !border-white/45 !bg-transparent !px-4.5 !text-white',
      'hover:!border-white/80 hover:!shadow-none hover:!translate-y-0',
      'focus-visible:!border-white/80 focus-visible:!shadow-none focus-visible:!translate-y-0',
      '[&_img]:size-[var(--dapp-icon-action)] [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
    ),
    globe:
      'pointer-events-none absolute top-0 right-0 h-auto max-h-full w-auto max-w-[60%] select-none opacity-[0.78]',
  },
})

export function GenesisGlobalCard({
  body,
  contractLabel,
  kicker,
  onViewContract,
  value,
  valueLoading = false,
}: {
  body: string
  contractLabel: string
  kicker: string
  onViewContract: () => void
  value: ReactNode
  valueLoading?: boolean
}) {
  const styles = genesisGlobalCard()

  return (
    <div className={styles.root()} data-reveal>
      <div className={styles.content()}>
        <Text as="span" variant="eyebrow" tone="primary-bright" className={styles.kicker()}>
          {kicker}
        </Text>
        <Text
          as="strong"
          tone="inverse"
          variant="panel"
          className="block"
        >
          {valueLoading ? <DappSkeleton className="h-6 w-40" tone="dark" /> : value}
        </Text>
        <Text
          as="p"
          variant="detail"
          tone="inverse-muted"
          className="m-0 max-dapp:w-full"
        >
          {body}
        </Text>
      </div>
      <Button
        className={styles.contractButton()}
        onClick={onViewContract}
        size="md"
        type="button"
        variant="secondary"
      >
        {contractLabel}
        <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
      </Button>
      <img
        alt=""
        className={styles.globe()}
        draggable={false}
        height={genesisGlobeHeight}
        loading="lazy"
        src={dappAssets.genesisGlobe}
        width={genesisGlobeWidth}
      />
    </div>
  )
}
