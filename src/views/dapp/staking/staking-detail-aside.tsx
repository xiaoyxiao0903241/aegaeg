import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { Text } from '~/shared/ui/text'
import { useDappShellStore } from '~/stores/dapp-shell-store'

/** Right-rail shared buckets for stake / bond / xmine — positions deep-link to assets. */
export function StakingDetailAside({
  overviewItems,
  mechanism,
  faq,
}: {
  overviewItems: Array<{ label: string; value: string }>
  mechanism: string
  faq: Array<{ q: string; a: string }>
}) {
  const { messages: t } = useI18n()
  const selectTab = useDappShellStore((state) => state.selectTab)

  return (
    <>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.overview}</DappContentHeading>
        <ul className="m-0 grid list-none gap-2 p-0">
          {overviewItems.map((item) => (
            <li className="flex items-center justify-between gap-3" key={item.label}>
              <Text as="span" tone="muted-foreground" variant="detail">
                {item.label}
              </Text>
              <Text as="strong" className="font-semibold" variant="detail">
                {item.value}
              </Text>
            </li>
          ))}
        </ul>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.positions}</DappContentHeading>
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {t.staking.aside.positionsHint}
        </Text>
        <DappActionButton
          className="mt-3 w-full"
          density="card"
          onClick={() => selectTab('assets')}
          type="button"
          variant="secondary"
        >
          {t.staking.aside.viewPositions}
        </DappActionButton>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.mechanism}</DappContentHeading>
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {mechanism}
        </Text>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.faq}</DappContentHeading>
        <ul className="m-0 grid list-none gap-3 p-0">
          {faq.map((item) => (
            <li key={item.q}>
              <Text as="p" className="m-0 font-medium" variant="copy">
                {item.q}
              </Text>
              <Text as="p" className="mt-1 mb-0" tone="muted-foreground" variant="detail">
                {item.a}
              </Text>
            </li>
          ))}
        </ul>
      </DappDetailBlock>
    </>
  )
}
