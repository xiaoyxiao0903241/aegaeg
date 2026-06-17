import type { Account } from 'thirdweb/wallets'
import { login } from '~/lib/api/endpoints'
import {
  buildLoginMessage,
  generateLoginNonce,
  resolveLoginMessageFormat,
} from '~/lib/api/auth/build-login-message'
import {
  createLocalLoginSignatureStorage,
  createMemoryLoginSignatureStorage,
  readUsableLoginSignature,
  type LoginSignatureStorage,
  type StoredLoginSignature,
} from '~/lib/api/auth/login-signature-cache'
import { isJwtExpired, withJwtExpiry } from '~/lib/api/auth/jwt'
import {
  createLocalAuthSessionStorage,
  isSessionForAddress,
  type AuthSessionStorage,
  type StoredAuthSession,
} from '~/lib/api/auth/session'

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

function isLoginSignatureRejected(error: unknown): boolean {
  return (
    error instanceof Error &&
    /nonce|signature|expired|invalid/i.test(error.message)
  )
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

      signatureStorage.clear()
    }
  }

  const message = buildLoginMessage(
    {
      address: account.address,
      chainId,
      domain,
      nonce: generateLoginNonce(),
    },
    resolveLoginMessageFormat(),
  )

  const signature = await signMessage(message)
  const cachedAttempt: StoredLoginSignature = {
    address: account.address,
    message,
    signature,
    savedAt: Date.now(),
  }
  signatureStorage.write(cachedAttempt)

  const token = await exchangeLoginSignature({
    address: account.address,
    message,
    signature,
    storage,
  })

  return { token, message, signature }
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

export function clearAuthSession(
  storage: AuthSessionStorage = createLocalAuthSessionStorage(localStorage),
): void {
  storage.clear()
}

export function clearWalletSession(
  storage: AuthSessionStorage = createLocalAuthSessionStorage(localStorage),
  signatureStorage: LoginSignatureStorage = createLocalLoginSignatureStorage(localStorage),
): void {
  storage.clear()
  signatureStorage.clear()
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 401
  )
}

export { createMemoryLoginSignatureStorage }
