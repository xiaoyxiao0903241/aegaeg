import { dappAssets } from '~/shared/assets/dapp'
import { AmountBox } from '~/shared/components/amount-box'
import { AmountTokenEnd } from '~/shared/components/amount-token-end'
import { AmountMaxChip } from '~/shared/components/chip'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { interpolateLive } from '~/shared/presenters/format'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { SessionButton } from '~/views/dapp/shared/session-button'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { WriteBlockAlert } from '~/views/dapp/shared/write-block-alert'
import { useXmineDock } from '~/views/dapp/staking/xmine/use-xmine'

/**
 * Xmine 质押表单（左栏）
 *
 * 输入 gAGX 数量后提交挖矿质押；
 * 未连接钱包时展示连接引导。
 */
export function XmineDock() {
  const {
    t,
    xmine,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    dailyYieldLabel,
    blockHint,
    onSubmit,
  } = useXmineDock()

  const quotaBalance = (
    <Text as="span" className="font-semibold text-coral-emphasis" variant="copy">
      {interpolateLive(t.staking.xmine.quotaInline, { quota: xmine.quotaLabel })}
    </Text>
  )

  return (
    <TabHeader
      backText={t.staking.backToHub}
      onBack={() => setView('hub')}
      subtitle={t.staking.xmine.intro}
      title={t.staking.xmine.title}
    >
      <DockStack>
        <AmountBox
          amountProps={{
            'aria-label': t.staking.xmine.amountAria,
            inputMode: 'decimal',
            onChange: (event) => xmine.setAmount(event.target.value),
            placeholder: '0.00',
            value: xmine.amountDisplay,
          }}
          balance={quotaBalance}
          endAdornment={
            <AmountTokenEnd>
              <AmountTokenEnd.Token iconSrc={dappAssets.tokenGagx} symbol="gAGX" />
              <AmountMaxChip disabled={!walletReady || xmine.isSubmitting} onClick={xmine.fillMax}>
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
              {
                label: t.staking.xmine.meta.daily,
                value: dailyYieldLabel,
                valueClassName: 'text-coral-emphasis',
              },
              {
                // 该行 Label 已自带样式，内层勿再套 Text variant/tone
                label: (
                  <span className="inline-flex items-center gap-1">
                    {t.staking.xmine.meta.max}
                    <Tooltip.Info content={t.staking.xmine.meta.maxHint} />
                  </span>
                ),
                value: xmine.quotaLabel,
              },
              {
                label: t.staking.xmine.meta.lock,
                value: t.staking.xmine.meta.lockValue,
              },
              {
                label: t.staking.xmine.meta.contract,
                value: <ExplorerLink value={xmine.pool} />,
                valueClassName: 'text-coral-emphasis',
              },
            ]}
          />
        </FormInfoCard>

        {/* jscpd:ignore-start — Dock CTA / 连钱包页内拼装，禁再抽薄壳 */}
        {walletReady ? (
          <>
            <WriteBlockAlert hint={blockHint} />
            <FormActions>
              <SessionButton
                density="external"
                disabled={!xmine.canSubmit}
                loading={xmine.isSubmitting}
                onClick={() => void onSubmit()}
              >
                {t.staking.xmine.submit}
              </SessionButton>
            </FormActions>
          </>
        ) : (
          <DockConnectPromo />
        )}
        {/* jscpd:ignore-end */}
      </DockStack>
    </TabHeader>
  )
}
