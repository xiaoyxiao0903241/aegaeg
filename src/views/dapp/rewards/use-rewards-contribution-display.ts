import { useDappShell } from '~/app/use-dapp-shell'
import { useAgxContributionSummary } from '~/hooks/use-api-data'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { readContributionSnapshot } from '~/web3/assets/assets-read'
import {
  formatApiStatLabel,
  formatContributionPlaceholder,
} from '~/views/dapp/rewards/rewards-display'
import { useChainQuery } from '~/hooks/use-chain-query'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** Wallet contribution snapshot for rewards hub/detail stat cards. */
export function useRewardsContributionDisplay(walletReady: boolean) {
  const { sessionReady } = useDappShell()
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
