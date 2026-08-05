/**
 * 缓冲池单个币种数据卡
 *
 * 显示币种图标与名称，以及入池、已提取、释放中三组数字。
 */
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

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
