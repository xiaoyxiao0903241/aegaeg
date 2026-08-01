import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { AmountBox } from '~/shared/ui/amount-box'
import { Input } from '~/shared/ui/input'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useCalcView } from '~/views/dapp/staking/calc/use-calc-view'

/** Local-only calculator — zero chain writes. */
export function CalcWidget() {
  const vm = useCalcView()
  const { t } = vm

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => vm.setView('hub')}
        subtitle={t.staking.calc.intro}
        title={t.staking.calc.title}
      />
      <DappWidgetStack>
        <Segment
          aria-label={t.staking.calc.productAria}
          onChange={vm.onProductChange}
          options={vm.productOptions}
          size="md"
          tone="coral"
          value={vm.product}
        />

        <div className="grid gap-2">
          <Text as="span" tone="muted-foreground" variant="detail">
            {t.staking.calc.periodLabel}
          </Text>
          <Segment
            aria-label={t.staking.calc.periodAria}
            onChange={vm.onPeriodChange}
            options={vm.periodOptions}
            size="md"
            tone="coral"
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
          label={t.staking.calc.amountLabel}
          sessionReady
          startAdornment={
            <Text as="span" className="font-semibold" variant="copy">
              {vm.tokenLabel}
            </Text>
          }
        />

        <label className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Text as="span" tone="muted-foreground" variant="support">
              {t.staking.calc.price}
            </Text>
            <Text as="span" className="font-semibold text-primary" variant="support">
              {t.staking.calc.priceCurrent.replace('{price}', vm.price || '0')}
            </Text>
          </div>
          <Input
            aria-label={t.staking.calc.priceAria}
            inputMode="decimal"
            onChange={(event) => vm.onPriceChange(event.target.value)}
            value={vm.price}
          />
        </label>

        <label className="grid gap-2">
          <Text as="span" tone="muted-foreground" variant="support">
            {t.staking.calc.days}
          </Text>
          <div className="grid gap-1">
            <Text as="span" className="text-center font-semibold text-primary" variant="detail">
              {t.staking.calc.dayBubble.replace('{day}', String(vm.days))}
            </Text>
            <input
              aria-label={t.staking.calc.daysAria}
              className="w-full accent-primary"
              max={730}
              min={1}
              onChange={(event) => vm.onDaysChange(Number(event.target.value))}
              type="range"
              value={vm.days}
            />
          </div>
        </label>

        <DappActionRow>
          <DappActionButton density="external" onClick={vm.onCalculate}>
            {t.staking.calc.submit}
          </DappActionButton>
        </DappActionRow>
      </DappWidgetStack>
    </>
  )
}
