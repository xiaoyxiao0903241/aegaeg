import { useActiveAccount } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateXmineLive } from '~/core/staking/staking-block-reasons'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
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
  const { writeReady } = useWriteReadiness()

  const walletReady = hasWalletAccount(account)

  const preflightQuery = useXminePreflightQuery({
    enabled: sessionReady,
  })

  const balance =
    decisionBigint(preflightQuery.data?.balance, preflightQuery.isPlaceholderData) ?? 0n
  const allowance =
    decisionBigint(preflightQuery.data?.allowance, preflightQuery.isPlaceholderData) ?? 0n
  const balancesLoaded = isDecisionFresh(preflightQuery.isPlaceholderData, preflightQuery.data)

  const amountInput = useCappedTokenAmountInput({
    decimals: GAGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const blockReason = evaluateXmineLive({
    amount: amountInput.amountIn,
    balance,
    allowance,
    miningQuota: balancesLoaded ? (preflightQuery.data?.miningQuota ?? 0n) : 0n,
  })

  const stake = useChainMutation({
    path: WRITE_PATH.XMINE,
    mutation: (_vars, session) =>
      submitXmineStake({
        session,
        amount: amountInput.amountIn,
      }),
    onSuccess: async () => {
      await present.onSuccess()
      amountInput.clearAmount()
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
    !locked && amountInput.amountIn > 0n && blockReason == null && preflightQuery.data !== undefined

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
    balanceLabel:
      preflightQuery.data === undefined
        ? ''
        : formatTokenAmount(preflightQuery.data.balance, GAGX_DECIMALS, 4),
    quotaLabel:
      preflightQuery.data !== undefined
        ? formatTokenAmount(preflightQuery.data.miningQuota, GAGX_DECIMALS, 4)
        : '',
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting: stake.isPending,
    blockReason,
    submit: () => stake.mutate(),
    pool: BSC_CONTRACTS.xStakingPool,
  }
}
