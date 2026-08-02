import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateXmineLive, xmineSpendableCap } from '~/core/staking/staking-block-reasons'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { submitXmineStake } from '~/views/dapp/staking/xmine/submit-xmine'
import { useXminePreflightQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

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
  const miningQuota =
    decisionBigint(preflightQuery.data?.miningQuota, preflightQuery.isPlaceholderData) ?? 0n
  const miningStaked =
    decisionBigint(preflightQuery.data?.miningStaked, preflightQuery.isPlaceholderData) ?? 0n
  const balancesLoaded = isDecisionFresh(preflightQuery.isPlaceholderData, preflightQuery.data)

  // Max / 键入封顶：min(钱包 gAGX, 剩余挖矿额度)
  const spendable = xmineSpendableCap(balance, miningQuota, miningStaked)
  const remainingQuota = miningQuota > miningStaked ? miningQuota - miningStaked : 0n

  const amountInput = useCappedTokenAmountInput({
    decimals: GAGX_DECIMALS,
    balance: spendable,
    balancesLoaded,
    sessionReady,
  })

  const blockReason = evaluateXmineLive({
    amount: amountInput.amountIn,
    balance,
    allowance,
    miningQuota: remainingQuota,
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

  // 手册：授权不足仍可提交，内联 approve → live → stake。
  const moneyOk = blockReason == null || blockReason === 'insufficientAllowance'
  const canSubmit =
    !locked && amountInput.amountIn > 0n && moneyOk && preflightQuery.data !== undefined

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
