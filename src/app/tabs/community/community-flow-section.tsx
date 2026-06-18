import { useI18n } from '~/i18n/use-i18n'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { applyMessageTemplate } from '~/lib/presale/genesis-promo'
import { cn } from '~/lib/utils'
import type { DappTab } from '~/app/types'
import { DappSection } from '~/app/components/dapp-section'
import { ProgramCard } from '~/app/components/dapp-card'
import { InviteFlow, InviteFlowStack } from '~/app/components/invite-flow'

export function CommunityFlowSection({
  isMobileViewport = false,
  onSelectTab,
  sessionReady = false,
}: {
  isMobileViewport?: boolean
  onSelectTab: (tab: DappTab) => void
  sessionReady?: boolean
  tab?: DappTab
}) {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

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
      <DappSection
        className={cn(
          sessionReady && 'group-data-[tab=community]/shell:max-dapp:mt-0',
          !sessionReady && 'max-dapp:mt-5',
        )}
        title={t.community.inviteTitle}
      >
        {isMobileViewport ? (
          <InviteFlowStack items={inviteFlowItems} />
        ) : (
          <InviteFlow items={inviteFlowItems} />
        )}
      </DappSection>

      <DappSection
        className={cn(
          sessionReady && 'group-data-[tab=community]/shell:max-dapp:mt-0',
          !sessionReady && 'max-dapp:mt-[18px]',
        )}
        title={t.community.programs.title}
      >
        <div
          className={cn(
            'mt-4 grid grid-cols-2 gap-3',
            'max-dapp:grid-cols-1 max-dapp:gap-2.5',
          )}
        >
          {programItems.map((program) => (
            <ProgramCard
              action={program.action}
              body={program.body}
              className={cn(
                'max-dapp:gap-1.5 max-dapp:py-3',
                '[&_h4]:tracking-[-0.48px] max-dapp:[&_h4]:mt-1.5 max-dapp:[&_h4]:mb-0 max-dapp:[&_h4]:text-sm max-dapp:[&_h4]:leading-[1.2]',
                '[&_p]:tracking-[-0.26px]',
                '[&_button]:tracking-[-0.26px]',
              )}
              key={program.label}
              label={program.label}
              onAction={() => onSelectTab('genesis')}
              title={program.title}
            />
          ))}
        </div>
      </DappSection>
    </>
  )
}
