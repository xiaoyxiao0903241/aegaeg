import { CONTRIBUTION_CLAIM_RATIO_LABEL } from '~/core/rewards/claim-contribution'
import { interpolate } from '~/i18n/interpolate'

/**
 * 将领取消耗比 `{ratio}` 写入文案。写死 1:1，不读链上除数。
 */
export function withContributionRatio(template: string): string {
  return interpolate(template, { ratio: CONTRIBUTION_CLAIM_RATIO_LABEL })
}
