import type { StoredAuthSession, StoredLoginSignature } from '~/core/auth/types'

export interface AuthSessionStorage {
  read(): StoredAuthSession | null
  write(session: StoredAuthSession): void
  clear(): void
}

export interface LoginSignatureStorage {
  readForAddress(address: string): StoredLoginSignature | null
  write(signature: StoredLoginSignature): void
  clearForAddress(address: string): void
}
