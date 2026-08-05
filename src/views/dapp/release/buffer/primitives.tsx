/**
 * 缓冲池 UI 零件：币种数据卡、机制步骤与机制卡。
 */
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { dappAssets } from '~/shared/config/assets'

type BufferStat = {
  label: string
  value: string
  approx: string
}

function BufferStatCells({ stats }: { stats: ReadonlyArray<BufferStat> }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-3 dapp:grid-cols-3">
      {stats.map((stat) => (
        <div className="grid min-w-0 gap-1" key={stat.label}>
          <Text as="span" className="font-medium text-foreground/70" variant="support">
            {stat.label}
          </Text>
          <Text as="strong" className="font-semibold break-all" variant="detail">
            <CountValue text={stat.value} />
          </Text>
          <Text as="span" className="text-foreground/40" variant="support">
            {stat.approx}
          </Text>
        </div>
      ))}
    </div>
  )
}

/** 缓冲池单个币种数据卡 */
export function BufferAssetCard({
  iconSrc,
  slotId,
  stats,
  tokenLabel,
}: {
  iconSrc: string
  slotId: string
  stats: ReadonlyArray<BufferStat>
  tokenLabel: string
}) {
  return (
    <Card
      as="div"
      className="grid content-center gap-2 rounded-2xl px-5 py-3"
      data-slot-id={slotId}
      surface="elevated"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-(--app-icon-token) shrink-0 place-items-center overflow-hidden rounded-full bg-black">
          <Icon alt="" className="size-(--app-icon-lg)" size="lg" src={iconSrc} />
        </span>
        <Text as="strong" className="font-semibold" variant="headline">
          {tokenLabel}
        </Text>
      </div>
      <BufferStatCells stats={stats} />
    </Card>
  )
}

/** 缓冲机制单步卡片 */
function BufferMechanismStep({
  body,
  iconSrc,
  slotId,
  title,
}: {
  body: string
  iconSrc: string
  slotId: string
  title: string
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-muted p-4 lg:w-35 lg:shrink-0">
      <span className="grid size-11 place-items-center rounded-full" data-slot-id={slotId}>
        <img alt="" className="size-5.5" src={iconSrc} />
      </span>
      <Text as="p" className="m-0 text-center font-medium" variant="copy">
        {title}
      </Text>
      <Text as="p" className="m-0 text-center font-medium" variant="copy">
        {body}
      </Text>
    </div>
  )
}

const MECHANISM_STEP_ICONS = [
  dappAssets.releaseBufferMechLock,
  dappAssets.releaseBufferMechWaves,
  dappAssets.releaseBufferMechClock,
  dappAssets.releaseBufferMechTrending,
] as const

/** 缓冲池机制卡：四步流程 + 底部收益要点条 */
export function BufferMechanismCard({
  steps,
  benefits,
}: {
  steps: ReadonlyArray<{ title: string; body: string }>
  benefits: ReadonlyArray<string>
}) {
  return (
    <Card
      as="div"
      className="grid gap-2 rounded-2xl p-4"
      data-slot-id="release-buffer-mechanism"
      surface="elevated"
    >
      <div
        className="flex flex-col gap-3 lg:flex-row lg:items-center"
        data-slot-id="release-buffer-mech-stages"
      >
        {steps.map((step, index) => {
          const iconSrc = MECHANISM_STEP_ICONS[index] ?? MECHANISM_STEP_ICONS[0]
          const isLast = index >= steps.length - 1
          return (
            <div className="contents" key={`${step.title}-${step.body}`}>
              <BufferMechanismStep
                body={step.body}
                iconSrc={iconSrc}
                slotId={`release-buffer-mech-icon-${index}`}
                title={step.title}
              />
              {!isLast ? (
                <span
                  className="hidden shrink-0 items-center justify-center lg:flex lg:flex-1"
                  data-slot-id={`release-buffer-mech-conn-${index}`}
                >
                  <img
                    alt=""
                    className="h-2.5 w-3.25"
                    data-slot-id={`release-buffer-mech-arrow-${index}`}
                    src={dappAssets.releaseBufferMechArrow}
                  />
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      <ul
        className="m-0 flex list-none flex-wrap items-center justify-between gap-2 px-4 py-2.5"
        data-slot-id="release-buffer-mech-strip"
      >
        {benefits.map((item) => (
          <li className="flex items-center gap-1.5" key={item}>
            <img alt="" className="size-3 shrink-0" src={dappAssets.releaseBufferMechCheck} />
            <Text as="span" className="font-medium text-foreground/70" variant="support">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  )
}
