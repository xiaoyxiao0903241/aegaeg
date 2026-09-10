/**
 * 全站 head meta（<title> / <meta description>）唯一来源，固定英文。
 *
 * HTML 壳的 head 对扫描器完全可见且无法编码（浏览器标签页与 SEO 都要明文），
 * 因此所有语言统一英文，避免静态 HTML 暴露本地化明文文案（防敏感词扫描）。
 * 页面可见文案仍按语言本地化，不受影响。
 */
export const headMeta = {
  description:
    'AEGIS X is an AI-native DeFi 4.0 protocol building the next-generation value network with USD1 settlement, BSC-first wallet access, and a self-healing protocol engine.',
  title: 'AEGIS X - Guarding the Future Value Network',
} as const
