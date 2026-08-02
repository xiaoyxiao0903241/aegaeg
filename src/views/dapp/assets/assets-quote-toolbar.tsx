import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { Chip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'

export type AssetsQuoteCurrency = 'agx' | 'usd'

/** Shared AGX/USD quote toggle + sort chip for Assets position / Xmine widgets. */
export function AssetsQuoteToolbar({
  quote,
  onQuoteChange,
  sortLabel,
  quoteLabel,
}: {
  quote: AssetsQuoteCurrency
  onQuoteChange: (quote: AssetsQuoteCurrency) => void
  sortLabel: string
  quoteLabel: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Chip className="h-6 gap-1" shape="pill" size="sm" type="button" variant="soft">
        {sortLabel}
        <DappIcon alt="" className="size-2.5" size="sm" src={dappAssets.chevron} />
      </Chip>
      <div className="flex items-center gap-1">
        <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
          {quoteLabel}
        </Text>
        {/* Figma Quote toggle 24 */}
        <div className="flex h-6 items-center rounded-full bg-muted p-0.5">
          <Chip
            className="h-5 min-h-0 px-3 py-0 leading-none"
            onClick={() => onQuoteChange('agx')}
            shape="pill"
            size="sm"
            type="button"
            variant={quote === 'agx' ? 'solid' : 'soft'}
          >
            AGX
          </Chip>
          <Chip
            className="h-5 min-h-0 px-3 py-0 leading-none"
            onClick={() => onQuoteChange('usd')}
            shape="pill"
            size="sm"
            type="button"
            variant={quote === 'usd' ? 'solid' : 'soft'}
          >
            USD
          </Chip>
        </div>
      </div>
    </div>
  )
}
