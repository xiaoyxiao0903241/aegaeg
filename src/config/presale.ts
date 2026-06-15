export interface PresalePhaseConfig {
  discountBps: number
  minUsd1: string
  maxUsd1: string
}

export interface PresaleConfig {
  phaseCount: number
  phaseDurationSeconds: number
  agxPriceUsd: string
  sharePriceUsd1: string
  phases: PresalePhaseConfig[]
}

/** 来源 references/xuqiu/DEPLOYMENT_RESULT.md 环境变量快照 */
export const PRESALE_CONFIG: PresaleConfig = {
  phaseCount: 3,
  phaseDurationSeconds: 259_200,
  agxPriceUsd: '65',
  sharePriceUsd1: '100',
  phases: [
    { discountBps: 3000, minUsd1: '100', maxUsd1: '10000' },
    { discountBps: 2500, minUsd1: '100', maxUsd1: '10000' },
    { discountBps: 2000, minUsd1: '100', maxUsd1: '10000' },
  ],
}
