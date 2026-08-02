import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { formatShortAddress } from '~/shared/api/format-display'
import { bscscanAddress } from '~/shared/config/explorer'
import { AmountBox } from '~/shared/ui/amount-box'
import { AmountMaxChip } from '~/shared/ui/chip'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useStakeView } from '~/views/dapp/staking/stake/use-stake-view'

export function StakeWidget() {
  const {
    t,
    stake,
    sessionReady,
    walletReady,
    setView,
    periodOptions,
    lockLabel,
    amountLabel,
    ctaLabel,
    yieldMeta,
    onSubmit,
  } = useStakeView()

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => setView('hub')}
        subtitle={t.staking.stake.intro}
        title={t.staking.stake.title}
      />
      <DappWidgetStack>
        <div className="grid gap-2.5">
          <Text as="span" className="text-foreground/40" variant="copy">
            {t.staking.stake.periodLabel}
          </Text>
          <Segment
            aria-label={t.staking.stake.periodAria}
            onChange={stake.setPeriod}
            options={periodOptions}
            size="md"
            tone="coral"
            value={stake.period}
          />
        </div>

        <AmountBox
          amountProps={{
            'aria-label': t.staking.stake.amountAria,
            inputMode: 'decimal',
            onChange: (event) => stake.setAmount(event.target.value),
            placeholder: '0.00',
            value: stake.amountDisplay,
          }}
          endAdornment={
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <DappIcon alt="" shape="circle" size="rail" src={dappAssets.tokenAgx} />
                <Text as="span" className="font-semibold" variant="detail">
                  AGX
                </Text>
              </span>
              <AmountMaxChip disabled={!walletReady || stake.isSubmitting} onClick={stake.fillMax}>
                {t.staking.max}
              </AmountMaxChip>
            </span>
          }
          headerOutside
          label={amountLabel}
          sessionReady={sessionReady}
          startAdornment={null}
        />

        <DappMetaPanel
          className="mt-0 gap-3 p-4"
          items={[
            { label: t.staking.stake.meta.baseDaily, value: yieldMeta.baseDaily },
            {
              label: t.staking.stake.meta.periodYield,
              value: yieldMeta.periodYield,
              valueClassName: 'text-coral-emphasis',
            },
            { label: t.staking.stake.meta.bonus, value: yieldMeta.bonus },
            { label: t.staking.stake.meta.lock, value: lockLabel },
            {
              label: t.staking.stake.meta.contract,
              value: (
                <a href={bscscanAddress(stake.pool)} rel="noreferrer" target="_blank">
                  {formatShortAddress(stake.pool)}
                </a>
              ),
              valueClassName: 'text-coral-emphasis',
            },
          ]}
        />

        {walletReady ? (
          <DappActionRow>
            <DappActionButton
              density="external"
              disabled={!stake.canSubmit && stake.blockReason !== 'notBound'}
              loading={stake.isSubmitting}
              onClick={() => void onSubmit()}
            >
              {ctaLabel}
            </DappActionButton>
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
