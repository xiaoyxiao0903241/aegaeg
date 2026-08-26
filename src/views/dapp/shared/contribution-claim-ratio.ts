import { interpolate } from '~/i18n/interpolate'

/**
 * 将贡献领取比 `{ratio}`（如 `6:1`）写入文案模板。
 */
export function withContributionRatio(template: string, ratio: string): string {
  return interpolate(template, { ratio })
}
