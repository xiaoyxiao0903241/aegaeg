/**
 * 市价交易袋 UI 零件：代币选择器、代币介绍轮播、FAQ Tab。
 */
import { Fragment, useState } from 'react'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets, tokenCarouselIcons } from '~/shared/assets/dapp'
import { Carousel } from '~/shared/components/carousel'
import { ChipTabs } from '~/shared/components/chip-tabs'
import { CollapseChevron } from '~/shared/components/collapse-chevron'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import {
  exchangeTokenCardKeys,
  type ExchangeTokenKey,
  exchangeTokenKeys,
} from '~/shared/config/exchange-token-keys'
import {
  getExchangeTokenContractAddress,
  openTokenContractOnBscScan,
} from '~/shared/config/token-contracts'
import { cn, revealClass } from '~/shared/lib/utils'
import { ExchangePromoCard, ExchangePromoPillAction } from '~/views/dapp/exchange/primitives'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'

export type ExchangeTokenPickerOption = {
  key: string
  symbol: string
  icon?: string
  balanceLabel: string
  /** 列表中可见但不可选（如 X 仅可卖）。 */
  disabled?: boolean
  /** 禁用项悬停 / 点按提示。 */
  disabledHint?: string
}

/**
 * 卖出 / 买入代币选择
 *
 * 可选多于一个时用胶囊下拉；只有一个选项时只展示代币，不下拉、不显示箭头。
 */
export function ExchangeTokenPicker({
  ariaLabel,
  checkIcon,
  disabled = false,
  onSelect,
  options,
  value,
}: {
  ariaLabel: string
  checkIcon?: string
  disabled?: boolean
  onSelect: (key: string) => void
  options: ExchangeTokenPickerOption[]
  value: string
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.key === value) ?? options[0]

  if (!selected) return null

  const token = (
    <>
      {selected.icon ? (
        <Icon alt="" className="rounded-full" loading="lazy" size="token" src={selected.icon} />
      ) : null}
      <Text as="span" className="leading-none font-semibold" variant="copy">
        {selected.symbol}
      </Text>
    </>
  )

  if (options.length < 2) {
    return (
      <span className={cn('inline-flex shrink-0 items-center gap-2', disabled && 'opacity-40')}>
        {token}
      </span>
    )
  }

  return (
    <DropdownMenu className="shrink-0 items-center" onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border-0 bg-background px-2.5 py-1.5',
          'transition-colors duration-150 ease-out hover:bg-muted',
          disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
        )}
        disabled={disabled}
      >
        {token}
        <CollapseChevron open={open} size="md" />
      </DropdownMenuTrigger>

      <DropdownMenuPanel className="min-w-52">
        {options.map((option) => {
          const active = option.key === value
          const optionDisabled = Boolean(option.disabled)
          const row = (
            <DropdownMenuItem
              disabled={optionDisabled}
              onSelect={() => onSelect(option.key)}
              selected={active}
            >
              {option.icon ? (
                <img
                  alt=""
                  className="size-(--app-icon-rail) shrink-0 rounded-full object-contain"
                  loading="lazy"
                  src={option.icon}
                />
              ) : null}
              <Text as="span" className="min-w-0 flex-1 font-semibold" variant="detail">
                {option.symbol}
              </Text>
              <Text
                as="span"
                className="shrink-0 whitespace-nowrap tabular-nums"
                tone="muted-foreground"
                variant="caption"
              >
                {option.balanceLabel}
              </Text>
              <span
                aria-hidden
                className="flex w-3 shrink-0 items-center justify-end text-xs font-bold text-primary"
              >
                {active ? (
                  checkIcon ? (
                    <img alt="" className="size-3" src={checkIcon} />
                  ) : (
                    '✓'
                  )
                ) : null}
              </span>
            </DropdownMenuItem>
          )

          if (!option.disabledHint) {
            return <Fragment key={option.key}>{row}</Fragment>
          }

          return (
            <Tooltip content={option.disabledHint} key={option.key}>
              <span className="block w-full">{row}</span>
            </Tooltip>
          )
        })}
      </DropdownMenuPanel>
    </DropdownMenu>
  )
}

type ExchangeTokenCarouselKey =
  'agx' | 'usd1' | 'x' | 'gagx' | 'gagxStake' | 'contribution' | 'turbine'

type ExchangeTokenCarouselItem = {
  asset: string
  body: string
  key: ExchangeTokenCarouselKey
  title: string
}

function TokenCarouselCard({
  contractLabel,
  contractTooltip,
  isDesktop,
  token,
}: {
  contractLabel: string
  contractTooltip: string
  isDesktop: boolean
  token: ExchangeTokenCarouselItem
}) {
  const contractDisabled = !getExchangeTokenContractAddress(token.key)

  const contractButton = (
    <ExchangePromoPillAction
      className={contractDisabled ? 'pointer-events-none opacity-45' : undefined}
      disabled={contractDisabled}
      layout={isDesktop ? 'desktop' : 'mobile'}
      onClick={() => openTokenContractOnBscScan(token.key)}
      withArrow
    >
      {contractLabel}
      <img alt="" className="size-2.5" src={dappAssets.arrowUpRight} />
    </ExchangePromoPillAction>
  )

  return (
    <ExchangePromoCard
      action={contractButton}
      actionTooltip={contractTooltip}
      body={token.body}
      rays="muted"
      reveal={false}
      title={token.title}
      titleIconSrc={token.asset}
    />
  )
}

function getExchangeTokenContent(
  t: ReturnType<typeof useI18n>['messages'],
  keys: readonly ExchangeTokenCarouselKey[],
  vars: Readonly<Record<string, string>>,
) {
  const assets: Record<ExchangeTokenCarouselKey, string> = {
    agx: tokenCarouselIcons.agxIcon,
    usd1: tokenCarouselIcons.usd1Icon,
    x: tokenCarouselIcons.xIcon,
    gagx: tokenCarouselIcons.gagxIcon,
    gagxStake: tokenCarouselIcons.gagxIcon,
    contribution: tokenCarouselIcons.agxIcon,
    turbine: tokenCarouselIcons.gagxIcon,
  }

  return keys.map((key) => {
    const copy = t.exchange.tokenAbout.items.find((item) => item.key === key)!
    return {
      asset: assets[key],
      body: interpolate(copy.body, vars),
      key,
      title: copy.title,
    }
  })
}

/**
 * 代币介绍轮播（闪电兑换 / 市价交易 / 销毁 / Turbine 共用）
 *
 * 按传入的卡片键从 i18n 取文案并组装卡片，轮播行为由 Carousel
 * 提供；每张卡片可跳转到对应 BscScan 页。贡献点数卡会插入领取消耗比。
 * 卡片高度共用：正文至少两行，同一次轮播跟最高卡对齐。
 */
export function TokenAboutCarousel({
  cardKeys = exchangeTokenCardKeys,
}: {
  cardKeys?: readonly ExchangeTokenCarouselKey[]
} = {}) {
  const isDesktop = !useMobileViewport()
  const { messages: t } = useI18n()
  const includeContribution = cardKeys.includes('contribution')
  const ratio = useContributionClaimRatioLabel({ enabled: includeContribution })
  const tokens = getExchangeTokenContent(t, cardKeys, { ratio })
  const canSlide = tokens.length > 1

  return (
    <Carousel
      aria-label={t.exchange.tokenAbout.title}
      autoplayMs={canSlide ? 4000 : undefined}
      className={cn(revealClass(), isDesktop ? 'dapp:mt-0' : 'max-dapp:mt-0')}
      data-reveal
      opts={{ align: 'start', loop: canSlide, containScroll: 'trimSnaps', watchDrag: canSlide }}
    >
      <Carousel.Content>
        {tokens.map((token, index) => (
          <Carousel.Item index={index} key={token.key}>
            <TokenCarouselCard
              contractLabel={t.exchange.tokenContract}
              contractTooltip={t.exchange.tokenContractTooltip}
              isDesktop={isDesktop}
              token={token}
            />
          </Carousel.Item>
        ))}
      </Carousel.Content>
      <Carousel.Indicators
        dotLabel={(index) => `${t.exchange.tokenAbout.title} ${index + 1}`}
        nextLabel={t.exchange.tokenNext}
        prevLabel={t.exchange.tokenPrevious}
      />
    </Carousel>
  )
}

export function MarketTradeFaqTabs({
  activeToken,
  onSelect,
}: {
  activeToken: ExchangeTokenKey
  onSelect: (token: ExchangeTokenKey) => void
}) {
  const { messages: t } = useI18n()
  const labels: Record<ExchangeTokenKey, string> = {
    trade: t.exchange.faq.tabs.trade.label,
    usd1: t.exchange.faq.tabs.usd1.label,
    agx: t.exchange.faq.tabs.agx.label,
    x: t.exchange.faq.tabs.x.label,
  }

  return (
    <ChipTabs
      ariaLabel={t.exchange.faq.tabsTitle}
      className="flex flex-wrap gap-2"
      items={exchangeTokenKeys.map((key) => ({
        active: key === activeToken,
        label: labels[key],
      }))}
      onSelect={(index) => {
        const key = exchangeTokenKeys[index]
        if (key) onSelect(key)
      }}
    />
  )
}
