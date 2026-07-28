import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { REFERRAL_METHODS, REFERRAL_ERRORS } from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const referralWriteAbi = parseWriteAbi(REFERRAL_METHODS.bindReferral, REFERRAL_ERRORS)

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
