import { Fragment } from 'react'

import { Text } from '~/shared/components/text'

const HTML_CONTENT_RE = /<[a-z][\s\S]*>/i
const URL_RE = /(https?:\/\/[^\s<>"']+)/g
const FORBIDDEN_TAGS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'form',
])
const ALLOWED_HREF_SRC_RE = /^(https?:|mailto:)/i

/** 去掉控制字符后再做 scheme 判断，避免 `java\0script:` 绕过。 */
function normalizeUrlAttr(value: string): string {
  let out = ''
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 32 || code === 127) continue
    out += ch
  }
  return out.trim()
}

/** 校验 href/src 是否仅允许 http/https/mailto */
function isAllowedHrefOrSrc(value: string): boolean {
  return ALLOWED_HREF_SRC_RE.test(normalizeUrlAttr(value))
}

/** 无 DOMParser 时转义为纯文本，绝不回传原始 HTML。 */
function escapeAsPlainText(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 粗判内容是否含 HTML 标签，用于决定消毒或纯文本渲染 */
export function isPopupNoticeHtmlContent(content: string): boolean {
  return HTML_CONTENT_RE.test(content)
}

/**
 * 公告 HTML 消毒
 *
 * 移除脚本、嵌入、表单等危险标签与事件属性，链接仅保留 http/https/mailto；
 * 无 DOMParser 时降级为纯文本转义。
 *
 * @param html 待消毒的公告 HTML
 * @returns 可安全用于 innerHTML 的 HTML；无 DOMParser 时返回纯文本
 */
export function sanitizePopupNoticeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') {
    return escapeAsPlainText(html)
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  for (const el of [...doc.body.querySelectorAll('*')]) {
    if (FORBIDDEN_TAGS.has(el.tagName.toLowerCase())) {
      el.remove()
      continue
    }
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on') || name === 'srcdoc') {
        el.removeAttribute(attr.name)
        continue
      }
      if (name === 'href' || name === 'src' || name === 'xlink:href') {
        if (!isAllowedHrefOrSrc(attr.value)) {
          el.removeAttribute(attr.name)
        } else {
          el.setAttribute(attr.name, normalizeUrlAttr(attr.value))
        }
      }
    }
  }
  return doc.body.innerHTML
}

/** 纯文本中的 http(s) 链接转成可点击链接 */
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
 * HTML 经消毒后渲染；纯文本分段并自动链接化。
 *
 * @param content 公告正文
 */
export function PopupNoticeContent({ content }: { content: string }) {
  if (!content.trim()) return null

  if (isPopupNoticeHtmlContent(content)) {
    const safeHtml = sanitizePopupNoticeHtml(content)
    return (
      <div
        className="home-popup-notice-content space-y-3 leading-[1.65] wrap-break-word text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/35 [&_a]:underline-offset-2 [&_li]:ms-4 [&_li]:list-disc [&_ol]:list-decimal [&_p+p]:mt-3 [&_strong]:font-semibold [&_ul]:space-y-1.5"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
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
