import { toast } from 'sonner'

import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { useI18n } from '~/i18n/use-i18n'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { BOND_ZAP_BLOCKED, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { readErrorText } from '~/web3/errors/error-text'

/**
 * 债券视图：组合表单状态、CTA 文案与提交入口
 *
 * 提交被推荐关系拦截时引导补绑；
 * 被迁移拦截时停留在原页。
 *
 * @param kind 债券类型：lp / burn
 * @returns 债券表单状态与交互回调
 */
export function useBondView(kind: BondKind) {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const bond = useBondWidget(kind, sessionReady, {
    onSuccess: () => {
      toast.success(copy.success)
    },
    onError: (error) => {
      if (readErrorText(error) === BOND_ZAP_BLOCKED.notBound) goBindReferral()
    },
  })

  const ctaLabel = writeCtaLabel(bond.writePhase, {
    accountMigrated: t.staking.blocked.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: copy.submit,
  })

  const amountLabel = formatAmountBalanceLabel(copy.amountBalance, {
    balance: !sessionReady || !walletReady ? '0.00' : bond.balanceLabel,
  })

  async function onSubmit() {
    if (bond.blockReason === 'accountMigrated') return
    if (bond.blockReason === 'notBound') {
      goBindReferral()
      return
    }
    await bond.submit()
  }

  return {
    t,
    bond,
    copy,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    ctaLabel,
    onSubmit,
    periodLabels: {
      '180': t.staking.stake.periods.d180,
      '360': t.staking.stake.periods.d360,
      '540': t.staking.stake.periods.d540,
    },
  }
}
