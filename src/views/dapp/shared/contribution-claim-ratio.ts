import { interpolate } from '~/i18n/interpolate'

/**
 * 将贡献领取比 `{ratio}`（如 `6:1`）写入文案模板。
 */
export function withContributionRatio(template: string, ratio: string): string {
  return interpolate(template, { ratio })
}

/**
 * FAQ 条目答案插值贡献领取比。
 */
export function mapFaqWithContributionRatio<T extends { q: string; a: string }>(
  items: readonly T[],
  ratio: string,
): T[] {
  return items.map((item) => ({ ...item, a: withContributionRatio(item.a, ratio) }))
}
