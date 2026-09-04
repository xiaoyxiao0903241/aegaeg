import { useEffect, useMemo, useRef } from 'react'

import { type CalcProduct } from '~/core/staking/build-calc-estimate'
import { calcSliderMarks } from '~/core/staking/calc-slider-marks'
import { type StakePeriod } from '~/core/staking/staking-period'
import { CALC_MAX_DAYS, findBreakEvenDay } from '~/core/staking/staking-yield'
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
import { isXmineSubviewClosed } from '~/shared/config/dapp-deep-links'
import { formatDecimal } from '~/shared/presenters/format'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { CalcDaySlider, CalcHtabRow } from '~/views/dapp/staking/calc/primitives'
import { useCalcEstimateLive } from '~/views/dapp/staking/calc/use-calc'
import { useXmineOverviewQuery } from '~/web3/staking/use-staking-queries'
import { xUsdFromAgxSpot } from '~/web3/staking/xmine-overview-read'

const priceBox = amountBox()

function formatSpotPriceDraft(n: number, digits = 2): string {
  if (!Number.isFinite(n) || n <= 0) return ''
  return formatDecimal(n, { digits, fraction: 'natural' }).replace(/,/g, '')
}

function CalcExitPriceField({
  ariaLabel,
  current,
  label,
  onChange,
  value,
}: {
  ariaLabel: string
  current: string
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <Text as="span" className="text-foreground/40" variant="copy">
          {label}
        </Text>
        <Text as="span" className="font-semibold text-coral-emphasis" variant="copy">
          {current}
        </Text>
      </div>
      <Card as="div" className={priceBox.rootOutside()} surface="outlined">
        <div className={priceBox.body()}>
          <Input
            aria-label={ariaLabel}
            className={priceBox.inputOutside()}
            inputMode="decimal"
            onChange={(event) => onChange(event.target.value)}
            value={value}
            variant="amount"
          />
          <Text as="span" className="text-foreground/40" variant="headline">
            $
          </Text>
        </div>
      </Card>
    </div>
  )
}

/**
 * 收益率计算器（左栏表单）
 *
 * 纯本地计算，不发起任何链上写操作；
 * 表单直订 `useCalcEstimateStore`，点「计算」才刷新右侧结果。
 * X 挖矿暂时关闭时不展示该项。
 */
export function CalcDock() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((s) => s.setView)
  const spotUsd = useAgxPriceUsd()
  const s = useCalcEstimateStore()
  const setPrice = useCalcEstimateStore((st) => st.setPrice)
  const setPriceX = useCalcEstimateStore((st) => st.setPriceX)
  const setSpotUsd = useCalcEstimateStore((st) => st.setSpotUsd)
  const setSpotXUsd = useCalcEstimateStore((st) => st.setSpotXUsd)
  const setDays = useCalcEstimateStore((st) => st.setDays)
  useCalcEstimateLive()
  const xmineOverview = useXmineOverviewQuery({ enabled: s.product === 'xmine' })
  const spotXUsd =
    s.product === 'xmine' && spotUsd != null && xmineOverview.data != null
      ? xUsdFromAgxSpot(spotUsd, xmineOverview.data.xPerAgx)
      : null
  /** 每种产品只自动灌一次到期价；用户清空后不再写回。 */
  const filledPriceForProduct = useRef<CalcProduct | null>(null)
  const filledPriceXForProduct = useRef<CalcProduct | null>(null)

  useEffect(() => {
    setSpotUsd(spotUsd != null && spotUsd > 0 ? spotUsd : null)
  }, [setSpotUsd, spotUsd])

  useEffect(() => {
    setSpotXUsd(spotXUsd != null && spotXUsd > 0 ? spotXUsd : null)
  }, [setSpotXUsd, spotXUsd])

  useEffect(() => {
    if (filledPriceForProduct.current === s.product) return
    if (spotUsd == null || !(spotUsd > 0)) return
    filledPriceForProduct.current = s.product
    if (s.price.trim() !== '') return
    setPrice(formatSpotPriceDraft(spotUsd))
  }, [s.price, s.product, setPrice, spotUsd])

  useEffect(() => {
    if (s.product !== 'xmine') return
    if (filledPriceXForProduct.current === s.product) return
    if (spotXUsd == null || !(spotXUsd > 0)) return
    filledPriceXForProduct.current = s.product
    if (s.priceX.trim() !== '') return
    setPriceX(formatSpotPriceDraft(spotXUsd, 6))
  }, [s.priceX, s.product, setPriceX, spotXUsd])

  useEffect(() => {
    if (!isXmineSubviewClosed('xmine')) return
    const state = useCalcEstimateStore.getState()
    if (state.product === 'xmine') state.setProduct('stake')
    if (useCalcEstimateStore.getState().result?.product === 'xmine') {
      useCalcEstimateStore.setState({ result: null })
    }
  }, [s.product])

  const allProductOptions: ReadonlyArray<{ label: string; value: CalcProduct }> = [
    { label: t.staking.calc.products.stake, value: 'stake' },
    { label: t.staking.calc.products.lpbond, value: 'lpbond' },
    { label: t.staking.calc.products.burnbond, value: 'burnbond' },
    { label: t.staking.calc.products.xmine, value: 'xmine' },
  ]
  const productOptions = allProductOptions.filter((option) => !isXmineSubviewClosed(option.value))
  const periodOptions: ReadonlyArray<{ label: string; value: StakePeriod }> =
    s.product === 'stake'
      ? [
          { label: t.staking.stake.periods.liquid, value: 'liquid' },
          { label: t.staking.stake.periods.d180, value: '180' },
          { label: t.staking.stake.periods.d360, value: '360' },
          { label: t.staking.stake.periods.d540, value: '540' },
        ]
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
  const spotLabel = formatDecimal(spotUsd, { digits: 2, prefix: '$' })
  const spotXLabel = formatDecimal(spotXUsd, { digits: 4, prefix: '$' })
  const amountN = Number.parseFloat(s.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(s.price.replace(/,/g, '')) || 0
  const priceXN = Number.parseFloat(s.priceX.replace(/,/g, '')) || 0
  const ratesOk =
    s.product === 'xmine'
      ? s.rates?.yieldRateBP != null && s.rates.yieldRateBP >= 0
      : s.rates?.epochRebasePct != null &&
        s.rates?.epochsPerDay != null &&
        (s.product === 'lpbond' || s.product === 'burnbond'
          ? s.rates.discountRateBP != null && s.rates.discountRateBP > 0
          : true)
  const spotReady = s.spotUsd != null && s.spotUsd > 0
  const spotXReady = s.product !== 'xmine' || (s.spotXUsd != null && s.spotXUsd > 0)
  const canCommit =
    amountN > 0 &&
    priceN > 0 &&
    ratesOk &&
    spotReady &&
    spotXReady &&
    (s.product !== 'xmine' || priceXN > 0)

  const breakEvenDay = useMemo(() => {
    if (!ratesOk || !spotReady || priceN <= 0) return null
    if (s.product === 'xmine' && (!(priceXN > 0) || !spotXReady)) return null
    return findBreakEvenDay({
      product: s.product,
      period: s.period,
      amount: amountN > 0 ? amountN : 1,
      pd: priceN,
      pdX: s.product === 'xmine' ? priceXN : null,
      spotUsd: s.spotUsd ?? 0,
      spotXUsd: s.product === 'xmine' ? s.spotXUsd : null,
      horizonDays: s.days,
      epochRebasePct: s.rates?.epochRebasePct ?? null,
      epochsPerDay: s.rates?.epochsPerDay ?? null,
      discountRateBP:
        s.product === 'lpbond' || s.product === 'burnbond'
          ? (s.rates?.discountRateBP ?? null)
          : null,
      yieldRateBP: s.product === 'xmine' ? (s.rates?.yieldRateBP ?? null) : null,
      maxDays: CALC_MAX_DAYS,
    })
  }, [
    amountN,
    priceN,
    priceXN,
    ratesOk,
    s.period,
    s.product,
    s.rates?.discountRateBP,
    s.rates?.epochRebasePct,
    s.rates?.epochsPerDay,
    s.rates?.yieldRateBP,
    s.spotUsd,
    s.spotXUsd,
    s.days,
    spotReady,
    spotXReady,
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

        {s.product === 'xmine' ? null : (
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
        )}

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

        <CalcExitPriceField
          ariaLabel={t.staking.calc.priceAria}
          current={interpolate(t.staking.calc.priceCurrent, { price: spotLabel })}
          label={t.staking.calc.price}
          onChange={s.setPrice}
          value={s.price}
        />

        {s.product === 'xmine' ? (
          <CalcExitPriceField
            ariaLabel={t.staking.calc.priceXAria}
            current={interpolate(t.staking.calc.priceCurrent, { price: spotXLabel })}
            label={t.staking.calc.priceX}
            onChange={setPriceX}
            value={s.priceX}
          />
        ) : null}

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
