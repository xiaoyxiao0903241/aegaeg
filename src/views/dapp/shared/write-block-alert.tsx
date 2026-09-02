import { useState } from 'react'

import { InlineAlert } from '~/shared/components/inline-alert'

/**
 * 写路径硬门说明：按钮只保留动作文案，理由走本告警。
 * 走 InlineAlert `open` → Reveal 高度动画；关闭后卸载，避免 Dock `gap` 留白。
 * 收起过渡期内仍显示上一句文案，避免高度动画时正文先被掏空。
 *
 * @param hint 已翻译的阻断说明；空则收起
 */
export function WriteBlockAlert({ hint }: { hint: string | null | undefined }) {
  const open = Boolean(hint)
  const [shown, setShown] = useState(hint ?? '')
  if (hint && hint !== shown) setShown(hint)

  return (
    <InlineAlert as="div" open={open} role="status" tone="notice">
      {hint ?? shown}
    </InlineAlert>
  )
}
