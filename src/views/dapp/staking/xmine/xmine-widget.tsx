import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { AmountBox } from '~/shared/ui/amount-box'
import { FieldActionChip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { formatShortAddress } from '~/shared/api/format-display'
import { bscscanAddress } from '~/shared/config/explorer'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useXmineView } from '~/views/dapp/staking/xmine/use-xmine-view'

export function XmineWidget() {
  const { t, xmine, sessionReady, walletReady, setView, amountLabel, onSubmit } = useXmineView()

  const quotaBalance = (
    <Text as="span" className="font-semibold text-primary" variant="support">
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
                <DappIcon alt="" size="md" src={dappAssets.tokenGagx} />
                <Text as="span" className="font-semibold" variant="copy">
                  gAGX
                </Text>
              </span>
              <FieldActionChip
                disabled={!walletReady || xmine.isSubmitting}
                onClick={xmine.fillMax}
              >
                {t.staking.max}
              </FieldActionChip>
            </span>
          }
          inputClassName="!ml-0 mr-auto max-w-[50%] text-left"
          label={amountLabel}
          sessionReady={sessionReady}
          startAdornment={null}
        />

        <DappMetaPanel
          className="gap-3 p-4"
          items={[
            {
              label: t.staking.xmine.meta.daily,
              value: '—',
              valueClassName: 'text-primary',
            },
            {
              label: t.staking.xmine.meta.max,
              value: xmine.quotaLabel === '—' ? '—' : `${xmine.quotaLabel} gAGX`,
            },
            {
              label: t.staking.xmine.meta.lock,
              value: t.staking.xmine.meta.lockValue,
            },
            {
              label: t.staking.xmine.meta.contract,
              value: (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={bscscanAddress(xmine.pool)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {formatShortAddress(xmine.pool)}
                </a>
              ),
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
