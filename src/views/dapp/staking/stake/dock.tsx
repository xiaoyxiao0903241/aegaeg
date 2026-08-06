import { dappAssets } from '~/shared/assets/dapp'
import { AmountBox } from '~/shared/components/amount-box'
import { AmountTokenEnd } from '~/shared/components/amount-token-end'
import { AmountMaxChip } from '~/shared/components/chip'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { MainButton } from '~/shared/components/main-button'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { useStakeDock } from '~/views/dapp/staking/stake/use-stake'

/**
 * 质押表单（左栏）
 *
 * 选择质押周期、输入 AGX 数量后提交；
 * 未连接钱包时展示连接引导。
 */
export function StakeDock() {
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
  } = useStakeDock()

  return (
    <TabHeader
      backText={t.staking.backToHub}
      onBack={() => setView('hub')}
      subtitle={t.staking.stake.intro}
      title={t.staking.stake.title}
    >
      <DockStack>
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

        <FormInfoCard>
          <FormInfoCard.Rows
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
                value: <ExplorerLink value={stake.pool} />,
                valueClassName: 'text-coral-emphasis',
              },
            ]}
          />
        </FormInfoCard>

        {/* jscpd:ignore-start — Dock CTA / 连钱包页内拼装，禁再抽薄壳 */}
        {walletReady ? (
          <FormActions>
            <MainButton
              density="external"
              disabled={!stake.canSubmit && stake.blockReason !== 'notBound'}
              loading={stake.isSubmitting}
              onClick={() => void onSubmit()}
            >
              {ctaLabel}
            </MainButton>
          </FormActions>
        ) : (
          <DockConnectPromo />
        )}
        {/* jscpd:ignore-end */}
      </DockStack>
    </TabHeader>
  )
}
