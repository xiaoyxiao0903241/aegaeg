import { useDappShell } from '~/app/use-dapp-shell'
import { useBondFlowBurnLogs, useBondFlowLpLogs, useStakeFlowLogs } from '~/hooks/use-api-data'
import { mapBondFlowLogToOpsRow, mapStakeFlowLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import type { AssetsProduct } from '~/views/dapp/assets/position/assets-position-widget'

export function useAssetsPositionOpsRows(product: AssetsProduct) {
  const { sessionReady } = useDappShell()
  const stakeLogs = useStakeFlowLogs({}, sessionReady && product === 'stake')
  const lpLogs = useBondFlowLpLogs({}, sessionReady && product === 'lpbond')
  const burnLogs = useBondFlowBurnLogs({}, sessionReady && product === 'burnbond')

  if (product === 'stake') {
    return {
      rows: stakeLogs.data?.items.map(mapStakeFlowLogToOpsRow) ?? [],
      isLoading: sessionReady && stakeLogs.isLoading,
    }
  }
  if (product === 'lpbond') {
    return {
      rows: lpLogs.data?.items.map(mapBondFlowLogToOpsRow) ?? [],
      isLoading: sessionReady && lpLogs.isLoading,
    }
  }
  return {
    rows: burnLogs.data?.items.map(mapBondFlowLogToOpsRow) ?? [],
    isLoading: sessionReady && burnLogs.isLoading,
  }
}
