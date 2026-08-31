import { useEffect, useMemo, useRef } from 'react'

import { type CalcProduct } from '~/core/staking/build-calc-estimate'
import { calcSliderMarks } from '~/core/staking/calc-slider-marks'
import { type StakePeriod } from '~/core/staking/staking-period'
import { CALC_MAX_DAYS, CALC_X_START_USD, findBreakEvenDay } from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { AmountBox, amountBox } from '~/shared/components/amount-box'
import { Card } from '~/shared/components/card'
import { FormActions } from '~/shared/components/form-actions'
import { Icon } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { formatNumber } from '~/shared/presenters/format'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { CalcDaySlider, CalcHtabRow } from '~/views/dapp/staking/calc/primitives'
import { useCalcEstimateLive } from '~/views/dapp/staking/calc/use-calc'

const priceBox = amountBox()

function formatSpotPriceDraft(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return ''
  return formatNumber(n, { digits: 2, trimZeros: true }).replace(/,/g, '')
}

/**
 * 收益率计算器（左栏表单）
 *
 * 纯本地计算，不发起任何链上写操作；
 * 表单直订 `useCalcEstimateStore`，点「计算」才刷新右侧结果。
 */
export function CalcDock() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((s) => s.setView)
  const spotUsd = useAgxPriceUsd()
  const s = useCalcEstimateStore()
  const setPrice = useCalcEstimateStore((st) => st.setPrice)
  const setSpotUsd = useCalcEstimateStore((st) => st.setSpotUsd)
  const setDays = useCalcEstimateStore((st) => st.setDays)
  useCalcEstimateLive()
  /** 每种产品只自动灌一次到期价；用户清空后不再写回。 */
  const filledPriceForProduct = useRef<CalcProduct | null>(null)

  useEffect(() => {
    setSpotUsd(spotUsd != null && spotUsd > 0 ? spotUsd : null)
  }, [setSpotUsd, spotUsd])

  useEffect(() => {
    if (s.product === 'xmine') {
      filledPriceForProduct.current = 'xmine'
      return
    }
    if (filledPriceForProduct.current === s.product) return
    if (spotUsd == null || !(spotUsd > 0)) return
    filledPriceForProduct.current = s.product
    if (s.price.trim() !== '') return
    setPrice(formatSpotPriceDraft(spotUsd))
  }, [s.price, s.product, setPrice, spotUsd])

  const productOptions: ReadonlyArray<{ label: string; value: CalcProduct }> = [
    { label: t.staking.calc.products.stake, value: 'stake' },
    { label: t.staking.calc.products.lpbond, value: 'lpbond' },
    { label: t.staking.calc.products.burnbond, value: 'burnbond' },
    { label: t.staking.calc.products.xmine, value: 'xmine' },
  ]
  const periodOptions: ReadonlyArray<{ label: string; value: StakePeriod }> =
    s.product === 'stake'
      ? [
          { label: t.staking.stake.periods.liquid, value: 'liquid' },
          { label: t.staking.stake.periods.d180, value: '180' },
          { label: t.staking.stake.periods.d360, value: '360' },
          { label: t.staking.stake.periods.d540, value: '540' },
        ]
      : s.product === 'xmine'
        ? [{ label: t.staking.stake.periods.liquid, value: 'liquid' }]
        : [
            { label: t.staking.stake.periods.d180, value: '180' },
            { label: t.staking.stake.periods.d360, value: '360' },
            { label: t.staking.stake.periods.d540, value: '540' },
          ]
  const tokenLabel = s.product === 'xmine' ? 'gAGX' : s.product === 'stake' ? 'AGX' : 'USD1'
  const tokenSrc =
    s.product === 'xmine'
      ? dappAssets.tokenGagx
      : s.product === 'stake'
        ? dappAssets.tokenAgx
        : dappAssets.tokenUsd1
  const spotLabel =
    s.product === 'xmine'
      ? formatNumber(CALC_X_START_USD, { digits: 2, prefix: '$' })
      : spotUsd != null
        ? formatNumber(spotUsd, { digits: 2, prefix: '$' })
        : formatNumber(0, { digits: 2, prefix: '$' })
  const amountN = Number.parseFloat(s.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(s.price.replace(/,/g, '')) || 0
  const ratesOk =
    s.product === 'xmine'
      ? s.rates?.xmineDailyPct != null
      : s.rates?.epochRebasePct != null &&
        s.rates?.epochsPerDay != null &&
        (s.product === 'lpbond' || s.product === 'burnbond'
          ? s.rates.discountRateBP != null && s.rates.discountRateBP > 0
          : true)
  const spotReady = s.spotUsd != null && s.spotUsd > 0
  const canCommit = amountN > 0 && priceN > 0 && ratesOk && spotReady

  const breakEvenDay = useMemo(() => {
    if (!ratesOk || !spotReady || priceN <= 0) return null
    return findBreakEvenDay({
      product: s.product,
      period: s.period,
      amount: amountN > 0 ? amountN : 1,
      pd: priceN,
      spotUsd: s.spotUsd ?? 0,
      epochRebasePct: s.rates?.epochRebasePct ?? null,
      epochsPerDay: s.rates?.epochsPerDay ?? null,
      xmineDailyPct: s.product === 'xmine' ? (s.rates?.xmineDailyPct ?? null) : null,
      discountRateBP:
        s.product === 'lpbond' || s.product === 'burnbond'
          ? (s.rates?.discountRateBP ?? null)
          : null,
      horizonDays: CALC_MAX_DAYS,
      maxDays: CALC_MAX_DAYS,
    })
  }, [
    amountN,
    priceN,
    ratesOk,
    s.period,
    s.product,
    s.rates?.discountRateBP,
    s.rates?.epochRebasePct,
    s.rates?.epochsPerDay,
    s.rates?.xmineDailyPct,
    s.spotUsd,
    spotReady,
  ])
  const marks = calcSliderMarks({ period: s.period, breakEvenDay })

  return (
    <TabHeader
      backText={t.staking.backToHub}
      onBack={() => setView('hub')}
      subtitle={t.staking.calc.intro}
      title={t.staking.calc.title}
    >
      <DockStack className="gap-4">
        <CalcHtabRow
          ariaLabel={t.staking.calc.productAria}
          onChange={s.setProduct}
          options={productOptions}
          value={s.product}
        />

        <div className="grid gap-2">
          <Text as="span" className="text-foreground/40" variant="copy">
            {t.staking.calc.periodLabel}
          </Text>
          <CalcHtabRow
            ariaLabel={t.staking.calc.periodAria}
            onChange={s.setPeriod}
            options={periodOptions}
            value={s.period}
          />
        </div>

        <AmountBox
          amountProps={{
            'aria-label': t.staking.calc.amountAria,
            inputMode: 'decimal',
            onChange: (event) => s.setAmount(event.target.value),
            placeholder: '0',
            value: s.amount,
          }}
          endAdornment={
            <span className="flex items-center gap-1.5">
              <Icon alt="" shape="circle" size="rail" src={tokenSrc} />
              <Text as="span" className="font-semibold" variant="detail">
                {tokenLabel}
              </Text>
            </span>
          }
          headerOutside
          label={
            s.product === 'lpbond' || s.product === 'burnbond'
              ? t.staking.calc.amountBuy
              : t.staking.calc.amountLabel
          }
          sessionReady
          startAdornment={null}
        />

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Text as="span" className="text-foreground/40" variant="copy">
              {s.product === 'xmine' ? t.staking.calc.priceX : t.staking.calc.price}
            </Text>
            <Text as="span" className="font-semibold text-coral-emphasis" variant="copy">
              {interpolate(t.staking.calc.priceCurrent, { price: spotLabel })}
            </Text>
          </div>
          {/* 复用 AmountBox 外部标签样式，价格输入仍用 Input */}
          <Card as="div" className={priceBox.rootOutside()} surface="outlined">
            <div className={priceBox.body()}>
              <Input
                aria-label={t.staking.calc.priceAria}
                className={priceBox.inputOutside()}
                inputMode="decimal"
                onChange={(event) => s.setPrice(event.target.value)}
                value={s.price}
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
              {interpolate(t.staking.calc.dayBubble, { day: s.days })}
            </Text>
          </div>
          <CalcDaySlider
            ariaLabel={t.staking.calc.daysAria}
            breakEvenDay={marks.breakEvenDay}
            breakEvenLabel={t.staking.calc.sliderBreakEven}
            maturityDay={marks.maturityDay}
            maturityLabel={
              marks.maturityDay != null
                ? interpolate(t.staking.calc.sliderMaturity, { days: marks.maturityDay })
                : ''
            }
            max={marks.maxDay}
            onChange={setDays}
            value={s.days}
          />
        </div>

        <FormActions>
          <MainButton
            density="external"
            disabled={!canCommit}
            onClick={() => s.commit()}
            type="button"
          >
            {t.staking.calc.submit}
          </MainButton>
        </FormActions>
      </DockStack>
    </TabHeader>
  )
}
