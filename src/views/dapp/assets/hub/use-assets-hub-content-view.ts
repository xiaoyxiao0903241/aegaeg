import { useState } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd } from '~/shared/api/format-display'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

const ZERO_APPROX = formatApproxUsd(0, null)

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
    bufferTotalApprox: bufferAsset === 'agx' ? values.bufferTotalApprox : ZERO_APPROX,
    bufferReleased: bufferAsset === 'agx' ? values.bufferReleased : values.bufferGagxReleased,
    bufferReleasedApprox: bufferAsset === 'agx' ? values.bufferReleasedApprox : ZERO_APPROX,
    bufferLabel: bufferAsset === 'agx' ? overview.bufferAssetAgx : overview.bufferAssetGagx,
    bufferIcon: bufferAsset === 'agx' ? tokenCarouselIcons.agxIcon : tokenCarouselIcons.gagxIcon,
  }
}
