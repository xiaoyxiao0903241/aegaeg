/**
 * Pure Home sync-bundle assertions for `probe:bundle`.
 * Markers avoid false positives from env keys like `thirdwebClientId`.
 */

/** @typedef {{ id: string, needle: string }} BundleMarker */

/** @type {BundleMarker[]} */
export const HOME_WEB3_POLLUTION_MARKERS = [
  { id: 'thirdweb-react-path', needle: 'thirdweb/react' },
  { id: 'walletconnect', needle: 'WalletConnect' },
  { id: 'create-wallet', needle: 'createWallet' },
  { id: 'viem-docs', needle: 'https://viem.sh' },
  { id: 'viem-version', needle: 'viem@' },
]

/** Soft ceiling: current Home ~490KB; named-chunk pollution was ~3.5MB. */
export const HOME_MAX_SYNC_KB = 1024

/**
 * @param {string} scriptText
 * @param {BundleMarker[]} markers
 * @returns {string[]} matched marker ids
 */
export function matchBundleMarkers(scriptText, markers) {
  return markers.filter((m) => scriptText.includes(m.needle)).map((m) => m.id)
}

/**
 * @param {{
 *   syncScriptsKb: number
 *   syncContainsJapaneseCopy: boolean
 *   syncContainsSlippage: boolean
 *   matchedPollutionMarkers: string[]
 * }} home
 * @returns {string[]} failure messages (empty = pass)
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
