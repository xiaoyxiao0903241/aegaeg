import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { getHomePopupNotices } from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { HomePopupNotice } from '~/shared/api/types'
import {
  dismissPopupNotice,
  normalizeHomePopupNotices,
  readDismissedPopupKeys,
  selectNextHomePopupNotice,
  skipBrokenPopupNoticeImage,
} from '~/views/dapp/host/notices/popup-notice'

/**
 * 首页公告弹窗
 *
 * 进页后拉取生效公告，有未关闭的就自动弹出；关掉后按只弹一次 / 每次都弹记忆。
 *
 * @returns 当前公告、是否打开，以及关闭与坏图回调
 */
export function useHomePopupNotice(): {
  notice: HomePopupNotice | null
  open: boolean
  onDismiss: () => void
  onImageLoadError: () => void
} {
  const { locale } = useI18n()

  const query = useQuery({
    queryKey: queryKeys.api.homePopupNotices(locale),
    queryFn: () => getHomePopupNotices(locale),
    staleTime: 5 * 60_000,
    retry: 1,
  })

  const sortedNotices = normalizeHomePopupNotices(query.data, locale)

  const [dismissedKeys, setDismissedKeys] = useState(() => readDismissedPopupKeys())
  const [sessionDismissedKeys, setSessionDismissedKeys] = useState<Set<string>>(() => new Set())
  const [brokenImageKeys, setBrokenImageKeys] = useState<Set<string>>(() => new Set())

  const notice = selectNextHomePopupNotice(sortedNotices, {
    dismissedKeys,
    sessionDismissedKeys,
    brokenImageKeys,
  })
  const open = notice !== null

  function dismissCurrentNotice() {
    if (!notice) return
    const next = dismissPopupNotice(notice, sessionDismissedKeys)
    setSessionDismissedKeys(next.sessionDismissedKeys)
    if (next.dismissedKeys) setDismissedKeys(next.dismissedKeys)
  }

  function onImageLoadError() {
    if (!notice) return
    const next = skipBrokenPopupNoticeImage(notice, brokenImageKeys)
    if (next) setBrokenImageKeys(next)
  }

  return {
    notice,
    open,
    onDismiss: dismissCurrentNotice,
    onImageLoadError,
  }
}
