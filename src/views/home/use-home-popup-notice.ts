import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  normalizeHomePopupNotices,
  noticeDismissKey,
  persistDismissedPopupKey,
  readDismissedPopupKeys,
  selectNextHomePopupNotice,
} from '~/views/home/popup-notice'
import { useI18n } from '~/i18n/use-i18n'
import { getHomePopupNotices } from '~/shared/api/endpoints'
import type { HomePopupNotice } from '~/shared/api/types'
import { queryKeys } from '~/shared/api/query/query-keys'

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

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(notice !== null)
  }, [notice])

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
    open: open && notice !== null,
    onDismiss: dismissCurrentNotice,
    onImageLoadError,
  }
}
