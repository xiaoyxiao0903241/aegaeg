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
import { BondPeriodList } from '~/views/dapp/staking/bond/bond-period-list'
import { useBondView } from '~/views/dapp/staking/bond/use-bond-view'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'

export function BondWidget({ kind }: { kind: BondKind }) {
  const {
    t,
    bond,
    copy,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    ctaLabel,
    onSubmit,
    periodLabels,
  } = useBondView(kind)

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => setView('hub')}
        subtitle={copy.intro}
        title={copy.title}
      />
      <DappWidgetStack>
        <BondPeriodList
          ariaLabel={copy.periodAria}
          copy={copy.card}
          discounts={bond.periodDiscounts}
          onChange={bond.setPeriod}
          periodLabel={copy.periodLabel}
          periodLabels={periodLabels}
          value={bond.period}
        />

        <AmountBox
          amountProps={{
            'aria-label': copy.amountAria,
            inputMode: 'decimal',
            onChange: (event) => bond.setAmount(event.target.value),
            placeholder: '0.00',
            value: bond.amountDisplay,
          }}
          endAdornment={
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <DappIcon alt="" size="md" src={dappAssets.tokenUsd1} />
                <Text as="span" className="font-semibold" variant="copy">
                  USD1
                </Text>
              </span>
              <FieldActionChip disabled={!walletReady || bond.isSubmitting} onClick={bond.fillMax}>
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
              label: copy.meta.discount.replace(
                '{pct}',
                bond.discountLabel === '0' || bond.discountLabel === ''
                  ? '0'
                  : bond.discountLabel.replace(/%$/, ''),
              ),
              // Dollar dual-price needs AGX spot × discount; no fake demo $.
              value: '0',
            },
            {
              label: copy.meta.slippage,
              value: bond.isSlippageLoading ? '' : bond.slippageLabel || '0',
            },
            {
              label: copy.meta.pay,
              value: bond.amountDisplay ? `${bond.amountDisplay} USD1` : '0 USD1',
            },
            {
              label: copy.meta.receive,
              value: bond.isPayoutQuoting
                ? ''
                : bond.receiveLabel === '0' || bond.receiveLabel === ''
                  ? '0'
                  : `${bond.receiveLabel} AGX`,
            },
            {
              label: copy.meta.cap,
              value: bond.isMarketLoading ? '' : bond.capLabel || '0',
            },
            {
              label: copy.meta.release,
              value: copy.meta.releaseLinear.replace('{days}', bond.period),
            },
            {
              label: copy.meta.contract,
              value: (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={bscscanAddress(bond.depository)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {formatShortAddress(bond.depository)}
                </a>
              ),
            },
          ]}
        />

        <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
          {copy.footnote}
        </Text>

        {walletReady ? (
          <DappActionRow>
            <DappActionButton
              density="external"
              disabled={!bond.canSubmit && bond.blockReason !== 'notBound'}
              loading={bond.isSubmitting}
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
