/**
 * 缓冲池机制卡
 *
 * 四步流程（步进间箭头）+ 底部收益要点条。
 */
import { dappAssets } from '~/app/assets'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { BufferMechanismStep } from '~/views/dapp/release/buffer/buffer-mechanism-step'

const MECHANISM_STEP_ICONS = [
  dappAssets.releaseBufferMechLock,
  dappAssets.releaseBufferMechWaves,
  dappAssets.releaseBufferMechClock,
  dappAssets.releaseBufferMechTrending,
] as const

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
