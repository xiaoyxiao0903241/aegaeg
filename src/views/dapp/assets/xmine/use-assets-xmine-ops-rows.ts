import { useDappShell } from '~/app/use-dapp-shell'
import { useX0MiningLogs } from '~/hooks/use-api-data'
import { mapX0MiningLogToOpsRow } from '~/shared/api/map-flow-log-rows'

export function useAssetsXmineOpsRows() {
  const { sessionReady } = useDappShell()
  const logs = useX0MiningLogs({}, sessionReady)
  return {
    rows: logs.data?.items.map(mapX0MiningLogToOpsRow) ?? [],
    isLoading: sessionReady && logs.isLoading,
  }
}
