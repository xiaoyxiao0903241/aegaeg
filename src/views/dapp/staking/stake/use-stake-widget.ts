import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateNeedReferral } from '~/core/referral/need-referral'
import { evaluateStakeLive } from '~/core/staking/staking-block-reasons'
import { STAKE_PERIODS } from '~/core/staking/staking-period'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useStakingPeriodsStore } from '~/stores/staking-periods-store'
import { bindUnlockedAmountEditors, evaluateStakingAmountWrite } from '~/views/dapp/staking/shared'
import { submitStakeOpen } from '~/views/dapp/staking/stake/submit-stake'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import { stakePoolAddress } from '~/web3/staking/staking-addresses'
import { useStakeOpenPreflightQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export type StakeWritePresent = {
  onOpenSuccess: () => void | Promise<void>
  /** 仅附加副作用，默认错误提示始终随后执行。 */
  onError?: (error: unknown) => void
}

/**
 * 质押表单核心状态
 *
 * 维护周期 / 数量 / 预检 / 迁移状态，
 * 通过 evaluateStakeLive 判定可写条件并执行质押提交。
 *
 * @param sessionReady 会话是否就绪（决定是否取数）
 * @param present 写入成功 / 失败的附加副作用
 * @returns 表单展示值与提交控制
 */
export function useStakeWidget(sessionReady: boolean, present: StakeWritePresent) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const period = useStakingPeriodsStore((state) => state.stakePeriod)
  const setStakePeriod = useStakingPeriodsStore((state) => state.setStakePeriod)

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const pool = stakePoolAddress(period)

  // 预热各周期池，切换周期时命中缓存（池地址在查询键内）。
  const preflightLiquid = useStakeOpenPreflightQuery(stakePoolAddress('liquid'), true, {
    enabled: sessionReady,
  })
  const preflight180 = useStakeOpenPreflightQuery(stakePoolAddress('180'), false, {
    enabled: sessionReady,
  })
  const preflight360 = useStakeOpenPreflightQuery(stakePoolAddress('360'), false, {
    enabled: sessionReady,
  })
  const preflight540 = useStakeOpenPreflightQuery(stakePoolAddress('540'), false, {
    enabled: sessionReady,
  })
  const periodPreflights = [preflightLiquid, preflight180, preflight360, preflight540] as const
  const preflightQuery = periodPreflights[STAKE_PERIODS.indexOf(period)]!

  const migration = useMigrationUser(address, { enabled: walletReady })

  const balance =
    decisionBigint(preflightQuery.data?.balance, preflightQuery.isPlaceholderData) ?? 0n
  const allowance =
    decisionBigint(preflightQuery.data?.allowance, preflightQuery.isPlaceholderData) ?? 0n
  const balancesLoaded = isDecisionFresh(preflightQuery.isPlaceholderData, preflightQuery.data)

  const amountInput = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const isBound = balancesLoaded ? (preflightQuery.data?.isBound ?? false) : false
  const needReferral = evaluateNeedReferral(preflightQuery.data?.isBound) === 'need_referral'

  const blockReason = evaluateStakeLive({
    amount: amountInput.amountIn,
    isBound,
    balance,
    allowance,
    remainingQuota: balancesLoaded ? (preflightQuery.data?.remainingQuota ?? 0n) : 0n,
    poolOpen: balancesLoaded ? preflightQuery.data?.poolOpen : undefined,
    isOldAccount: migration.isOldAccount,
  })

  const open = useChainMutation({
    path: WRITE_PATH.STAKING,
    mutation: (_vars, session) =>
      submitStakeOpen({
        session,
        period,
        amount: amountInput.amountIn,
      }),
    onSuccess: async () => {
      await present.onOpenSuccess()
      amountInput.clearAmount()
    },
    onError: present.onError,
  })

  const isSubmitting = open.isPending
  const isLocked = open.isLocked

  const { canSubmit, writePhase } = evaluateStakingAmountWrite({
    unknownReceiptLocked: isLocked,
    isSubmitting,
    writeReady,
    walletReady,
    amountIn: amountInput.amountIn,
    blockReason,
    preflightReady: preflightQuery.data !== undefined,
    needReferral,
    accountMigrated: migration.isOldAccount === true,
  })

  function unlock() {
    open.clearLock()
  }

  const { setAmount, fillMax } = bindUnlockedAmountEditors(unlock, amountInput)

  function changePeriod(next: string) {
    if (next === period) return
    if (next !== 'liquid' && next !== '180' && next !== '360' && next !== '540') return
    unlock()
    amountInput.clearAmount()
    setStakePeriod(next)
  }

  return {
    period,
    setPeriod: changePeriod,
    amount: amountInput.amount,
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount,
    fillMax,
    balanceLabel:
      preflightQuery.data === undefined
        ? ''
        : formatTokenAmount(preflightQuery.data.balance, AGX_DECIMALS, 4),
    isBalancesLoading: walletReady && (!balancesLoaded || preflightQuery.isLoading),
    walletReady,
    canSubmit,
    isSubmitting,
    blockReason,
    writePhase,
    submit: () => open.mutate(),
    pool,
  }
}
