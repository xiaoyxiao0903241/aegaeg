import { useI18n } from '../../i18n/use-i18n'
import { dappAssets } from '../assets'
import { cn } from '~/lib/utils'

export function SwapConnectPromptCard({ className }: { className?: string }) {
  const { messages: t } = useI18n()

  return (
    <section className={cn('grid gap-2 rounded-2xl bg-accent p-4', className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        <img alt="" className="size-[22px] shrink-0" height="22" src={dappAssets.swapConnectPrompt} width="22" />
        <strong className="max-w-[250px] text-sm font-semibold leading-[1.2] tracking-normal text-foreground">
          {t.swap.connectExploreTitle}
        </strong>
      </div>
      <p className="m-0 text-[13px] font-semibold leading-[1.2] tracking-normal text-primary">
        {t.swap.connectExploreAction}
      </p>
    </section>
  )
}
