import { homeAssets } from '~/home/assets'

/** 飞轮卡片右下角装饰层 — 与 AGX 相同的百分比锚点，随卡片 rem 同比缩放。 */
const tokenShapeInset =
  'left-[56.54%] right-[-3.53%] top-[55%] bottom-[0.71%]'

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

/**
 * 安全架构区 — rem 布局 + 连线相对角色图百分比锚点，随 site-fluid 同比缩放。
 * Figma 842×382 @ 16px → rem；连线 267/62/110 转为 art 宽高的 %。
 */
export const securityLayout = {
  gridClassName:
    'security-grid relative mx-auto mt-8 grid w-full max-w-[var(--home-security-block-max)] grid-cols-[var(--home-security-art-w)_minmax(0,1fr)] items-center gap-12 max-[1100px]:grid-cols-1 max-[1100px]:justify-items-center max-dapp:mt-4 max-dapp:flex max-dapp:w-full max-dapp:flex-col max-dapp:gap-4',
  artStageClassName:
    'relative w-full max-w-[var(--home-security-art-w)] shrink-0 max-dapp:max-w-[var(--home-security-art-h5-w)]',
  artClassName:
    'security-art flex w-full aspect-[330/382] items-center justify-center overflow-hidden max-dapp:aspect-[174/201]',
  lineClassName:
    'security-line pointer-events-none absolute left-[80.91%] top-[16.23%] z-1 aspect-[110/258] w-[33.33%] object-contain max-[1100px]:!hidden',
  listClassName:
    'check-list relative z-[2] grid w-full max-w-[var(--home-security-list-max)] gap-3.5 max-dapp:max-w-none',
  cardClassName:
    'flex min-h-[3.8125rem] items-center gap-3.5 px-5.5 py-5 text-[0.9375rem] font-medium leading-[1.4] text-foreground max-dapp:min-h-14 max-dapp:w-full max-dapp:gap-3 max-dapp:rounded-[0.875rem] max-dapp:px-[1.125rem] max-dapp:py-4 max-dapp:text-sm max-dapp:leading-[1.2]',
  cardTallClassName: 'max-dapp:min-h-[4.125rem]',
  iconClassName:
    'grid size-[var(--home-security-icon-wrap-size)] shrink-0 place-items-center rounded-[0.8125rem] bg-accent text-[0.8125rem] text-primary max-dapp:size-[var(--home-security-icon-wrap-size-h5)] max-dapp:rounded-xl',
} as const
