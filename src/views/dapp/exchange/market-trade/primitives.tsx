/**
 * 市价交易袋 UI 零件：滑点弹窗、代币选择器、代币介绍轮播、FAQ Tab。
 */
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

import { MAX_SLIPPAGE_PERCENT } from '~/core/exchange/token-amount'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets, tokenCarouselIcons } from '~/shared/assets/dapp'
import { Button } from '~/shared/components/button'
import { Carousel } from '~/shared/components/carousel'
import { Chip } from '~/shared/components/chip'
import { ChipTabs } from '~/shared/components/chip-tabs'
import { CollapseChevron } from '~/shared/components/collapse-chevron'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Icon, iconVariants } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { Text, textVariants } from '~/shared/components/text'
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

const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3, 5] as const

function parseSlippageInput(value: string) {
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_SLIPPAGE_PERCENT) return null
  return parsed
}

/**
 * 滑点设置弹窗
 *
 * 支持预设档位与手动输入，输入无效时回退到当前值；
 * 打开时按当前滑点重置草稿。
 */
export function ExchangeSlippageModal({
  onConfirm,
  onOpenChange,
  open,
  slippage,
}: {
  open: boolean
  slippage: number
  onOpenChange: (open: boolean) => void
  onConfirm: (value: number) => void
}) {
  const { messages: t } = useI18n()
  // 打开时重建组件，使草稿值从当前滑点重置，免去 effect
  return open ? (
    <ExchangeSlippageModalOpen
      key={slippage}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
      open={open}
      slippage={slippage}
      t={t}
    />
  ) : null
}

function ExchangeSlippageModalOpen({
  onConfirm,
  onOpenChange,
  open,
  slippage,
  t,
}: {
  open: boolean
  slippage: number
  onOpenChange: (open: boolean) => void
  onConfirm: (value: number) => void
  t: ReturnType<typeof useI18n>['messages']
}) {
  const [draft, setDraft] = useState(String(slippage))

  const draftValue = parseSlippageInput(draft)

  const handleConfirm = () => {
    const next = draftValue ?? slippage
    onConfirm(next)
    onOpenChange(false)
  }

  return (
    <ResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
    >
      <SheetHandle />
      <div className="flex items-center justify-between pb-5 dapp:pb-5">
        <DialogPrimitive.Title asChild>
          <Text as="h2" variant="panel" className="m-0">
            {t.exchange.slippage}
          </Text>
        </DialogPrimitive.Title>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Text as="label" className="sr-only" htmlFor="exchange-slippage-input" variant="copy">
            {t.exchange.slippage}
          </Text>
          <div className="flex h-11 items-center justify-between rounded-sm border border-border bg-card px-3.5">
            <Input
              variant="default"
              className={cn(
                'border-0 bg-transparent p-0 text-inherit',
                textVariants({ variant: 'headline' }),
              )}
              id="exchange-slippage-input"
              inputMode="decimal"
              onChange={(event) => setDraft(event.currentTarget.value)}
              value={draft}
            />
            <Text as="span" variant="headline" className="shrink-0">
              %
            </Text>
          </div>

          <div className="flex gap-2" role="group" aria-label={t.exchange.slippage}>
            {SLIPPAGE_PRESETS.map((preset) => {
              const active = draftValue === preset
              return (
                <Chip
                  aria-pressed={active}
                  className="h-6 min-w-0 flex-1 px-3"
                  key={preset}
                  onClick={() => setDraft(String(preset))}
                  shape="pill"
                  size="md"
                  tone={active ? 'primary' : 'default'}
                  type="button"
                  variant={active ? 'solid' : 'outlined'}
                >
                  {preset}%
                </Chip>
              )
            })}
          </div>
        </div>

        <Button
          className="min-h-11.5"
          onClick={handleConfirm}
          shape="pill"
          size="md"
          type="button"
          variant="primary"
        >
          {t.common.confirm}
        </Button>
      </div>
    </ResponsiveDialog>
  )
}

export type ExchangeTokenPickerOption = {
  key: string
  symbol: string
  icon?: string
  balanceLabel: string
  /** 列表中可见但不可选（手册未收录 / 延后代币）。 */
  disabled?: boolean
}

/**
 * 卖出 / 买入代币选择
 *
 * 胶囊触发器展示当前选中代币，下拉列表供选择；
 * 未上架代币可见但不可选。
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
        {selected.icon ? (
          <Icon alt="" className="rounded-full" loading="lazy" size="token" src={selected.icon} />
        ) : null}
        <Text as="span" className="leading-none font-semibold" variant="copy">
          {selected.symbol}
        </Text>
        <CollapseChevron open={open} size="md" />
      </DropdownMenuTrigger>

      <DropdownMenuPanel className="min-w-52">
        {options.map((option) => {
          const active = option.key === value
          const optionDisabled = Boolean(option.disabled)
          return (
            <DropdownMenuItem
              disabled={optionDisabled}
              key={option.key}
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
        })}
      </DropdownMenuPanel>
    </DropdownMenu>
  )
}

type ExchangeTokenCarouselKey = 'agx' | 'usd1' | 'x' | 'gagx' | 'gagxStake'

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
) {
  const assets: Record<ExchangeTokenCarouselKey, string> = {
    agx: tokenCarouselIcons.agxIcon,
    usd1: tokenCarouselIcons.usd1Icon,
    x: tokenCarouselIcons.xIcon,
    gagx: tokenCarouselIcons.gagxIcon,
    gagxStake: tokenCarouselIcons.gagxIcon,
  }

  return keys.map((key) => {
    const copy = t.exchange.tokenAbout.items.find((item) => item.key === key)!
    return {
      asset: assets[key],
      body: copy.body,
      key,
      title: copy.title,
    }
  })
}

/**
 * 代币介绍轮播（闪电兑换 / 市价交易 / 销毁 / Turbine 共用）
 *
 * 按传入的卡片键从 i18n 取文案并组装卡片，轮播行为由 Carousel
 * 提供；每张卡片可跳转到代币合约浏览器。
 */
export function TokenAboutCarousel({
  cardKeys = exchangeTokenCardKeys,
}: {
  cardKeys?: readonly ExchangeTokenCarouselKey[]
} = {}) {
  const isDesktop = !useMobileViewport()
  const { messages: t } = useI18n()
  const tokens = getExchangeTokenContent(t, cardKeys)

  return (
    <Carousel
      aria-label={t.exchange.tokenAbout.title}
      autoplayMs={4000}
      className={cn(revealClass(), isDesktop ? 'dapp:mt-0' : 'max-dapp:mt-0')}
      data-reveal
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
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
