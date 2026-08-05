import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { MetaListCard } from '~/app/shell/meta-list-card'
import { formatShortAddress } from '~/shared/api/format-display'
import { AmountBox } from '~/shared/components/amount-box'
import { AmountTokenEnd } from '~/shared/components/amount-token-end'
import { AmountMaxChip } from '~/shared/components/chip'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'
import { bscscanAddress } from '~/shared/config/explorer'
import { useStakeView } from '~/views/dapp/staking/stake/use-stake-view'

/**
 * 质押表单（左栏）
 *
 * 选择质押周期、输入 AGX 数量后提交；
 * 未连接钱包时展示连接引导。
 */
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
            <AmountTokenEnd>
              <AmountTokenEnd.Token iconSrc={dappAssets.tokenAgx} symbol="AGX" />
              <AmountMaxChip disabled={!walletReady || stake.isSubmitting} onClick={stake.fillMax}>
                {t.staking.max}
              </AmountMaxChip>
            </AmountTokenEnd>
          }
          headerOutside
          label={amountLabel}
          sessionReady={sessionReady}
          startAdornment={null}
        />

        <MetaListCard>
          <MetaListCard.Rows
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
        </MetaListCard>

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
