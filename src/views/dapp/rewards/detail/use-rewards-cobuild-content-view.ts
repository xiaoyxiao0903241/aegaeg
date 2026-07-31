import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readReferralCount } from '~/web3/referral/referral-read'
import { REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'
import { useRewardsContributionDisplay } from '~/views/dapp/rewards/use-rewards-contribution-display'

type CobuildRecordsTab = 'cobuild' | 'equalize'

export function useRewardsCobuildContentView() {
  const { messages: t } = useI18n()
  const cobuild = t.rewards.cobuild
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const [recordsTab, setRecordsTab] = useState<CobuildRecordsTab>('cobuild')
  const { contributionValue } = useRewardsContributionDisplay(walletReady)

  const countQuery = useQuery({
    queryKey: queryKeys.chain.rewardsCobuildCount(address ?? ''),
    queryFn: () => readReferralCount(address as Address, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const referralCount =
    !walletReady || !address
      ? REWARDS_DASH
      : countQuery.isPending
        ? '…'
        : countQuery.data != null
          ? String(countQuery.data)
          : REWARDS_DASH

  return {
    t,
    cobuild,
    walletReady,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    recordsTabOptions: [
      { label: cobuild.recordsTabCobuild, value: 'cobuild' as const },
      { label: cobuild.recordsTabEqualize, value: 'equalize' as const },
    ],
  }
}
