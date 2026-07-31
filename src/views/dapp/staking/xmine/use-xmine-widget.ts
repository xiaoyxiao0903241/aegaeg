import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateXmineLiveGate } from '~/core/staking/staking-gates'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { useXminePreflightQuery } from '~/web3/staking/use-staking-queries'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitXmineStake } from '~/views/dapp/staking/xmine/submit-xmine'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type XmineWritePresent = {
  onSuccess: () => void | Promise<void>
  /** Extra side effects only — default error toast always runs after. */
  onError?: (error: unknown) => void
}

export function useXmineWidget(sessionReady: boolean, present: XmineWritePresent) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()

  const address = account?.address
  const walletReady = hasWalletAccount(account)

  const preflightQuery = useXminePreflightQuery(address, {
    enabled: sessionReady && walletReady,
  })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: GAGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const gate = evaluateXmineLiveGate({
    amount: amountInput.amountIn,
    balance,
    allowance: preflightQuery.data?.allowance ?? 0n,
    miningQuota: preflightQuery.data?.miningQuota ?? 0n,
  })

  const stake = useChainMutation({
    path: WRITE_PATH.XMINE,
    mutation: () =>
      submitXmineStake({
        amount: amountInput.amountIn,
        account,
        wallet,
        readClient,
      }),
    onSuccess: async () => {
      await present.onSuccess()
      amountInput.clearAmount()
      await preflightQuery.refetch()
    },
    onError: present.onError,
  })

  const locked = writeCtaDisabled({
    unknownReceiptLocked: stake.isLocked,
    isSubmitting: stake.isPending,
    writeReady,
    walletReady,
  })

  const canSubmit =
    !locked && amountInput.amountIn > 0n && gate == null && preflightQuery.data !== undefined

  function unlock() {
    stake.clearLock()
  }

  function setAmount(value: string) {
    unlock()
    amountInput.setAmount(value)
  }

  function fillMax() {
    unlock()
    amountInput.fillPercent(100)
  }

  return {
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount,
    fillMax,
    balanceLabel: formatTokenAmount(balance, GAGX_DECIMALS, 4),
    quotaLabel:
      preflightQuery.data !== undefined
        ? formatTokenAmount(preflightQuery.data.miningQuota, GAGX_DECIMALS, 4)
        : '—',
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting: stake.isPending,
    gate,
    submit: () => stake.mutate(),
    pool: BSC_CONTRACTS.xStakingPool,
  }
}
