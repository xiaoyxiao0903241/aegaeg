import type { InputHTMLAttributes, ReactNode } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { AmountBox } from '~/shared/components/amount-box'
import { PercentButtonRow, TokenChip } from '~/views/dapp/exchange/primitives-controls'

// —— exchange-amount-flow ——

type AmountToken = { icon?: string; symbol: string }

/**
 * 卖出 / 买入双向金额输入区
 *
 * 上方为可输入的卖出金额与百分比快捷按钮，中间插槽放置方向切换
 * 或单向指示，下方为只读买入金额；会话未就绪时整体进入预览态，
 * 提交中锁定卖出输入。
 */
export function ExchangeAmountFlow({
  amountBoxClassName,
  buy,
  buyAmount,
  buyBalance,
  buyLabel,
  buyTokenAdornment,
  middleSlot,
  onFillPercent,
  onSellAmountChange,
  sell,
  sellAmountDisplay,
  sellBalance,
  sellLabel,
  sellTokenAdornment,
  sessionReady,
  amountLocked = false,
}: {
  amountBoxClassName?: string
  buy: AmountToken
  buyAmount: string
  buyBalance: ReactNode
  /** 覆盖默认卖出 / 买入卡片标签（销毁模式用「销毁 / 获得」文案）。 */
  buyLabel?: string
  /** 市价交易传真实代币选择器（箭头 + 展开列表）；闪兑 / 销毁不传则渲染静态代币标签。 */
  buyTokenAdornment?: ReactNode
  middleSlot: ReactNode
  onFillPercent: (percent: number) => void
  onSellAmountChange: (value: string) => void
  sell: AmountToken
  sellAmountDisplay: string
  sellBalance: ReactNode
  sellLabel?: string
  sellTokenAdornment?: ReactNode
  sessionReady: boolean
  /** 交易进行中锁定卖出输入与百分比按钮（金额已快照）。 */
  amountLocked?: boolean
}) {
  const { messages: t } = useI18n()
  const sellDisabled = amountLocked

  const sellAmountProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    'aria-label': string
  } = {
    'aria-label': `${sell.symbol} sell amount`,
    disabled: sellDisabled,
    inputMode: 'decimal',
    onChange: (event) => onSellAmountChange(event.currentTarget.value),
    placeholder: '0.00',
    value: sellAmountDisplay,
  }

  return (
    <div className="flex flex-col gap-1.5">
      <AmountBox
        amountProps={sellAmountProps}
        balance={sellBalance}
        className={amountBoxClassName}
        label={sellLabel ?? t.exchange.sell}
        sessionReady={sessionReady}
        startAdornment={sellTokenAdornment ?? <TokenChip icon={sell.icon} label={sell.symbol} />}
      />

      <PercentButtonRow
        aria-label={`${sell.symbol} sell percent`}
        disabled={amountLocked}
        onSelect={onFillPercent}
      />

      {middleSlot}

      <AmountBox
        amountProps={{
          'aria-label': `${buy.symbol} receive amount`,
          // 仅展示：禁止输入与聚焦（产品中只有卖出侧可输入）
          onMouseDown: (event) => event.preventDefault(),
          placeholder: '0.00',
          readOnly: true,
          tabIndex: -1,
          value: buyAmount || '0.00',
        }}
        balance={buyBalance}
        className={amountBoxClassName}
        label={buyLabel ?? t.exchange.buy}
        sessionReady={sessionReady}
        startAdornment={buyTokenAdornment ?? <TokenChip icon={buy.icon} label={buy.symbol} />}
      />
    </div>
  )
}
