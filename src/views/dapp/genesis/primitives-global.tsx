/**
 * 创世全球卡
 */

import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { dappAssets } from '~/shared/assets/dapp'
import { Button } from '~/shared/components/button'
import { CountValue } from '~/shared/components/count-value'
import { darkBanner } from '~/shared/components/dark-banner'
import { Icon } from '~/shared/components/icon'
import { Skeleton } from '~/shared/components/skeleton'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

const genesisGlobeWidth = 597
const genesisGlobeHeight = 250

const genesisGlobalCard = tv({
  slots: {
    // 底色跟地球图一致，压过 darkBanner 的 bg-dark
    root: cn(darkBanner().root(), 'bg-dark-globe! px-6 py-4 max-dapp:p-4.5'),
    // H5 拆行，按钮相对卡片绝对定位；PC 文案与按钮同一行垂直居中
    row: 'relative z-1 dapp:flex dapp:items-center dapp:gap-4 max-dapp:contents',
    content: cn(darkBanner().content(), 'min-w-0 dapp:flex-1'),
    kicker: 'max-dapp:block max-dapp:pr-44',
    body: 'm-0 min-h-[2lh]',
    // 胶囊钮默认全宽；箭头原色是珊瑚，实心钮上要反成白
    contractButton: cn(
      'w-auto! shrink-0 gap-1.5',
      'max-dapp:absolute max-dapp:top-4.5 max-dapp:right-4.5 max-dapp:z-2',
      '[&_img]:size-2.5 [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
    ),
    globe: 'pointer-events-none absolute top-0 right-0 size-auto max-w-3/5 opacity-80 select-none',
  },
})

export function GenesisGlobalCard({
  body,
  contractLabel,
  kicker,
  onViewContract,
  value,
  loading = false,
}: {
  body: string
  contractLabel: string
  kicker: string
  onViewContract: () => void
  value: ReactNode
  loading?: boolean
}) {
  const styles = genesisGlobalCard()

  return (
    <div className={styles.root()} data-reveal>
      <div className={styles.row()}>
        <div className={styles.content()}>
          <Text as="span" variant="eyebrow" tone="primary-bright" className={styles.kicker()}>
            {kicker}
          </Text>
          <Text as="strong" tone="inverse" variant="panel" className="block">
            {loading ? (
              <Skeleton className="h-8 w-36 max-dapp:h-7 max-dapp:w-28" tone="dark" />
            ) : typeof value === 'string' ? (
              <CountValue text={value} />
            ) : (
              value
            )}
          </Text>
          <Text as="p" variant="copy" tone="inverse-muted" className={styles.body()}>
            {body}
          </Text>
        </div>
        <Button
          className={styles.contractButton()}
          onClick={onViewContract}
          size="md"
          type="button"
          variant="primary"
        >
          {contractLabel}
          <Icon alt="" className="size-2.5" src={dappAssets.arrowUpRight} />
        </Button>
      </div>
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
