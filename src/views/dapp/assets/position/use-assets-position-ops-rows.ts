import { useEffect, useState } from 'react'

import { useAppShell } from '~/app/use-app-shell'
import { useBondFlowBurnLogs, useBondFlowLpLogs, useStakeFlowLogs } from '~/hooks/use-api-data'
import { mapBondFlowLogToOpsRow, mapStakeFlowLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import type { AssetsProduct } from '~/views/dapp/assets/position/use-assets-position-widget'

/** 仓位产品的操作记录：按产品类型拉取对应日志并映射为表格行 */
export function useAssetsPositionOpsRows(product: AssetsProduct) {
  const { sessionReady } = useAppShell()
  const [page, setPage] = useState(1)
  const params = tablePageQuery(page)

  useEffect(() => {
    setPage(1)
  }, [product])

  const stakeLogs = useStakeFlowLogs(params, sessionReady && product === 'stake')
  const lpLogs = useBondFlowLpLogs(params, sessionReady && product === 'lpbond')
  const burnLogs = useBondFlowBurnLogs(params, sessionReady && product === 'burnbond')

  const base = { page, setPage, sessionReady }

  if (product === 'stake') {
    return {
      ...base,
      rows: stakeLogs.data?.items.map(mapStakeFlowLogToOpsRow) ?? [],
      total: stakeLogs.data?.total ?? 0,
      isLoading: sessionReady && stakeLogs.isLoading,
    }
  }
  if (product === 'lpbond') {
    return {
      ...base,
      rows: lpLogs.data?.items.map(mapBondFlowLogToOpsRow) ?? [],
      total: lpLogs.data?.total ?? 0,
      isLoading: sessionReady && lpLogs.isLoading,
    }
  }
  return {
    ...base,
    rows: burnLogs.data?.items.map(mapBondFlowLogToOpsRow) ?? [],
    total: burnLogs.data?.total ?? 0,
    isLoading: sessionReady && burnLogs.isLoading,
  }
}
