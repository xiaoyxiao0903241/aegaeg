import { Fragment } from 'react'

import { Text } from '~/shared/components/text'

const HTML_CONTENT_RE = /<[a-z][\s\S]*>/i
const URL_RE = /(https?:\/\/[^\s<>"']+)/g

export function isPopupNoticeHtmlContent(content: string): boolean {
  return HTML_CONTENT_RE.test(content)
}

function linkifyPlainText(text: string) {
  const parts = text.split(URL_RE)
  return parts.map((part, index) => {
    if (!URL_RE.test(part)) {
      return <Fragment key={`${index}-${part.slice(0, 8)}`}>{part}</Fragment>
    }

    URL_RE.lastIndex = 0
    return (
      <Text
        as="a"
        href={part}
        key={`${index}-${part}`}
        rel="noopener noreferrer"
        target="_blank"
        tone="primary"
        variant="copy"
        className="font-medium underline decoration-primary/35 underline-offset-2 hover:decoration-primary/70"
      >
        {part}
      </Text>
    )
  })
}

/**
 * 公告正文渲染
 *
 * 含 HTML 标记时按原文渲染（含脚本/样式），内容由后台或 CMS 提供，
 * 不做过滤；纯文本则分段，并自动把其中的链接渲染为可点击样式。
 *
 * @param content 公告正文
 */
export function PopupNoticeContent({ content }: { content: string }) {
  if (!content.trim()) return null

  if (isPopupNoticeHtmlContent(content)) {
    return (
      <div
        className="home-popup-notice-content space-y-3 leading-[1.65] wrap-break-word text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/35 [&_a]:underline-offset-2 [&_li]:ms-4 [&_li]:list-disc [&_ol]:list-decimal [&_p+p]:mt-3 [&_strong]:font-semibold [&_ul]:space-y-1.5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="home-popup-notice-content space-y-3 leading-[1.65] wrap-break-word text-foreground">
      {paragraphs.map((paragraph) => (
        <Text as="p" key={paragraph} tone="foreground" variant="copy">
          {linkifyPlainText(paragraph)}
        </Text>
      ))}
    </div>
  )
}
