import { useAgxContributionSummary } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatApiStatLabel, formatContributionPlaceholder } from '~/views/dapp/rewards/shared'
import { readContributionSnapshot } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 奖励页统计卡所需的贡献快照
 *
 * 会话就绪时优先取后端可用贡献（agx-contribution/summary）；
 * 否则回退链上贡献快照，并按未连接 / 加载中 / 有值出占位文本。
 *
 * @param walletReady 钱包是否就绪
 * @see docs/backend-api/api.md #agx-contribution/summary
 */
export function useRewardsContributionDisplay(walletReady: boolean) {
  const { sessionReady } = useDappHost()
  const account = useActiveAccount()
  const address = account?.address
  const apiSummary = useAgxContributionSummary(sessionReady)

  const contribQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsContribution,
    queryFn: (addr) => readContributionSnapshot(addr as Address, 0n),
  })

  const contributionValue =
    sessionReady && apiSummary.data != null
      ? formatApiStatLabel(
          sessionReady,
          apiSummary.isLoading,
          apiSummary.data.available_contribution,
        )
      : formatContributionPlaceholder({
          walletReady,
          hasAddress: Boolean(address),
          isPending: contribQuery.isPending,
          contribution: contribQuery.data?.contribution,
          decimals: AGX_DECIMALS,
          fractionDigits: 2,
        })

  return { contributionValue, address, contribQuery }
}
