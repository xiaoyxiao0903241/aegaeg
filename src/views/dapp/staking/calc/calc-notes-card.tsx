/**
 * 计算器说明卡
 *
 * 用圆点列表展示测算假设与注意事项。
 */
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'

export function CalcNotesCard({ items }: { items: ReadonlyArray<string> }) {
  return (
    <Card className="grid gap-1.5" surface="elevated">
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {items.map((item) => (
          <li className="flex items-center gap-2.5" key={item}>
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-coral-emphasis" />
            <Text as="p" className="m-0 text-foreground/70" variant="copy">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  )
}
