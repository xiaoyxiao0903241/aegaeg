import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { REFERRAL_ERRORS, REFERRAL_METHODS } from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const referralWriteAbi = parseWriteAbi(REFERRAL_METHODS.bindReferral, REFERRAL_ERRORS)

/**
 * 绑定推荐关系
 *
 * 调用 ReferralRegistry.bindReferral，把当前地址绑到指定推荐人；
 * 已绑定 / 自我推荐等合约 revert 会映射为对应用户文案。
 *
 * @param wallet 当前钱包
 * @param referrer 推荐人地址
 * @see 手册 §5.4 用户写方法
 * @see docs/onchain-manual/contracts/referral.md
 */
export async function bindReferrer({
  wallet,
  referrer,
}: {
  wallet: Wallet
  referrer: `0x${string}`
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.referral,
    abi: referralWriteAbi,
    functionName: 'bindReferral',
    args: [referrer],
  })
}
