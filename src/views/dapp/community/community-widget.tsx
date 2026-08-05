import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { QuickLinks } from '~/app/shell/quick-links'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import { communityQuickLinkItems } from '~/shared/config/community-links'
import {
  CommunityReferralLinkCard,
  CommunityReferrerBindCard,
  CommunityReferrerBoundPanel,
} from '~/views/dapp/community/community-widget-primitives'
import { useCommunityConnectedView } from '~/views/dapp/community/use-community-connected-view'

/**
 * 社区侧栏组件
 *
 * 绑定推荐关系是链上操作，需要已连接钱包；
 * 成员表格与业绩数据仍留在正文中按登录会话态展示。
 */
export function CommunityWidget() {
  const { walletReady } = useDappShell()
  return walletReady ? <CommunityConnectedWidget /> : <CommunityDisconnectedWidget />
}

function CommunityConnectedWidget() {
  const {
    t,
    account,
    referral,
    referralLink,
    quickLinkItems,
    onCopyReferralLink,
    onCopyReferrerAddress,
    onBind,
  } = useCommunityConnectedView()

  return (
    <DappWidgetFrame subtitle={t.community.intro} title={t.community.title}>
      {referral.isBound ? (
        <CommunityReferralLinkCard
          copyLabel={t.community.shareReferral}
          disabled={!account}
          linkLabel={t.community.referralLink}
          onCopy={() => void onCopyReferralLink()}
          referralLink={referralLink}
        />
      ) : null}

      {referral.isBound ? (
        <CommunityReferrerBoundPanel
          addressLabel={t.community.referrer}
          copyLabel={t.common.copy}
          note={t.community.referralBondPermanent}
          onCopy={() => void onCopyReferrerAddress()}
          referrer={referral.referrer}
          referrerLabel={referral.referrerLabel}
        />
      ) : (
        <CommunityReferrerBindCard
          bindLabel={t.community.bindReferrer}
          canBind={referral.canBind}
          hint={t.community.referrerHint}
          inputLabel={t.community.referrerPlaceholder}
          isSubmitting={referral.isSubmitting}
          onBind={() => void onBind()}
          onInputChange={referral.setReferrerInput}
          placeholder={t.community.referrerPlaceholder}
          referrerLabel={t.community.referrer}
          value={referral.referrerInput}
        />
      )}

      <QuickLinks items={quickLinkItems} />
    </DappWidgetFrame>
  )
}

function CommunityDisconnectedWidget() {
  const { locale, messages: t } = useI18n()
  const quickLinkItems = communityQuickLinkItems(
    {
      docs: t.community.docs,
      youtube: t.community.youtube,
      medium: t.community.medium,
      twitter: t.community.twitter,
      telegram: t.community.telegram,
    },
    locale,
  )

  return (
    <DappWidgetFrame subtitle={t.community.disconnectedIntro} title={t.community.title}>
      <QuickLinks items={quickLinkItems} />
      <DappWidgetConnectPromo />
    </DappWidgetFrame>
  )
}
