/**
 * Xmine X 价值说明卡
 *
 * 深色底展示供应量、徽章与两栏权益说明。
 */
import { dappAssets } from '~/app/assets'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

type XValueColumn = {
  title: string
  pct: string
  bullets: ReadonlyArray<string>
}

export function StakingXValueCard({
  badge,
  columns,
  supplyLabel,
  supplyValue,
}: {
  badge: string
  columns: ReadonlyArray<XValueColumn>
  supplyLabel: string
  supplyValue: string
}) {
  return (
    <div className="grid gap-5 rounded-md bg-dark p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon alt="" className="size-9 rounded-2xl" src={dappAssets.tokenX} />
          <div className="grid gap-1">
            <Text as="span" className="font-semibold" tone="primary" variant="support">
              {supplyLabel}
            </Text>
            <Text as="strong" className="font-bold" tone="inverse" variant="figure">
              {supplyValue}
            </Text>
          </div>
        </div>
        <Text
          as="span"
          className="rounded-full bg-primary/20 px-3 py-1.5 font-semibold"
          tone="primary"
          variant="support"
        >
          {badge}
        </Text>
      </div>
      {/* 双栏并排、顶对齐；窄列内百分比与标题上下排 */}
      <div className="grid grid-cols-2 items-start gap-10">
        {columns.map((col) => (
          <div className="grid min-w-0 content-start gap-2.5" key={col.title}>
            <div className="flex flex-col items-start gap-1 dapp:flex-row dapp:items-baseline dapp:gap-2">
              <Text
                as="strong"
                className="shrink-0 text-xl font-bold"
                tone="inverse"
                variant="copy"
              >
                {col.pct}
              </Text>
              <Text as="span" className="min-w-0 font-medium" tone="inverse-muted" variant="copy">
                {col.title}
              </Text>
            </div>
            <ul className="m-0 grid list-none gap-2 p-0">
              {col.bullets.map((bullet) => (
                <li className="flex items-start gap-2" key={bullet}>
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <Text as="span" className="min-w-0 text-white/65" variant="copy">
                    {bullet}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
