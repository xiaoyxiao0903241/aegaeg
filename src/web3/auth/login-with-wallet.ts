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

/** 将 classifyLoginFailure 结果映射为 AuthStore 可持久化的 sentinel。 */
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

/** SIWE first; fall back to plain text for wallets that reject EIP-4361 payloads. */
export function loginMessageFormats(): LoginMessageFormat[] {
  return loginMessageFormat() === 'simple' ? ['simple'] : ['siwe', 'simple']
}

/** 仅后端拒绝 SIWE 载荷时清除签名缓存；网络错误保留缓存以免反复弹窗。 */
function isLoginSignatureRejected(error: unknown): boolean {
  return shouldClearCachedLoginSignature(error)
}

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
