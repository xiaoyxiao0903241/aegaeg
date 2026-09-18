import type { Wallet } from 'thirdweb/wallets'

import type { VoteSupportValue } from '~/core/proposal/proposal-state'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AEGIS_PROPOSAL_METHODS } from '~/web3/abis'
import { approveErc20 } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const voteAbi = parseWriteAbi(AEGIS_PROPOSAL_METHODS.vote)
const withdrawAbi = parseWriteAbi(AEGIS_PROPOSAL_METHODS.withdrawal)

/** AGX → 提案合约授权：预检已判定不足后发出 approve，不再读额度。 */
export async function approveAgxForProposal(args: { wallet: Wallet; amount: bigint }) {
  return approveErc20({
    wallet: args.wallet,
    token: BSC_CONTRACTS.agx,
    spender: BSC_CONTRACTS.aegisProposal,
    amountIn: args.amount,
  })
}

/**
 * 锁定 AGX 投票。
 *
 * @param args.proposalId 提案 id
 * @param args.support 0 反对 / 1 赞成
 * @param args.amount AGX 最小单位
 */
export async function voteOnProposal(args: {
  wallet: Wallet
  proposalId: number
  support: VoteSupportValue
  amount: bigint
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.aegisProposal,
    abi: voteAbi,
    functionName: 'vote',
    args: [BigInt(args.proposalId), args.support, args.amount],
  })
}

/**
 * 取回本金与收益（同一笔 withdrawal）。
 *
 * @param args.proposalId 提案 id
 */
export async function withdrawProposal(args: { wallet: Wallet; proposalId: number }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.aegisProposal,
    abi: withdrawAbi,
    functionName: 'withdrawal',
    args: [BigInt(args.proposalId)],
  })
}
