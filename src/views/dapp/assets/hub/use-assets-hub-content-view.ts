import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { tokenCarouselIcons } from '~/app/assets'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

export function useAssetsHubContentView() {
  const { messages: t } = useI18n()
  const overview = t.assets.hub.overview
  const values = useAssetsHubOverviewStats()
  const [bufferAsset, setBufferAsset] = useState<'agx' | 'gagx'>('agx')

  return {
    t,
    overview,
    rebase: t.assets.hub.rebase,
    values,
    bufferAsset,
    setBufferAsset,
    bufferTotal: bufferAsset === 'agx' ? values.bufferTotal : values.bufferGagxTotal,
    bufferTotalApprox: bufferAsset === 'agx' ? values.bufferTotalApprox : '≈ —',
    bufferReleased: bufferAsset === 'agx' ? values.bufferReleased : values.bufferGagxReleased,
    bufferReleasedApprox: bufferAsset === 'agx' ? values.bufferReleasedApprox : '≈ —',
    bufferLabel: bufferAsset === 'agx' ? overview.bufferAssetAgx : overview.bufferAssetGagx,
    bufferIcon: bufferAsset === 'agx' ? tokenCarouselIcons.agxIcon : tokenCarouselIcons.gagxIcon,
  }
}
