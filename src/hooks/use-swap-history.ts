import { useCallback, useEffect, useState } from 'react'
import {
  mapSwapHistoryToDesktopRows,
  mapSwapHistoryToMobileRows,
  readSwapHistory,
  type SwapHistoryRecord,
} from '../lib/swap/swap-history'

export function useSwapHistory() {
  const [records, setRecords] = useState<SwapHistoryRecord[]>(() => readSwapHistory())

  const refresh = useCallback(() => {
    setRecords(readSwapHistory())
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'aegis.swapHistory') {
        refresh()
      }
    }

    const handleLocalUpdate = () => {
      refresh()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('aegis:swap-history-updated', handleLocalUpdate)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('aegis:swap-history-updated', handleLocalUpdate)
    }
  }, [refresh])

  return {
    records,
    desktopRows: mapSwapHistoryToDesktopRows(records),
    mobileRows: mapSwapHistoryToMobileRows(records),
    refresh,
  }
}
