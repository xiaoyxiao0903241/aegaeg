import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import { getHomePopupNotices } from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { HomePopupNotice } from '~/shared/api/types'
import {
  normalizeHomePopupNotices,
  noticeDismissKey,
  persistDismissedPopupKey,
  readDismissedPopupKeys,
  selectNextHomePopupNotice,
} from '~/views/dapp/host/notices/popup-notice'

/**
 * DApp 侧栏公告队列
 *
 * 仅 `sessionReady` 后拉取 `/home/popup-notices`。有待展示公告时侧栏可点并带红点；
 * 点击后打开当前条，关闭规则与原先首页弹窗相同（一次性写入本地，常驻本会话跳过，队列自动下一条）。
 *
 * @returns 当前公告、是否有待展示、是否打开，以及点击 / 关闭 / 坏图回调
 * @see docs/backend-api/api.md #一期接口/home/popup-notices
 */
export function useNoticeInbox(): {
  notice: HomePopupNotice | null
  hasPopup: boolean
  open: boolean
  start: () => void
  onDismiss: () => void
  onImageLoadError: () => void
} {
  const { sessionReady } = useAuth()
  const { locale } = useI18n()

  const query = useQuery({
    queryKey: queryKeys.api.homePopupNotices(locale),
    queryFn: () => getHomePopupNotices(locale),
    enabled: sessionReady,
    staleTime: 5 * 60_000,
    retry: 1,
  })

  const sortedNotices = sessionReady ? normalizeHomePopupNotices(query.data, locale) : []

  const [dismissedKeys, setDismissedKeys] = useState(() => readDismissedPopupKeys())
  const [sessionDismissedKeys, setSessionDismissedKeys] = useState<Set<string>>(() => new Set())
  const [brokenImageKeys, setBrokenImageKeys] = useState<Set<string>>(() => new Set())
  const [started, setStarted] = useState(false)

  const notice = selectNextHomePopupNotice(sortedNotices, {
    dismissedKeys,
    sessionDismissedKeys,
    brokenImageKeys,
  })
  const hasPopup = notice !== null
  if (!hasPopup && started) setStarted(false)
  const open = started && hasPopup

  function start() {
    if (!notice) return
    setStarted(true)
  }

  function onDismiss() {
    if (!notice) return

    const key = noticeDismissKey(notice)
    setSessionDismissedKeys((current) => new Set(current).add(key))

    if (notice.show_once) {
      persistDismissedPopupKey(key)
      setDismissedKeys(readDismissedPopupKeys())
    }
  }

  function onImageLoadError() {
    if (!notice) return
    if (notice.title || notice.content) return
    const key = noticeDismissKey(notice)
    setBrokenImageKeys((current) => new Set(current).add(key))
  }

  return {
    notice,
    hasPopup,
    open,
    start,
    onDismiss,
    onImageLoadError,
  }
}
