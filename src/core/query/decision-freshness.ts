/**
 * 决策面金额：placeholder 视为未知（禁当 0 / 禁当已加载）。
 * 展示面可继续用 query.data（含 keepPreviousData）。
 */
export function decisionBigint(
  data: bigint | undefined,
  isPlaceholderData: boolean,
): bigint | undefined {
  if (isPlaceholderData) return undefined
  return data
}

/** 决策面是否已有新鲜值（非 placeholder 且 data 已定义）。 */
export function isDecisionFresh(isPlaceholderData: boolean, data: unknown): boolean {
  return !isPlaceholderData && data !== undefined
}
