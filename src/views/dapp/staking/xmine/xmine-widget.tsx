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
import { Text } from '~/shared/components/text'
import { bscscanAddress } from '~/shared/config/explorer'
import { useXmineView } from '~/views/dapp/staking/xmine/use-xmine-view'

/**
 * Xmine 质押表单（左栏）
 *
 * 输入 gAGX 数量后提交挖矿质押；
 * 未连接钱包时展示连接引导。
 */
export function XmineWidget() {
  const { t, xmine, sessionReady, walletReady, setView, amountLabel, dailyYieldLabel, onSubmit } =
    useXmineView()

  const quotaBalance = (
    <Text as="span" className="font-semibold text-coral-emphasis" variant="copy">
      {t.staking.xmine.quotaInline.replace('{quota}', xmine.quotaLabel)}
    </Text>
  )

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => setView('hub')}
        subtitle={t.staking.xmine.intro}
        title={t.staking.xmine.title}
      />
      <DappWidgetStack>
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

        <MetaListCard>
          <MetaListCard.Rows
            items={[
              {
                label: t.staking.xmine.meta.daily,
                value: dailyYieldLabel,
                valueClassName: 'text-coral-emphasis',
              },
              {
                label: t.staking.xmine.meta.max,
                value: xmine.quotaLabel === '0' ? '0.00 gAGX' : `${xmine.quotaLabel} gAGX`,
              },
              {
                label: t.staking.xmine.meta.lock,
                value: t.staking.xmine.meta.lockValue,
              },
              {
                label: t.staking.xmine.meta.contract,
                value: (
                  <a href={bscscanAddress(xmine.pool)} rel="noreferrer" target="_blank">
                    {formatShortAddress(xmine.pool)}
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
              disabled={!xmine.canSubmit}
              loading={xmine.isSubmitting}
              onClick={() => void onSubmit()}
            >
              {t.staking.xmine.submit}
            </DappActionButton>
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
