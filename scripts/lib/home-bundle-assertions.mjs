/**
 * `probe:bundle` 使用的 Home 同步包断言。
 *
 * 只检查构建产物中的明确 web3 痕迹，避免 `thirdwebClientId` 这类
 * 仅配置键同名但无实际依赖的情况造成误报。
 */

/** @typedef {{ id: string, needle: string }} BundleMarker 污染标记（id 与搜索串） */

/** 可能说明 Home 同步图被 web3 代码污染的标记列表。 @type {BundleMarker[]} */
export const HOME_WEB3_POLLUTION_MARKERS = [
  { id: 'thirdweb-react-path', needle: 'thirdweb/react' },
  { id: 'walletconnect', needle: 'WalletConnect' },
  { id: 'create-wallet', needle: 'createWallet' },
  { id: 'viem-docs', needle: 'https://viem.sh' },
  { id: 'viem-version', needle: 'viem@' },
]

/** 软上限 1MB；当前 Home 约 490KB，此前命名分块污染曾推到约 3.5MB。 */
export const HOME_MAX_SYNC_KB = 1024

/**
 * 找出脚本文本命中的污染标记。
 *
 * @param {string} scriptText
 * @param {BundleMarker[]} markers
 * @returns {string[]} 命中的标记 id
 */
export function matchBundleMarkers(scriptText, markers) {
  return markers.filter((m) => scriptText.includes(m.needle)).map((m) => m.id)
}

/**
 * 汇总 Home 同步包失败项。
 *
 * @param {{
 *   syncScriptsKb: number
 *   syncContainsJapaneseCopy: boolean
 *   syncContainsSlippage: boolean
 *   matchedPollutionMarkers: string[]
 * }} home
 * @returns {string[]} 失败信息；数组为空表示通过
 */
export function collectHomeBundleFailures(home) {
  /** @type {string[]} */
  const failures = []

  if (home.matchedPollutionMarkers.length > 0) {
    failures.push(
      `Home sync JS contains web3 pollution markers: ${home.matchedPollutionMarkers.join(', ')}`,
    )
  }
  if (home.syncContainsSlippage) {
    failures.push('Home sync JS contains DApp-only "slippage" copy')
  }
  if (home.syncContainsJapaneseCopy) {
    failures.push('Home en sync JS embeds Japanese locale copy')
  }
  if (home.syncScriptsKb > HOME_MAX_SYNC_KB) {
    failures.push(
      `Home sync JS ${home.syncScriptsKb} KB exceeds ${HOME_MAX_SYNC_KB} KB ceiling (likely web3 chunk absorption)`,
    )
  }

  return failures
}
