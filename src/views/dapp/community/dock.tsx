/**
 * 社区左栏 Dock
 *
 * 绑定推荐关系是链上操作，需要已连接钱包；
 * 成员表格与业绩数据仍留在正文中按登录会话态展示。
 */
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { communityQuickLinkItems } from '~/shared/config/community-links'
import {
  CommunityReferralLinkCard,
  CommunityReferrerBindCard,
  CommunityReferrerBoundPanel,
  QuickLink,
} from '~/views/dapp/community/primitives'
import { useCommunityDock } from '~/views/dapp/community/use-community'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockFrame } from '~/views/dapp/shared/dock-frame'

export function CommunityDock() {
  const { walletReady } = useDappHost()
  return walletReady ? <CommunityConnectedDock /> : <CommunityDisconnectedDock />
}

function CommunityConnectedDock() {
  const {
    t,
    account,
    referral,
    referralLink,
    quickLinkItems,
    onCopyReferralLink,
    onCopyReferrerAddress,
    onBind,
  } = useCommunityDock()

  return (
    <DockFrame subtitle={t.community.intro} title={t.community.title}>
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

      <div className="flex flex-col gap-2">
        {quickLinkItems.map((item) => (
          <QuickLink key={item.href} {...item} />
        ))}
      </div>
    </DockFrame>
  )
}

function CommunityDisconnectedDock() {
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
    <DockFrame subtitle={t.community.disconnectedIntro} title={t.community.title}>
      <div className="flex flex-col gap-2">
        {quickLinkItems.map((item) => (
          <QuickLink key={item.href} {...item} />
        ))}
      </div>
      <DockConnectPromo />
    </DockFrame>
  )
}
