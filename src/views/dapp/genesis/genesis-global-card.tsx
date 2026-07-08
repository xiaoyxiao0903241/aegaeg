import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappSkeleton } from '~/app/shell/components/dapp-skeleton'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

const genesisGlobeWidth = 597
const genesisGlobeHeight = 250

const genesisGlobalCard = tv({
  slots: {
    root: 'relative min-h-32 overflow-hidden rounded-md bg-dark p-6 shadow-card max-dapp:p-4.5',
    content: 'relative z-1 flex max-w-[70ch] flex-col gap-2 max-dapp:max-w-none',
    kicker: 'max-dapp:block max-dapp:pr-28',
    contractButton: cn(
      'absolute right-5.5 top-11 z-[2] max-dapp:top-4.5 max-dapp:right-4.5',
      'gap-1.5 border-[oklch(100%_0_0/45%)] bg-transparent px-4.5 text-white',
      'hover:border-[oklch(100%_0_0/80%)] focus-visible:border-[oklch(100%_0_0/80%)]',
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
    <div className={cn(revealClass(), styles.root())} data-reveal>
      <div className={styles.content()}>
        <Text as="span" variant="eyebrow" tone="primary" className={styles.kicker()}>
          {kicker}
        </Text>
        <Text
          as="strong"
          tone="inverse"
          variant="panel"
          className="block tracking-[-0.63px]"
        >
          {valueLoading ? <DappSkeleton className="h-6 w-40" tone="dark" /> : value}
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
