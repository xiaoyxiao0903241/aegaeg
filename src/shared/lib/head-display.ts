import type { Messages } from '~/i18n/messages'

/**
 * 运行时按语言覆写 head 展示信息。
 *
 * 静态 HTML 的 <title>/<meta description> 固定英文 headMeta（防敏感词扫描）；
 * 挂载后用编码消息袋里的 displayMeta 还原本地语言，供浏览器标签页与
 * 会执行 JS 的爬虫读取。非 JS 爬虫（百度/微信卡片）只会索引英文 —— 预期行为。
 *
 * @param messages 当前语言的消息袋
 */
export function applyLocalizedHeadDisplay(messages: Messages) {
  const { displayMeta } = messages.home

  document.title = displayMeta.title

  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', displayMeta.description)
  }
}
