import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

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
} from '~/views/home/popup-notice'

/**
 * 首页公告状态
 *
 * 拉取并按语言归一化公告队列，维护持久化 / 会话级关闭与坏图集合，
 * 返回当前应展示的公告及关闭、坏图回调。
 *
 * @returns 当前公告、是否展示，以及关闭与坏图回调
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
    open,
    onDismiss: dismissCurrentNotice,
    onImageLoadError,
  }
}
