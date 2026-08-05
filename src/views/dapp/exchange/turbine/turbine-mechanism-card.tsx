/**
 * 涡轮机制说明卡
 *
 * 一张卡写一条机制标题与正文。
 */
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'

export function TurbineMechanismCard({ body, title }: { body: string; title: string }) {
  return (
    <Card surface="elevated" className="flex flex-col gap-2 rounded-2xl border-0 p-4 shadow-card">
      <Text as="p" variant="detail" className="m-0 font-semibold">
        {title}
      </Text>
      <Text as="p" variant="copy" className="m-0 text-foreground/70">
        {body}
      </Text>
    </Card>
  )
}
