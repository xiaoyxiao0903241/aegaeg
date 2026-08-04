import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { Button } from '~/shared/components/button'
import { DappCountValue } from '~/shared/components/dapp-count-value'
import { dappDarkBanner } from '~/shared/components/dapp-dark-banner'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

const genesisGlobeWidth = 597
const genesisGlobeHeight = 250

const genesisGlobalCard = tv({
  slots: {
    root: cn(dappDarkBanner().root(), 'min-h-27 px-6 py-4 max-dapp:p-4.5'),
    content: cn(dappDarkBanner().content(), 'max-dapp:max-w-none'),
    // H5: EN "View contract" ~150px; pr-28 was too tight → title wrapped into the button.
    kicker: 'max-dapp:block max-dapp:pr-44',
    // Outline CTA must beat Button secondary + md/pill `w-full` (absolute hug + right).
    contractButton: cn(
      'absolute top-11 right-5.5 z-2 max-dapp:top-4.5 max-dapp:right-4.5',
      'w-auto! gap-1.5! border-white/45! bg-transparent! px-4.5! text-white!',
      'hover:translate-y-0! hover:border-white/80! hover:shadow-none!',
      'focus-visible:translate-y-0! focus-visible:border-white/80! focus-visible:shadow-none!',
      '[&_img]:size-(--dapp-icon-action) [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
    ),
    globe:
      'pointer-events-none absolute top-0 right-0 size-auto max-h-full max-w-3/5 opacity-80 select-none',
  },
})

export function GenesisGlobalCard({
  body,
  contractLabel,
  kicker,
  onViewContract,
  value,
}: {
  body: string
  contractLabel: string
  kicker: string
  onViewContract: () => void
  value: ReactNode
}) {
  const styles = genesisGlobalCard()

  return (
    <div className={styles.root()} data-reveal>
      <div className={styles.content()}>
        <Text as="span" variant="eyebrow" tone="primary-bright" className={styles.kicker()}>
          {kicker}
        </Text>
        <Text as="strong" tone="inverse" variant="panel" className="block">
          {typeof value === 'string' ? <DappCountValue text={value} /> : value}
        </Text>
        <Text as="p" variant="copy" tone="inverse-muted" className="m-0 max-dapp:w-full">
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
