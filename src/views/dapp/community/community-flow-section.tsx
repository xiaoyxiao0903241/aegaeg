import { DappSection } from '~/app/shell/dapp-section'
import { useGenesisPromoChrome } from '~/hooks/use-genesis-promo'
import { useI18n } from '~/i18n/use-i18n'
import { applyMessageTemplate } from '~/shared/lib/apply-message-template'
import {
  CommunityProgramCard,
  CommunityProgramGrid,
} from '~/views/dapp/community/community-flow-primitives'
import { InviteFlow, InviteFlowStack } from '~/views/dapp/community/community-invite-flow'

export function CommunityFlowSection({ isMobileViewport = false }: { isMobileViewport?: boolean }) {
  const { messages: t } = useI18n()
  const genesis = useGenesisPromoChrome()

  const inviteFlowItems = t.community.inviteFlow.items.map(({ title, body }) => ({
    copy: body,
    title,
  }))

  const programItems = t.community.programs.items.map((program, index) => {
    if (index !== 0) return program
    return {
      ...program,
      label: applyMessageTemplate(program.label, {
        season: String(genesis.activeSeasonNumber),
      }),
    }
  })

  return (
    <>
      <DappSection title={t.community.inviteTitle}>
        {isMobileViewport ? (
          <InviteFlowStack items={inviteFlowItems} />
        ) : (
          <InviteFlow items={inviteFlowItems} />
        )}
      </DappSection>

      <DappSection title={t.community.programs.title}>
        <CommunityProgramGrid>
          {programItems.map((program) => (
            <CommunityProgramCard
              action={program.action}
              body={program.body}
              href={program.href}
              key={program.label}
              label={program.label}
              title={program.title}
            />
          ))}
        </CommunityProgramGrid>
      </DappSection>
    </>
  )
}
