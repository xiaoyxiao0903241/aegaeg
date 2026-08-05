import type { Account } from 'thirdweb/wallets'

import {
  classifyLoginFailure,
  shouldClearCachedLoginSignature,
} from '~/core/auth/classify-login-failure'
import { isJwtExpired, withJwtExpiry } from '~/core/auth/jwt'
import { ACCOUNT_BANNED_SENTINEL, LOGIN_ERROR } from '~/shared/api/account-banned'
import { login } from '~/shared/api/endpoints'
import {
  generateLoginNonce,
  loginMessage,
  type LoginMessageFormat,
  loginMessageFormat,
} from '~/web3/auth/login-message'
import {
  createLocalLoginSignatureStorage,
  createMemoryLoginSignatureStorage,
  type LoginSignatureStorage,
  readUsableLoginSignature,
  type StoredLoginSignature,
} from '~/web3/auth/login-signature-cache'
import {
  type AuthSessionStorage,
  createLocalAuthSessionStorage,
  isSessionForAddress,
  type StoredAuthSession,
} from '~/web3/auth/session'
import { isUserRejectedWalletError } from '~/web3/contract-error-message'

/**
 * 将 classifyLoginFailure 的结果映射为 AuthStore 可持久化的 sentinel 值。
 *
 * 临时性失败（transient）返回 null，不落盘，避免误判。
 *
 * @param error 登录过程中的异常
 * @returns 错误 sentinel 字符串；transient 返回 null
 */
export function toLoginErrorSentinel(error: unknown): string | null {
  switch (classifyLoginFailure(error)) {
    case 'banned':
      return ACCOUNT_BANNED_SENTINEL
    case 'user_rejected':
      return LOGIN_ERROR.USER_REJECTED
    case 'signature_rejected':
      return LOGIN_ERROR.SIGNATURE_REJECTED
    case 'failed':
      return LOGIN_ERROR.FAILED
    case 'transient':
      return null
  }
}

export interface WalletLoginParams {
  account: Account
  chainId: number
  domain?: string
  signMessage?: (message: string) => Promise<string>
  storage?: AuthSessionStorage
  signatureStorage?: LoginSignatureStorage
}

export interface WalletLoginResult {
  token: string
  message: string
  signature: string
}

/**
 * 返回尝试的登录消息格式顺序。
 *
 * 优先 SIWE；钱包拒绝 EIP-4361 载荷时回退为简版明文。
 *
 * @returns 格式数组，环境配置为 simple 时仅含 'simple'
 */
export function loginMessageFormats(): LoginMessageFormat[] {
  return loginMessageFormat() === 'simple' ? ['simple'] : ['siwe', 'simple']
}

/** 仅后端拒绝 SIWE 载荷时清除签名缓存；网络错误保留缓存以免反复弹窗。 */
function isLoginSignatureRejected(error: unknown): boolean {
  return shouldClearCachedLoginSignature(error)
}

/**
 * 用签名向后端 /login 换 token 并写入会话存储。
 *
 * @param params.address 钱包地址
 * @param params.message 已签名的消息
 * @param params.signature 签名
 * @param params.storage 会话存储
 * @returns 后端返回的 token
 */
async function exchangeLoginSignature({
  address,
  message,
  signature,
  storage,
}: {
  address: string
  message: string
  signature: string
  storage: AuthSessionStorage
}): Promise<string> {
  const { token } = await login({
    address,
    message,
    signature,
  })

  storage.write(
    withJwtExpiry({
      address,
      token,
      savedAt: Date.now(),
    }),
  )

  return token
}

/**
 * 依次尝试各消息格式完成签名换 token，成功后缓存签名。
 *
 * 钱包拒绝签名仅在最后一种格式时抛错；后端拒绝签名则切换下一种格式。
 *
 * @param params.account 钱包账户
 * @param params.chainId 当前链 ID
 * @param params.domain 站点域名
 * @param params.signMessage 签名回调
 * @param params.storage 会话存储
 * @param params.signatureStorage 签名缓存
 * @returns 登录结果（token / message / signature）
 */
async function signAndExchangeLogin({
  account,
  chainId,
  domain,
  signMessage,
  storage,
  signatureStorage,
}: {
  account: Account
  chainId: number
  domain?: string
  signMessage: (message: string) => Promise<string>
  storage: AuthSessionStorage
  signatureStorage: LoginSignatureStorage
}): Promise<WalletLoginResult> {
  const formats = loginMessageFormats()
  let lastError: unknown = null

  for (let index = 0; index < formats.length; index += 1) {
    const format = formats[index]!
    const isLastFormat = index === formats.length - 1
    const message = loginMessage(
      {
        address: account.address,
        chainId,
        domain,
        nonce: generateLoginNonce(),
      },
      format,
    )

    let signature: string
    try {
      signature = await signMessage(message)
    } catch (error) {
      if (isUserRejectedWalletError(error)) {
        throw error
      }
      lastError = error
      if (isLastFormat) {
        throw error
      }
      continue
    }

    try {
      const token = await exchangeLoginSignature({
        address: account.address,
        message,
        signature,
        storage,
      })

      const cachedAttempt: StoredLoginSignature = {
        address: account.address,
        message,
        signature,
        savedAt: Date.now(),
      }
      signatureStorage.write(cachedAttempt)

      return { token, message, signature }
    } catch (error) {
      if (!isLoginSignatureRejected(error)) {
        throw error
      }
      lastError = error
      if (isLastFormat) {
        throw error
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Login failed')
}

/**
 * 用钱包完成登录：签名消息并向后端换取 token。
 *
 * 优先复用未过期的缓存签名；无缓存或签名被后端拒绝时，重新走
 * 签名 → 换 token 流程。token 存入会话存储。
 *
 * @param params.account 钱包账户
 * @param params.chainId 当前链 ID
 * @param params.domain 站点域名
 * @param params.signMessage 签名回调，默认用 account.signMessage
 * @param params.storage 会话存储，默认 localStorage
 * @param params.signatureStorage 签名缓存，默认 localStorage
 * @returns 登录结果（token / message / signature）
 */
export async function loginWithWallet({
  account,
  chainId,
  domain,
  signMessage = (message) => account.signMessage({ message }),
  storage = createLocalAuthSessionStorage(localStorage),
  signatureStorage = createLocalLoginSignatureStorage(localStorage),
}: WalletLoginParams): Promise<WalletLoginResult> {
  const cached = readUsableLoginSignature(account.address, signatureStorage)
  if (cached) {
    try {
      const token = await exchangeLoginSignature({
        address: account.address,
        message: cached.message,
        signature: cached.signature,
        storage,
      })

      return {
        token,
        message: cached.message,
        signature: cached.signature,
      }
    } catch (error) {
      if (!isLoginSignatureRejected(error)) {
        throw error
      }

      signatureStorage.clearForAddress(account.address)
    }
  }

  return signAndExchangeLogin({
    account,
    chainId,
    domain,
    signMessage,
    storage,
    signatureStorage,
  })
}

/**
 * 读取指定地址的有效会话。
 *
 * 会话必须属于该地址且 JWT 未过期，否则视为无会话。
 *
 * @param address 钱包地址，可为 undefined
 * @param storage 会话存储，默认 localStorage
 * @returns 有效会话；无或已过期返回 null
 */
export function readWalletSession(
  address: string | undefined,
  storage: AuthSessionStorage = createLocalAuthSessionStorage(localStorage),
): StoredAuthSession | null {
  const session = storage.read()
  if (!isSessionForAddress(session, address)) return null
  if (isJwtExpired(session.token)) return null
  return session
}

export { createMemoryLoginSignatureStorage }
