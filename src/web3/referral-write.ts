import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/config/contracts'
import { REFERRAL_METHODS } from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet-contract-write'

const referralWriteAbi = parseWriteAbi(REFERRAL_METHODS.bindReferral)

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
