import { useQuery } from '@tanstack/react-query'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readContributionSnapshot } from '~/web3/assets/assets-read'
import { formatContributionPlaceholder } from '~/views/dapp/rewards/rewards-display'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** Wallet contribution snapshot for rewards hub/detail stat cards. */
export function useRewardsContributionDisplay(walletReady: boolean) {
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address

  const contribQuery = useQuery({
    queryKey: queryKeys.chain.assetsContribution(address ?? ''),
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const contributionValue = formatContributionPlaceholder({
    walletReady,
    hasAddress: Boolean(address),
    isPending: contribQuery.isPending,
    contribution: contribQuery.data?.contribution,
    decimals: AGX_DECIMALS,
    fractionDigits: 2,
  })

  return { contributionValue, address, contribQuery }
}
