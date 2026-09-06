import { useState } from 'react'

import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import { useI18n } from '~/i18n/use-i18n'
import { getHomePopupNotices } from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { HomePopupNotice } from '~/shared/api/types'
import {
  normalizeHomePopupNotices,
  noticeDismissKey,
  persistDismissedPopupKey,
  readDismissedPopupKeys,
  selectLatestReadNotice,
  selectNextHomePopupNotice,
} from '~/views/dapp/host/notices/popup-notice'

type NoticeQueueKind = 'unread' | 'replay'

/**
 * DApp 侧栏公告队列
 *
 * 登录就绪后带 JWT 拉取 `/home/popup-notices`。
 * 有未读：红点，点开后按原队列关一条出下一条；关掉即写入本地，一律只看一次。
 * 无未读但有已读：无红点，点开只回看 `start_time` 最新的一条；关掉后再点仍是这一条。
 * 未读走完不会自动接已读回看。
 *
 * @returns 当前公告、未读红点，以及点击 / 关闭 / 坏图回调
 * @see docs/backend-api/api.md #一期接口/home/popup-notices
 */
export function useNoticeInbox(): {
  notice: HomePopupNotice | null
  hasUnread: boolean
  open: boolean
  start: () => void
  onDismiss: () => void
  onImageLoadError: () => void
} {
  const { locale } = useI18n()

  const query = useAuthenticatedQuery(queryKeys.api.homePopupNotices(locale), (token) =>
    getHomePopupNotices(token, locale),
  )

  const sortedNotices = normalizeHomePopupNotices(query.data ?? undefined, locale)

  const [dismissedKeys, setDismissedKeys] = useState(() => readDismissedPopupKeys())
  const [sessionDismissedKeys, setSessionDismissedKeys] = useState<Set<string>>(() => new Set())
  const [brokenImageKeys, setBrokenImageKeys] = useState<Set<string>>(() => new Set())
  const [queueKind, setQueueKind] = useState<NoticeQueueKind | null>(null)

  const queueOptions = { dismissedKeys, sessionDismissedKeys, brokenImageKeys }
  const unread = selectNextHomePopupNotice(sortedNotices, queueOptions)
  const replay = selectLatestReadNotice(sortedNotices, queueOptions)
  const hasUnread = unread !== null

  const notice = queueKind === 'unread' ? unread : queueKind === 'replay' ? replay : null
  if (queueKind === 'unread' && unread === null) setQueueKind(null)
  if (queueKind === 'replay' && replay === null) setQueueKind(null)
  const open = queueKind !== null && notice !== null

  function start() {
    if (unread) {
      setQueueKind('unread')
      return
    }
    if (replay) setQueueKind('replay')
  }

  function onDismiss() {
    if (!notice) return

    if (queueKind === 'replay') {
      setQueueKind(null)
      return
    }

    const key = noticeDismissKey(notice)
    setSessionDismissedKeys((current) => new Set(current).add(key))
    persistDismissedPopupKey(key)
    setDismissedKeys(readDismissedPopupKeys())
  }

  function onImageLoadError() {
    if (!notice) return
    if (notice.title || notice.content) return
    const key = noticeDismissKey(notice)
    setBrokenImageKeys((current) => new Set(current).add(key))
  }

  return {
    notice,
    hasUnread,
    open,
    start,
    onDismiss,
    onImageLoadError,
  }
}
