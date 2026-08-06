import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 规范化 http(s) URL；非 http(s) 链接返回 null（不跳转）。 */
export function navigableHref(href: string): string | null {
  const trimmed = href.trim()
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return null
  }

  try {
    return new URL(trimmed).href
  } catch {
    return null
  }
}

/** Promise 延时；钱包等待 / 领取重试 / 缓存失效退避共用的唯一实现。 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 按钱包隔离草稿状态的稳定 React 重挂载键。 */
export function walletRemountKey(address: string | null | undefined): string {
  return address?.toLowerCase() ?? 'disconnected'
}

/** 把模板中的 `{key}` 占位符替换为对应值。 */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  )
}

/** 滚动进场类名：默认可见，boot 后仅对未进入视口的块淡出；见 home-motion.css */
export function revealClass(opts?: { delay?: boolean; className?: string }) {
  return cn(
    'transition-opacity duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
    opts?.delay && 'delay-100',
    'data-[visible=true]:opacity-100',
    opts?.className,
  )
}
