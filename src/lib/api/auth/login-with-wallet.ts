import type { Account } from 'thirdweb/wallets'
import { login } from '../endpoints'
import {
  buildLoginMessage,
  generateLoginNonce,
  resolveLoginMessageFormat,
} from './build-login-message'
import {
  createLocalAuthSessionStorage,
  isSessionForAddress,
  type AuthSessionStorage,
  type StoredAuthSession,
} from './session'

export interface WalletLoginParams {
  account: Account
  chainId: number
  domain?: string
  signMessage?: (message: string) => Promise<string>
  storage?: AuthSessionStorage
}

export interface WalletLoginResult {
  token: string
  message: string
  signature: string
}

export async function loginWithWallet({
  account,
  chainId,
  domain,
  signMessage = (message) => account.signMessage({ message }),
  storage = createLocalAuthSessionStorage(localStorage),
}: WalletLoginParams): Promise<WalletLoginResult> {
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
  const { token } = await login({
    address: account.address,
    message,
    signature,
  })

  storage.write({
    address: account.address,
    token,
    savedAt: Date.now(),
  })

  return { token, message, signature }
}

export function readWalletSession(
  address: string | undefined,
  storage: AuthSessionStorage = createLocalAuthSessionStorage(localStorage),
): StoredAuthSession | null {
  const session = storage.read()
  return isSessionForAddress(session, address) ? session : null
}

export function clearWalletSession(
  storage: AuthSessionStorage = createLocalAuthSessionStorage(localStorage),
): void {
  storage.clear()
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 401
  )
}
