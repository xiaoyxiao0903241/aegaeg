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
