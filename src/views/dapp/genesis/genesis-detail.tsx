/**
 * 创世详情页
 *
 * 依次为全球认购进度、我的贡献表与常见问题三个区块；
 * 全部数据由会话宿主传入的 GenesisWidgetState 提供。
 */
import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { applyMessageTemplate } from '~/shared/lib/apply-message-template'
import { GenesisContributionsTable } from '~/views/dapp/genesis/genesis-contributions-table'
import { genesisFaqTemplateValues } from '~/views/dapp/genesis/genesis-faq'
import { GenesisGlobalCard } from '~/views/dapp/genesis/genesis-global-card'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { useGenesisContributionsView } from '~/views/dapp/genesis/use-genesis-contributions-view'

function openPreSaleContract() {
  window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
}

export function GenesisDetail({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const contributions = useGenesisContributionsView(genesis)

  const genesisFaqValues = genesisFaqTemplateValues(
    genesis.phases,
    genesis.airdropThresholdUsd,
    genesis.isLoading && genesis.phases.length === 0,
  )

  const genesisFaqItems = t.genesis.faq.items.map((item) => ({
    q: item.q,
    a: applyMessageTemplate(item.a, genesisFaqValues),
  }))

  return (
    <Detail>
      <Section>
        <GenesisGlobalCard
          body={t.genesis.globalBody}
          contractLabel={t.genesis.viewContract}
          kicker={t.genesis.globalLabel}
          onViewContract={openPreSaleContract}
          value={`$${genesis.globalPurchasedLabel}`}
        />
      </Section>
      <Section reveal>
        <Section.Title>{t.genesis.myContributions}</Section.Title>
        <GenesisContributionsTable
          connectBody={t.dapp.connect.recordsBodyGenesis}
          connectTitle={t.dapp.connect.recordsTitle}
          cumulativeLabel={t.genesis.cumulativeContributed}
          syncPendingLabel={t.genesis.contributionsSyncPending}
          totalContributedLabel={t.genesis.totalContributed}
          vm={contributions}
        />
      </Section>
      <Section collapsible>
        <Section.Title>{t.genesis.faq.title}</Section.Title>
        <Faq items={genesisFaqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
