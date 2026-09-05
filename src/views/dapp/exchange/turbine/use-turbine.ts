import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { submitExchangeWithSuccessToast } from '~/views/dapp/exchange/submit-with-success-toast'

/** 组装 Turbine 面板渲染所需：会话状态 + 文案 + 解锁 / 领取提示编排。 */
export function useTurbine(turbine: TurbineExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappHost()
  const exchangePreview = !sessionReady
  const sellDisabled = (sessionReady && !turbine.walletReady) || turbine.isSubmitting

  const segmentOptions = [
    { label: t.exchange.turbine.segments.unlock, value: 'unlock' },
    { label: t.exchange.turbine.segments.claim, value: 'claim' },
  ]

  async function handleUnlock() {
    // 错误由写链统一 toast（getErrorMessage），这里避免重复提示
    await submitExchangeWithSuccessToast(turbine.submitUnlock, t.exchange.turbine.unlockSuccess)
  }

  async function handleClaim(index: number) {
    await submitExchangeWithSuccessToast(
      () => turbine.submitClaim(index),
      t.exchange.turbine.claimSuccess,
    )
  }

  return {
    t,
    sessionReady,
    exchangePreview,
    sellDisabled,
    segmentOptions,
    unlockableAmountLabel: turbine.quotaLabel,
    usd1AmountLabel: turbine.usd1BalanceLabel,
    willReceiveLabel: turbine.buyAgxLabel,
    onBack: () => setView('hub'),
    handleUnlock,
    handleClaim,
  }
}
