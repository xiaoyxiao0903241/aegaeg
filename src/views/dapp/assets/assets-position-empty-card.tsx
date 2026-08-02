import { dappAssets } from '~/app/assets'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

/** HTML 原型 stakePosEmpty：顶部 skeleton 行 + 插画空态卡 + 深色 CTA. */
export function AssetsPositionEmptyCard({
  title,
  body,
  ctaLabel,
  onCta,
}: {
  title: string
  body: string
  ctaLabel: string
  onCta: () => void
}) {
  return (
    <div className="grid gap-3">
      {/* HTML 原型空态顶行：elevated 阴影卡，无 border */}
      <Card surface="elevated" className="flex items-center gap-4 rounded-2xl px-5">
        <span aria-hidden className="size-11 shrink-0 rounded-full bg-muted" />
        <span aria-hidden className="grid min-w-0 flex-1 justify-items-start gap-2">
          <span className="h-3 w-32 max-w-3/5 rounded-sm bg-muted" />
          <span className="h-2.5 w-20 max-w-2/5 rounded-sm bg-muted" />
        </span>
        <span aria-hidden className="size-7 shrink-0 rounded-control bg-muted" />
      </Card>

      <Card surface="elevated" className="grid gap-3.5 rounded-2xl">
        <div className="grid flex-1 justify-items-center gap-3.5 px-5 py-6">
          <img
            alt=""
            className="size-21 object-contain"
            decoding="async"
            src={dappAssets.assetsPositionEmptyArt}
          />
          <Text as="p" className="text-center font-semibold" variant="detail">
            {title}
          </Text>
          <Text
            as="p"
            className="max-w-72 text-center leading-relaxed text-pretty"
            tone="muted-foreground"
            variant="support"
          >
            {body}
          </Text>
        </div>
        <Button
          className="min-h-11.5 w-full rounded-xl border-0 bg-dark text-white hover:bg-dark hover:text-white hover:opacity-90"
          onClick={onCta}
          shape="rounded"
          type="button"
          variant="secondary"
        >
          {ctaLabel}
        </Button>
      </Card>
    </div>
  )
}
