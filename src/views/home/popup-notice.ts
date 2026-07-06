import type {
  HomePopupNotice,
  HomePopupNoticeApiItem,
  HomePopupNoticeI18n,
  HomePopupNoticesResponse,
} from '~/lib/api/types'

const DISMISSED_KEYS_STORAGE_KEY = 'aegis.home.popupNotice.dismissedKeys'
/** @deprecated migrated to dismissedKeys */
const LEGACY_DISMISSED_VERSION_KEY = 'aegis.home.popupNotice.dismissedVersion'

/** display_mode: 1=只弹一次, 2=每次进首页都弹 */
export function readShowOnceFromDisplayMode(displayMode: unknown): boolean {
  const mode = typeof displayMode === 'number' ? displayMode : Number(displayMode)
  if (Number.isNaN(mode)) return true
  return mode === 1
}

export function noticeDismissKey(notice: Pick<HomePopupNotice, 'id' | 'version'>): string {
  /** 同一公告 id 换 version 视为新公告；队列内多条公告互不干扰 */
  return `${notice.id}:${notice.version}`
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function localeMatches(requested: string, candidate: string): boolean {
  const req = requested.trim().toLowerCase()
  const cand = candidate.trim().toLowerCase()
  if (!req || !cand) return false
  return cand === req || cand.startsWith(`${req}-`) || req.startsWith(`${cand}-`)
}

function pickI18nEntry(
  entries: HomePopupNoticeI18n[] | undefined,
  locale: string | undefined,
): HomePopupNoticeI18n | null {
  if (!entries?.length) return null
  if (!locale) return entries[0] ?? null

  return (
    entries.find((entry) => localeMatches(locale, entry.locale)) ??
    entries[0] ??
    null
  )
}

function readOptionalTimestamp(value: unknown): number | null | undefined {
  if (value === null || value === undefined) return null

  const raw = readString(value)
  if (!raw) return null

  const parsed = Date.parse(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

/** 公告是否在 start_time / end_time 窗口内；null 边界表示无限制。 */
export function isHomePopupNoticeWithinSchedule(
  item: Pick<HomePopupNoticeApiItem, 'start_time' | 'end_time'>,
  nowMs: number = Date.now(),
): boolean {
  const startMs = readOptionalTimestamp(item.start_time)
  if (startMs === undefined) return false
  if (startMs !== null && nowMs < startMs) return false

  const endMs = readOptionalTimestamp(item.end_time)
  if (endMs === undefined) return false
  if (endMs !== null && nowMs > endMs) return false

  return true
}

/** Normalize a single API item — resolves i18n image/title when locale is provided. */
export function normalizeHomePopupNotice(
  raw: unknown,
  locale?: string,
  nowMs: number = Date.now(),
): HomePopupNotice | null {
  if (!raw || typeof raw !== 'object') return null

  const item = raw as HomePopupNoticeApiItem & Record<string, unknown>
  if (!isHomePopupNoticeWithinSchedule(item, nowMs)) return null

  const version = readString(item.version) || '1'

  const i18n = pickI18nEntry(item.i18n, locale)
  const title = readString(i18n?.title)
  const content = readString(i18n?.content)
  const imageUrl = readString(i18n?.image_url ?? item.image_url) || null

  if (!imageUrl && !title && !content) return null

  const linkUrl = readString(item.link_url)

  return {
    id: readNumber(item.id),
    version,
    image_url: imageUrl,
    title,
    content,
    link_url: linkUrl || null,
    link_target: readNumber(item.link_target),
    show_once: readShowOnceFromDisplayMode(item.display_mode),
  }
}

export function normalizeHomePopupNotices(
  raw: HomePopupNoticesResponse | undefined,
  locale?: string,
  nowMs: number = Date.now(),
): HomePopupNotice[] {
  if (!raw?.items?.length) return []

  return [...raw.items]
    .sort((left, right) => readNumber(left.sort_order) - readNumber(right.sort_order))
    .map((item) => normalizeHomePopupNotice(item, locale, nowMs))
    .filter((item): item is HomePopupNotice => item !== null)
}

function getPopupNoticeStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function parseDismissedKeys(raw: string | null): Set<string> {
  if (!raw?.trim()) return new Set()

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0))
  } catch {
    return new Set()
  }
}

export function readDismissedPopupKeys(): Set<string> {
  const storage = getPopupNoticeStorage()
  if (!storage) return new Set()

  try {
    const keys = parseDismissedKeys(storage.getItem(DISMISSED_KEYS_STORAGE_KEY))
    if (keys.size > 0) return keys

    const legacyVersion = storage.getItem(LEGACY_DISMISSED_VERSION_KEY)?.trim()
    return legacyVersion ? new Set([legacyVersion]) : new Set()
  } catch {
    return new Set()
  }
}

export function persistDismissedPopupKey(key: string): void {
  const storage = getPopupNoticeStorage()
  if (!storage) return

  try {
    const next = readDismissedPopupKeys()
    next.add(key)
    storage.setItem(DISMISSED_KEYS_STORAGE_KEY, JSON.stringify([...next]))
    storage.removeItem(LEGACY_DISMISSED_VERSION_KEY)
  } catch {
    // private mode / quota — ignore
  }
}

export function shouldShowHomePopupNotice(
  notice: HomePopupNotice,
  dismissedKeys: ReadonlySet<string> = readDismissedPopupKeys(),
): boolean {
  if (!notice.image_url && !notice.title && !notice.content) return false
  if (!notice.show_once) return true

  return !dismissedKeys.has(noticeDismissKey(notice))
}

/** 按 sort_order 取队列中第一条尚未在本会话关闭、且满足持久化规则的公告。 */
export function selectNextHomePopupNotice(
  notices: HomePopupNotice[],
  options: {
    dismissedKeys?: ReadonlySet<string>
    sessionDismissedKeys?: ReadonlySet<string>
    brokenImageKeys?: ReadonlySet<string>
  } = {},
): HomePopupNotice | null {
  const dismissedKeys = options.dismissedKeys ?? readDismissedPopupKeys()
  const sessionDismissedKeys = options.sessionDismissedKeys ?? new Set<string>()
  const brokenImageKeys = options.brokenImageKeys ?? new Set<string>()

  for (const notice of notices) {
    const key = noticeDismissKey(notice)
    if (sessionDismissedKeys.has(key) || brokenImageKeys.has(key)) continue
    if (!shouldShowHomePopupNotice(notice, dismissedKeys)) continue
    return notice
  }

  return null
}
