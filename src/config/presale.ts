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

/** 来源 DEPLOYMENT_RESULT.md 环境变量快照（2026-06-22） */
export const PRESALE_CONFIG: PresaleConfig = {
  phaseCount: 3,
  phaseDurationSeconds: 259_200,
  agxPriceUsd: '55',
  sharePriceUsd1: '100',
  phases: [
    { discountBps: 3000, minUsd1: '100', maxUsd1: '10000' },
    { discountBps: 2500, minUsd1: '100', maxUsd1: '20000' },
    { discountBps: 2000, minUsd1: '100', maxUsd1: '30000' },
  ],
}
