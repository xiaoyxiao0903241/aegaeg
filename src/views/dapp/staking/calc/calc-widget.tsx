import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { CALC_MAX_DAYS } from '~/core/staking/staking-yield-display'
import { AmountBox } from '~/shared/ui/amount-box'
import { Card } from '~/shared/ui/card'
import { Chip } from '~/shared/ui/chip'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { CalcDaySlider } from '~/views/dapp/staking/calc/calc-day-slider'
import { useCalcView } from '~/views/dapp/staking/calc/use-calc-view'

/** Figma calc `ptabs`/`perRow` 4462:600 — htab Chip h-28，≠ Segment 滑动轨. */
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
            className="h-7 min-w-0 flex-1 px-4 font-medium"
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

/** Local-only calculator — zero chain writes; left inputs live-sync right rail. */
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
      <DappWidgetStack>
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
              <DappIcon alt="" className="size-[1.375rem]" src={tokenSrc} />
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
          <Card
            as="div"
            className="flex min-h-[53px] items-center justify-between gap-3 px-4 py-3 focus-within:border-coral"
            surface="outlined"
          >
            <Input
              aria-label={t.staking.calc.priceAria}
              className="mr-auto max-w-[70%] text-left text-[24px] leading-[29px]"
              inputMode="decimal"
              onChange={(event) => vm.onPriceChange(event.target.value)}
              value={vm.price}
              variant="amount"
            />
            <Text as="span" className="text-foreground/40" variant="headline">
              $
            </Text>
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

        {/* Figma `bigBtn` 4462:641 — coral fill；form→CTA 疏离（稿 gap-24） */}
        <DappActionRow className="mt-6">
          <DappActionButton
            className="bg-coral-emphasis text-white"
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
