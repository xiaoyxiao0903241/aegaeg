import type {
  HomePopupNotice,
  HomePopupNoticeApiItem,
  HomePopupNoticeI18n,
  HomePopupNoticesResponse,
} from '~/shared/api/types'

/** 沿用旧键，避免已关闭的公告再次弹出。 */
const DISMISSED_KEYS_STORAGE_KEY = 'aegis.home.popupNotice.dismissedKeys'
/** @deprecated 已迁移至 dismissedKeys */
const LEGACY_DISMISSED_VERSION_KEY = 'aegis.home.popupNotice.dismissedVersion'

/** display_mode: 1=只弹一次, 2=每次进首页都弹 */
export function readShowOnceFromDisplayMode(displayMode: unknown): boolean {
  const mode = typeof displayMode === 'number' ? displayMode : Number(displayMode)
  if (Number.isNaN(mode)) return true
  return mode === 1
}

/**
 * 公告关闭标识
 *
 * 同一公告 id 换 version 视为新公告；队列内多条公告互不干扰。
 *
 * @param notice 公告或其 id/version
 */
export function noticeDismissKey(notice: Pick<HomePopupNotice, 'id' | 'version'>): string {
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

  return entries.find((entry) => localeMatches(locale, entry.locale)) ?? entries[0] ?? null
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

/**
 * 归一化单条公告数据
 *
 * 按 locale 解析 i18n 标题/图片，超出投放时间窗口时返回 null；
 * 图片、标题、正文全为空也视为无效公告。
 *
 * @param raw 后端返回的原始公告项
 * @param locale 当前语言
 * @returns 规范化后的公告，无效时返回 null
 */
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

/** 归一化公告列表：按 sort_order 升序，丢弃无效项。 */
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
    return new Set(
      parsed.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0),
    )
  } catch {
    return new Set()
  }
}

/** 读取已关闭公告 key 集合，兼容旧版单值存储。 */
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

/** 持久化已关闭公告 key，并清理旧版存储键。 */
export function persistDismissedPopupKey(key: string): void {
  const storage = getPopupNoticeStorage()
  if (!storage) return

  try {
    const next = readDismissedPopupKeys()
    next.add(key)
    storage.setItem(DISMISSED_KEYS_STORAGE_KEY, JSON.stringify([...next]))
    storage.removeItem(LEGACY_DISMISSED_VERSION_KEY)
  } catch {
    // 隐私模式或存储配额满时忽略
  }
}

/**
 * 关掉当前公告：本会话跳过；一次性公告再写入本地。
 *
 * @param notice 正在关闭的公告
 * @param sessionDismissedKeys 本会话已关 key
 * @returns 更新后的会话集合；一次性公告另带回持久化集合
 */
export function dismissPopupNotice(
  notice: HomePopupNotice,
  sessionDismissedKeys: ReadonlySet<string>,
): { sessionDismissedKeys: Set<string>; dismissedKeys: Set<string> | null } {
  const key = noticeDismissKey(notice)
  const nextSession = new Set(sessionDismissedKeys).add(key)
  if (!notice.show_once) return { sessionDismissedKeys: nextSession, dismissedKeys: null }
  persistDismissedPopupKey(key)
  return { sessionDismissedKeys: nextSession, dismissedKeys: readDismissedPopupKeys() }
}

/**
 * 图片损坏且无正文时跳过该条，避免空窗卡住队列。
 *
 * @param notice 当前公告
 * @param brokenImageKeys 已跳过的坏图 key
 * @returns 更新后的集合；有正文则不跳过，返回 null
 */
export function skipBrokenPopupNoticeImage(
  notice: HomePopupNotice,
  brokenImageKeys: ReadonlySet<string>,
): Set<string> | null {
  if (notice.title || notice.content) return null
  return new Set(brokenImageKeys).add(noticeDismissKey(notice))
}

/** 是否展示该公告：一次性公告需未被持久化关闭，常驻公告始终展示。 */
export function shouldShowHomePopupNotice(
  notice: HomePopupNotice,
  dismissedKeys: ReadonlySet<string> = readDismissedPopupKeys(),
): boolean {
  if (!notice.image_url && !notice.title && !notice.content) return false
  if (!notice.show_once) return true
  return !dismissedKeys.has(noticeDismissKey(notice))
}

type NoticeQueueOptions = {
  dismissedKeys?: ReadonlySet<string>
  sessionDismissedKeys?: ReadonlySet<string>
  brokenImageKeys?: ReadonlySet<string>
}

function resolveNoticeQueueOptions(options: NoticeQueueOptions = {}): {
  dismissedKeys: ReadonlySet<string>
  sessionDismissedKeys: ReadonlySet<string>
  brokenImageKeys: ReadonlySet<string>
} {
  return {
    dismissedKeys: options.dismissedKeys ?? readDismissedPopupKeys(),
    sessionDismissedKeys: options.sessionDismissedKeys ?? new Set<string>(),
    brokenImageKeys: options.brokenImageKeys ?? new Set<string>(),
  }
}

function isUnreadNotice(
  notice: HomePopupNotice,
  options: {
    dismissedKeys: ReadonlySet<string>
    sessionDismissedKeys: ReadonlySet<string>
    brokenImageKeys: ReadonlySet<string>
  },
): boolean {
  const key = noticeDismissKey(notice)
  if (options.sessionDismissedKeys.has(key) || options.brokenImageKeys.has(key)) return false
  return shouldShowHomePopupNotice(notice, options.dismissedKeys)
}

/**
 * 取队列中应展示的第一条未读公告
 *
 * 按 sort_order 升序遍历，跳过本会话已关闭、图片已损坏或满足持久化
 * 关闭规则的公告，全部被跳过则返回 null。
 *
 * @param notices 已归一化的公告队列
 * @returns 应展示的未读公告，无未读时返回 null
 * @see docs/backend-api/api.md #一期接口/home/popup-notices
 */
export function selectNextHomePopupNotice(
  notices: HomePopupNotice[],
  options: NoticeQueueOptions = {},
): HomePopupNotice | null {
  const resolved = resolveNoticeQueueOptions(options)

  for (const notice of notices) {
    if (isUnreadNotice(notice, resolved)) return notice
  }

  return null
}
