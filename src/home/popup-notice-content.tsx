import { Fragment } from 'react'

const HTML_CONTENT_RE = /<[a-z][\s\S]*>/i
const URL_RE = /(https?:\/\/[^\s<>"']+)/g

function stripUnsafeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

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
      <a
        key={`${index}-${part}`}
        className="font-medium text-coral-bright underline decoration-coral-bright/35 underline-offset-2 hover:decoration-coral-bright/70"
        href={part}
        rel="noopener noreferrer"
        target="_blank"
      >
        {part}
      </a>
    )
  })
}

export function PopupNoticeContent({ content }: { content: string }) {
  if (!content.trim()) return null

  if (isPopupNoticeHtmlContent(content)) {
    return (
      <div
        className="home-popup-notice-content space-y-3 text-sm leading-[1.65] text-foreground [&_a]:font-medium [&_a]:text-coral-bright [&_a]:underline [&_a]:decoration-coral-bright/35 [&_a]:underline-offset-2 [&_li]:ms-4 [&_li]:list-disc [&_ol]:list-decimal [&_p+p]:mt-3 [&_strong]:font-semibold [&_ul]:space-y-1.5"
        dangerouslySetInnerHTML={{ __html: stripUnsafeHtml(content) }}
      />
    )
  }

  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="home-popup-notice-content space-y-3 text-sm leading-[1.65] text-foreground">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{linkifyPlainText(paragraph)}</p>
      ))}
    </div>
  )
}
