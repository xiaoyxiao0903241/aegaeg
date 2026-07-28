import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export type InviteFlowItem = {
  copy: string
  title: string
}

const inviteFlowStep = tv({
  base: [
    'grid size-7.5 shrink-0 place-items-center self-start rounded-full bg-primary font-semibold text-white',
    'max-dapp:size-7',
    'text-(length:--type-copy-size)',
  ],
})

function InviteFlowStep({ children }: { children: ReactNode }) {
  return <span className={inviteFlowStep()}>{children}</span>
}

/** Invite flow connector — coral, 2px thick. */
function InviteFlowConnector({
  orientation = 'horizontal',
}: {
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <i
      className={cn(
        'shrink-0 rounded-sm bg-primary',
        orientation === 'horizontal' && 'h-0.5 flex-1 max-dapp:hidden',
        orientation === 'vertical' && 'min-h-6 w-0.5 flex-1',
      )}
    />
  )
}

/**
 * PC: column `gap-x-0` + equal `gap-2.5` on both sides of each connector
 * (old `gap-3.5` + `px-1` made left/right of the line unequal).
 */
export function InviteFlow({ items }: { items: InviteFlowItem[] }) {
  return (
    <Card
      as="div"
      surface="elevated"
      className={cn(
        revealClass(),
        'grid grid-cols-3 gap-x-0 gap-y-3.5 p-4',
        'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,10.5rem),1fr))] max-tablet:gap-4',
        'max-dapp:min-w-0 max-dapp:grid-cols-1 max-dapp:gap-3.5',
      )}
      data-reveal
    >
      {items.map((item, index) => {
        const showConnector = index < items.length - 1

        return (
          <article
            className="flex min-w-0 flex-col gap-2 max-dapp:grid max-dapp:grid-cols-[auto_minmax(0,1fr)] max-dapp:gap-x-3"
            key={item.title}
          >
            <div
              className={cn(
                'flex items-center max-dapp:items-start',
                // Equal inset on both ends of the line; drop when connector is H5-hidden.
                showConnector && 'gap-2.5 pr-2.5 max-dapp:gap-0 max-dapp:pr-0',
              )}
            >
              <InviteFlowStep>{index + 1}</InviteFlowStep>
              {showConnector ? <InviteFlowConnector /> : null}
            </div>
            <Text
              as="h4"
              variant="headline"
              className="m-0 text-sm/normal max-dapp:col-start-2 max-dapp:row-start-1 max-dapp:mt-0"
            >
              {item.title}
            </Text>
            <Text
              as="p"
              variant="support"
              tone="muted-foreground"
              className={cn(
                'm-0',
                'max-dapp:col-start-2 max-dapp:row-start-2 max-dapp:mt-0.5 max-dapp:line-clamp-2 max-dapp:max-w-none',
              )}
            >
              {item.copy}
            </Text>
          </article>
        )
      })}
    </Card>
  )
}

export function InviteFlowStack({ items }: { items: InviteFlowItem[] }) {
  return (
    <Card
      as="div"
      surface="elevated"
      className={cn(revealClass(), 'grid gap-0 p-4 max-dapp:rounded-2xl')}
      data-reveal
    >
      {items.map((item, index) => (
        <article className="flex items-stretch gap-3" key={item.title}>
          <div className="flex w-7 flex-col items-center">
            <InviteFlowStep>{index + 1}</InviteFlowStep>
            {index < items.length - 1 ? <InviteFlowConnector orientation="vertical" /> : null}
          </div>
          <div className={cn('grid min-w-0 gap-0.5', index < items.length - 1 && 'pb-3.5')}>
            <Text as="h4" variant="headline" className="m-0 text-sm leading-[1.2]">
              {item.title}
            </Text>
            <Text as="p" variant="copy" tone="muted-foreground" className="m-0 text-sm/normal">
              {item.copy}
            </Text>
          </div>
        </article>
      ))}
    </Card>
  )
}
