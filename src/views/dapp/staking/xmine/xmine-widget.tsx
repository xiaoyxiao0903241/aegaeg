import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { formatShortAddress } from '~/shared/api/format-display'
import { AmountBox } from '~/shared/components/amount-box'
import { AmountMaxChip } from '~/shared/components/chip'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { bscscanAddress } from '~/shared/config/explorer'
import { useXmineView } from '~/views/dapp/staking/xmine/use-xmine-view'

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
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <Icon alt="" shape="circle" size="rail" src={dappAssets.tokenGagx} />
                <Text as="span" className="font-semibold" variant="detail">
                  gAGX
                </Text>
              </span>
              <AmountMaxChip disabled={!walletReady || xmine.isSubmitting} onClick={xmine.fillMax}>
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
