/**
 * 缓冲机制单步卡片
 *
 * 圆标 + 标题 + 说明；桌面端与相邻步骤之间由页面插入箭头。
 */
import { Text } from '~/shared/components/text'

export function BufferMechanismStep({
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
