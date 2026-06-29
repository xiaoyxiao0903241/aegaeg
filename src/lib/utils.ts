import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns href when it is a non-empty http(s) URL; otherwise null (no navigation). */
export function resolveNavigableHref(href: string): string | null {
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
