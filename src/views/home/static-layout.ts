import { homeAssets } from '~/shared/assets/home'

/** 飞轮卡片右下角装饰层 — 与 AGX 相同的百分比锚点，随卡片 rem 同比缩放。 */
const tokenShapeInset = 'left-[56.54%] right-[-3.53%] top-[55%] bottom-[0.71%]'

/**
 * Token 飞轮卡片 — 装饰层走百分比 inset；卡片壳层走 Tailwind rem。
 */
export const tokenCardShells = [
  {
    className: 'bg-token-agx',
    icon: homeAssets.token.agxIcon,
    shape: homeAssets.token.agxShape,
    shapeWrapClassName: `${tokenShapeInset} opacity-20`,
    shapeClassName: 'object-cover',
    symbol: 'AGX',
  },
  {
    className: 'bg-token-usd1',
    icon: homeAssets.token.usd1Icon,
    shape: homeAssets.token.usd1Shape,
    shapeWrapClassName: tokenShapeInset,
    shapeClassName: 'object-contain',
    symbol: 'USD1',
  },
  {
    className: 'bg-token-x',
    icon: homeAssets.token.xIcon,
    iconClassName: 'scale-110',
    shape: homeAssets.token.xShape,
    shapeWrapClassName: `${tokenShapeInset} opacity-10`,
    shapeClassName: 'object-contain',
    symbol: 'X',
  },
  {
    className: 'bg-token-gagx',
    icon: homeAssets.token.gagxIcon,
    shape: homeAssets.token.gagxShape,
    shapeWrapClassName: tokenShapeInset,
    shapeClassName: 'object-contain',
    symbol: 'gAGX',
  },
] as const

export const partners = [
  ['USD1', homeAssets.partners.usd1],
  ['BSC', homeAssets.partners.bsc],
  ['Ethereum', homeAssets.partners.ethereum],
  ['LayerZero', homeAssets.partners.layerZero],
  ['Chainlink', homeAssets.partners.chainlink],
  ['PancakeSwap', homeAssets.partners.pancakeSwap],
] as const

export const protocolIcons = [
  homeAssets.protocol.aiThinkTank,
  homeAssets.protocol.usd1,
  homeAssets.protocol.globalPayments,
] as const

export const engineIcons = [
  homeAssets.engine.marketMaker,
  homeAssets.engine.volatility,
  homeAssets.engine.rebase,
  homeAssets.engine.turbo,
] as const
