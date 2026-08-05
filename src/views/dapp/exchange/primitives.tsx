import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { burnExchangeAssets, dappAssets } from '~/app/assets'
import { TokenChip } from '~/app/shell/token-chip'
import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import { AmountBox } from '~/shared/components/amount-box'
import { Card } from '~/shared/components/card'
import { Chip } from '~/shared/components/chip'
import { Icon } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

// —— percent-button-row ——

export type PercentButtonRowProps = {
  'aria-label': string
  className?: string
  disabled?: boolean
  onSelect: (percent: number) => void
  values?: number[]
  /** 快捷按钮的文案格式；Turbine 末档渲染「Max」，默认渲染 `N%`。 */
  formatLabel?: (percent: number) => string
}

/**
 * 卖出金额百分比快捷按钮行（25/50/75/100）
 *
 * 纯页面控件，非分段选择器；点击回调传入对应百分比。
 */
export function PercentButtonRow({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  formatLabel = (percent) => `${percent}%`,
  onSelect,
  values = [25, 50, 75, 100],
}: PercentButtonRowProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)} role="group" aria-label={ariaLabel}>
      {values.map((percent) => (
        <Chip
          key={percent}
          className="h-6 min-h-6 py-0 text-xs font-semibold"
          disabled={disabled}
          onClick={() => onSelect(percent)}
          shape="pill"
          size="md"
          type="button"
          variant="outlined"
          tone="default"
        >
          {formatLabel(percent)}
        </Chip>
      ))}
    </div>
  )
}

// —— exchange-flow-button ——

export const exchangeFlipCard = tv({
  variants: {
    flipping: {
      true: 'animate-[exchange-card-flip_var(--motion-dapp-emphasis)_var(--motion-dapp-ease)_both]',
      false: '',
    },
  },
  defaultVariants: {
    flipping: false,
  },
})

const exchangeFlowButton = tv({
  base: cn(
    'grid size-8.5 shrink-0 place-items-center rounded-control border border-border bg-card p-0',
    'text-sm leading-none tracking-[-0.02em] text-foreground shadow-none',
  ),
  variants: {
    interactive: {
      true: cn(
        'origin-center',
        'duration-dapp-fast transition-[border-color,background-color,box-shadow,transform,opacity] ease-out',
        'enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:hover:border-primary',
        'enabled:focus-visible:scale-[1.02] enabled:focus-visible:border-primary',
        'enabled:active:scale-[0.985] enabled:active:border-primary enabled:active:duration-75',
        'disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60',
      ),
      false: '',
    },
  },
  defaultVariants: {
    interactive: false,
  },
})

type ExchangeFlowButtonProps = {
  'aria-hidden'?: boolean
  'aria-label'?: string
  children: ReactNode
  className?: string
  disabled?: boolean
  interactive?: boolean
  onClick?: () => void
}

/** 方向切换 / 翻转按钮。 */
export function ExchangeFlowButton({
  children,
  className,
  disabled,
  interactive = false,
  onClick,
  ...aria
}: ExchangeFlowButtonProps) {
  if (interactive) {
    return (
      <button
        {...aria}
        className={cn(exchangeFlowButton({ interactive: true }), className)}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    )
  }

  return (
    <div {...aria} className={cn(exchangeFlowButton({ interactive: false }), className)}>
      {children}
    </div>
  )
}

/**
 * 单向流程指示（销毁、闪兑 USDT 等不可翻转场景）
 *
 * 完整箭头图片自带外观，直接渲染，勿再包方向切换按钮。
 */
export function ExchangeOneWayFlowIndicator({ className }: { className?: string }) {
  return (
    <img
      alt=""
      aria-hidden
      className={cn('size-8.5 shrink-0', className)}
      src={burnExchangeAssets.flowDown}
    />
  )
}

// —— exchange-provider-meta-value ——

/** 兑换信息行内的提供方名称 + 外链打开按钮。 */
export function ExchangeProviderMetaValue({
  name,
  ariaLabel,
  onOpen,
  iconSrc,
}: {
  name: string
  ariaLabel: string
  onOpen: () => void
  iconSrc: string
}) {
  return (
    <>
      {name}
      <button
        aria-label={ariaLabel}
        className="duration-dapp-fast grid size-4 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
        onClick={onOpen}
        type="button"
      >
        <Icon alt="" className="size-2.5" src={iconSrc} />
      </button>
    </>
  )
}

/** 构造一条外部提供方链接的列表行。 */
export function exchangeProviderMetaRow({
  label,
  name,
  ariaLabel,
  onOpen,
  iconSrc,
}: {
  label: string
  name: string
  ariaLabel: string
  onOpen: () => void
  iconSrc: string
}) {
  return {
    label,
    value: (
      <ExchangeProviderMetaValue
        ariaLabel={ariaLabel}
        iconSrc={iconSrc}
        name={name}
        onOpen={onOpen}
      />
    ),
    valueClassName: 'inline-flex items-center justify-end gap-1',
  }
}

// —— exchange-widget-session-footer ——

/** 兑换提交按钮下方的通用提示区：未连接时引导连接，有阻断原因时展示告警。 */
export function ExchangeWidgetSessionFooter({
  sessionReady,
  blockHint,
}: {
  sessionReady: boolean
  blockHint?: string | null
}) {
  return (
    <>
      {!sessionReady ? <WidgetConnectPromo className="mt-3.5" /> : null}
      {blockHint ? (
        <InlineAlert className="mt-3" role="status">
          {blockHint}
        </InlineAlert>
      ) : null}
    </>
  )
}

// —— exchange-promo-card ——

type PromoLayout = 'desktop' | 'mobile'

const exchangePromoCard = tv({
  slots: {
    bodyGrid: 'relative z-1 grid gap-2',
    titleRow: 'flex w-full min-w-0 items-center',
    titleCluster: 'flex min-w-0 items-center',
    title: 'wrap-break-word',
    body: 'm-0 min-w-0 wrap-break-word',
    titleIcon: 'grid shrink-0 overflow-hidden rounded-full',
    mobileActionWrap: 'inline-flex shrink-0 self-center',
    decorationMobile: 'pointer-events-none absolute top-0 right-0 w-30',
    decorationDesktop:
      'pointer-events-none absolute inset-y-0 right-0 h-full w-80 object-cover object-right',
  },
  variants: {
    layout: {
      desktop: {
        bodyGrid: 'p-4 pr-36',
        titleRow: 'gap-3',
        titleCluster: 'gap-3',
        title: 'wrap-break-word',
        body: 'max-w-xl wrap-break-word',
        titleIcon: 'size-8',
      },
      mobile: {
        bodyGrid: 'px-4 py-3.5',
        titleRow: 'flex-wrap justify-between gap-2',
        titleCluster: 'min-w-0 flex-1 gap-2',
        title: 'wrap-break-word',
        body: 'max-w-none wrap-break-word',
        titleIcon: 'size-7.5',
      },
    },
    rays: {
      usd1: {
        decorationMobile: 'opacity-95',
        decorationDesktop: 'opacity-95',
      },
      muted: {
        decorationMobile: 'opacity-[0.72]',
        decorationDesktop: 'opacity-[0.72]',
      },
    },
  },
  defaultVariants: {
    rays: 'usd1',
  },
})

export function ExchangePromoPillAction({
  children,
  className,
  layout,
  withArrow = false,
  fullWidth = false,
  minConnectWidth = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  layout: PromoLayout
  withArrow?: boolean
  fullWidth?: boolean
  minConnectWidth?: boolean
}) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border bg-card whitespace-nowrap text-foreground',
        withArrow ? 'gap-1.5' : 'justify-center',
        layout === 'desktop'
          ? cn(
              // 桌面端操作按钮悬浮在卡片右侧
              'absolute top-1/2 right-4 z-2 -translate-y-1/2 px-4 py-2.5',
              'text-(length:--type-copy-size) leading-[1.2] font-semibold',
              !withArrow && minConnectWidth && 'min-w-31',
              'duration-dapp-fast transition-[border-color,transform] ease-out',
              'hover:translate-x-px hover:border-primary',
              'focus-visible:translate-x-px focus-visible:border-primary',
              'disabled:pointer-events-none disabled:opacity-45',
            )
          : cn(
              'px-3 py-1.5 text-xs leading-[1.2] font-semibold',
              !withArrow && fullWidth && 'w-full justify-center',
            ),
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

function CardDecoration({ layout, rays }: { layout: PromoLayout; rays: 'usd1' | 'muted' }) {
  const styles = exchangePromoCard({ layout, rays })

  if (layout === 'mobile') {
    return (
      <img
        alt=""
        aria-hidden
        className={cn(styles.decorationMobile())}
        src={dappAssets.tokenCardCorner}
      />
    )
  }

  return (
    <img
      alt=""
      aria-hidden
      className={cn(styles.decorationDesktop())}
      src={dappAssets.tokenCardRays}
    />
  )
}

function TitleIcon({ layout, src }: { layout: PromoLayout; src: string }) {
  const dimension = layout === 'desktop' ? 32 : 30
  const styles = exchangePromoCard({ layout })

  return (
    <span aria-hidden="true" className={styles.titleIcon()}>
      <img alt="" className="block size-full" height={dimension} src={src} width={dimension} />
    </span>
  )
}

/**
 * 推广卡片（代币介绍 / 兑换引导）
 *
 * 桌面端操作按钮绝对定位在右侧，移动端按钮内联到标题行；
 * 装饰图与卡片图标按 layout / rays 变体渲染，进入视口时渐显。
 */
export function ExchangePromoCard({
  action,
  actionTooltip,
  body,
  className,
  rays = 'usd1',
  reveal = true,
  shellClassName,
  title,
  titleIconSrc,
}: {
  action: ReactElement
  actionTooltip?: string
  body: string
  className?: string
  rays?: 'usd1' | 'muted'
  reveal?: boolean
  shellClassName?: string
  title: string
  titleIconSrc?: string
}) {
  const isDesktop = !useMobileViewport()
  const layout: PromoLayout = isDesktop ? 'desktop' : 'mobile'
  const styles = exchangePromoCard({ layout, rays })
  const actionNode = actionTooltip ? <Tooltip content={actionTooltip}>{action}</Tooltip> : action

  return (
    <Card
      as="article"
      surface="soft"
      className={cn(
        // 圆角与阴影由 soft 表面提供，内边距由正文容器承担（此处清零）
        'relative min-w-0 p-0',
        shellClassName,
        reveal && revealClass(),
        className,
      )}
      data-reveal={reveal ? '' : undefined}
    >
      <CardDecoration layout={layout} rays={rays} />
      <div className={styles.bodyGrid()}>
        <div className={styles.titleRow()}>
          <div className={styles.titleCluster()}>
            {titleIconSrc ? <TitleIcon layout={layout} src={titleIconSrc} /> : null}
            <Text
              as="strong"
              variant="headline"
              className={cn(
                styles.title(),
                layout === 'desktop' ? 'text-base/normal' : 'text-sm leading-[1.2]',
              )}
            >
              {title}
            </Text>
          </div>
          {!isDesktop ? <span className={styles.mobileActionWrap()}>{actionNode}</span> : null}
        </div>
        <Text as="p" variant="copy" tone="muted-foreground" className={styles.body()}>
          {body}
        </Text>
      </div>
      {isDesktop ? actionNode : null}
    </Card>
  )
}

// —— exchange-amount-flow ——

type AmountToken = { icon?: string; symbol: string }

/**
 * 卖出 / 买入双向金额输入区
 *
 * 上方为可输入的卖出金额与百分比快捷按钮，中间插槽放置方向切换
 * 或单向指示，下方为只读买入金额；会话未就绪时整体进入预览态，
 * 未连接钱包或提交中时锁定卖出输入。
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
  walletReady,
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
  walletReady: boolean
  /** 交易进行中锁定卖出输入与百分比按钮（金额已快照）。 */
  amountLocked?: boolean
}) {
  const { messages: t } = useI18n()
  const exchangePreview = !sessionReady
  const sellDisabled = (sessionReady && !walletReady) || amountLocked

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
    <>
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
        className="pt-1.5 max-dapp:mt-3 max-dapp:py-0"
        disabled={(!exchangePreview && !walletReady) || amountLocked}
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
          value: exchangePreview ? buyAmount || '0.00' : buyAmount || '0.00',
        }}
        balance={buyBalance}
        className={cn('mt-0', amountBoxClassName)}
        label={buyLabel ?? t.exchange.buy}
        sessionReady={sessionReady}
        startAdornment={buyTokenAdornment ?? <TokenChip icon={buy.icon} label={buy.symbol} />}
      />
    </>
  )
}
