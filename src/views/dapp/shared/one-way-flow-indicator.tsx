import { burnExchangeAssets } from '~/shared/assets/dapp'
import { cn } from '~/shared/lib/utils'

/**
 * 单向金额流向下箭头（兑换销毁 / 闪兑不可翻 / 发展津贴卡叠等共用）
 *
 * 完整箭头图自带外观，勿再包边框按钮或 Lucide 替代。
 */
export function OneWayFlowIndicator({ className }: { className?: string }) {
  return (
    <img
      alt=""
      aria-hidden
      className={cn('size-8.5 shrink-0', className)}
      src={burnExchangeAssets.flowDown}
    />
  )
}
