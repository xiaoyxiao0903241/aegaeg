import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { CALC_MAX_DAYS } from '~/core/staking/staking-yield-display'
import { AmountBox, amountBox } from '~/shared/components/amount-box'
import { Card } from '~/shared/components/card'
import { Chip } from '~/shared/components/chip'
import { Icon } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { Text } from '~/shared/components/text'
import { CalcDaySlider } from '~/views/dapp/staking/calc/calc-day-slider'
import { useCalcView } from '~/views/dapp/staking/calc/use-calc-view'

const priceBox = amountBox()

/** 产品 / 周期 Tab 行：用 Chip 拼装，不用 Segment 滑动条 */
function CalcHtabRow({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string
  options: ReadonlyArray<{ label: string; value: string }>
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div aria-label={ariaLabel} className="flex w-full gap-2" role="tablist">
      {options.map((option) => {
        const active = option.value === value
        return (
          <Chip
            aria-selected={active}
            className="min-w-0 flex-1 px-4 font-medium"
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            shape="pill"
            size="md"
            tone={active ? 'coral' : 'default'}
            variant={active ? 'soft' : 'outlined'}
          >
            {option.label}
          </Chip>
        )
      })}
    </div>
  )
}

/**
 * 收益率计算器（左栏表单）
 *
 * 纯本地计算，不发起任何链上写操作；
 * 产品 / 周期 / 金额 / 价格 / 天数变化时实时联动右侧结果。
 */
export function CalcWidget() {
  const vm = useCalcView()
  const { t } = vm
  const tokenSrc =
    vm.tokenSrc === 'gagx'
      ? dappAssets.tokenGagx
      : vm.tokenSrc === 'usd1'
        ? dappAssets.tokenUsd1
        : dappAssets.tokenAgx

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => vm.setView('hub')}
        subtitle={t.staking.calc.intro}
        title={t.staking.calc.title}
      />
      <DappWidgetStack className="gap-4">
        <CalcHtabRow
          ariaLabel={t.staking.calc.productAria}
          onChange={vm.onProductChange}
          options={vm.productOptions}
          value={vm.product}
        />

        <div className="grid gap-2">
          <Text as="span" className="text-foreground/40" variant="copy">
            {t.staking.calc.periodLabel}
          </Text>
          <CalcHtabRow
            ariaLabel={t.staking.calc.periodAria}
            onChange={vm.onPeriodChange}
            options={vm.periodOptions}
            value={vm.period}
          />
        </div>

        <AmountBox
          amountProps={{
            'aria-label': t.staking.calc.amountAria,
            inputMode: 'decimal',
            onChange: (event) => vm.onAmountChange(event.target.value),
            placeholder: '0',
            value: vm.amount,
          }}
          endAdornment={
            <span className="flex items-center gap-1.5">
              <Icon alt="" shape="circle" size="rail" src={tokenSrc} />
              <Text as="span" className="font-semibold" variant="detail">
                {vm.tokenLabel}
              </Text>
            </span>
          }
          headerOutside
          label={t.staking.calc.amountLabel}
          sessionReady
          startAdornment={null}
        />

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Text as="span" className="text-foreground/40" variant="copy">
              {t.staking.calc.price}
            </Text>
            <Text as="span" className="font-semibold text-coral-emphasis" variant="copy">
              {t.staking.calc.priceCurrent.replace('{price}', vm.spotLabel)}
            </Text>
          </div>
          {/* 复用 AmountBox 外部标签样式，价格输入仍用 Input */}
          <Card as="div" className={priceBox.rootOutside()} surface="outlined">
            <div className={priceBox.body()}>
              <Input
                aria-label={t.staking.calc.priceAria}
                className={priceBox.inputOutside()}
                inputMode="decimal"
                onChange={(event) => vm.onPriceChange(event.target.value)}
                value={vm.price}
                variant="amount"
              />
              <Text as="span" className="text-foreground/40" variant="headline">
                $
              </Text>
            </div>
          </Card>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Text as="span" className="text-foreground/40" variant="copy">
              {t.staking.calc.days}
            </Text>
            <Text as="span" className="font-semibold text-coral-emphasis" variant="copy">
              {t.staking.calc.dayBubble.replace('{day}', String(vm.days))}
            </Text>
          </div>
          <CalcDaySlider
            ariaLabel={t.staking.calc.daysAria}
            max={CALC_MAX_DAYS}
            onChange={vm.onDaysChange}
            value={vm.days}
          />
        </div>

        <DappActionRow className="mt-6">
          <DappActionButton
            className="min-h-0 border-0 bg-coral-emphasis py-4 text-base leading-5 text-white"
            density="external"
            type="button"
          >
            {t.staking.calc.submit}
          </DappActionButton>
        </DappActionRow>
      </DappWidgetStack>
    </>
  )
}
