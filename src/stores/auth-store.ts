import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { normalizeAuthAddress } from '~/lib/api/auth/auth-address'
import { isJwtExpired, withJwtExpiry } from '~/lib/api/auth/jwt'
import type { StoredLoginSignature } from '~/lib/api/auth/login-signature-cache'
import {
  AUTH_SESSION_STORAGE_KEY,
  AUTH_SIGNATURE_STORAGE_KEY,
  type StoredAuthSession,
} from '~/lib/api/auth/session'

export const AUTH_STORE_STORAGE_KEY = 'aegis.auth.store'

/**
 * Persisted auth data is two pure caches keyed by wallet address: the JWT
 * sessions and the SIWE signatures. There is no standalone "current session" —
 * the active session is always derived as `sessionsByAddress[walletAddress]`
 * (see `auth-machine.ts`), so switching wallets needs no backup/restore dance.
 */
interface AuthPersistState {
  signaturesByAddress: Record<string, StoredLoginSignature>
  sessionsByAddress: Record<string, StoredAuthSession>
}

interface AuthStore extends AuthPersistState {
  hasHydrated: boolean
  loginError: string | null
  isLoggingIn: boolean
  setHasHydrated: (value: boolean) => void
  upsertSessionForAddress: (session: StoredAuthSession) => void
  removeSessionForAddress: (address: string) => void
  upsertSignatureForAddress: (signature: StoredLoginSignature) => void
  readSignatureForAddress: (address: string | undefined) => StoredLoginSignature | null
  clearSignatureForAddress: (address: string) => void
  setLoginError: (error: string | null) => void
  setIsLoggingIn: (value: boolean) => void
}

function normalizePersistedSession(
  session: StoredAuthSession | null | undefined,
): StoredAuthSession | null {
  if (!session?.token || !session.address) return null
  if (isJwtExpired(session.token)) return null
  return withJwtExpiry(session)
}

function normalizePersistedSessions(
  sessionsByAddress: Record<string, StoredAuthSession> | undefined,
): Record<string, StoredAuthSession> {
  if (!sessionsByAddress) return {}

  return Object.fromEntries(
    Object.entries(sessionsByAddress).flatMap(([address, session]) => {
      const normalized = normalizePersistedSession(session)
      return normalized ? [[normalizeAuthAddress(address), normalized] as const] : []
    }),
  )
}

/**
 * Migrate the pre-v2 single-session/single-signature localStorage keys into the
 * address-keyed tables. Runs once; the legacy keys are removed after reading.
 */
function readLegacyPersistedAuth(): Partial<AuthPersistState> | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const legacySessionRaw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    const legacySignatureRaw = localStorage.getItem(AUTH_SIGNATURE_STORAGE_KEY)
    if (!legacySessionRaw && !legacySignatureRaw) return null

    const session = legacySessionRaw
      ? (JSON.parse(legacySessionRaw) as StoredAuthSession)
      : null
    const legacySignature = legacySignatureRaw
      ? (JSON.parse(legacySignatureRaw) as unknown)
      : null

    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    localStorage.removeItem(AUTH_SIGNATURE_STORAGE_KEY)

    const signaturesByAddress: Record<string, StoredLoginSignature> = {}
    if (legacySignature && typeof legacySignature === 'object') {
      if ('address' in legacySignature && typeof legacySignature.address === 'string') {
        signaturesByAddress[normalizeAuthAddress(legacySignature.address)] =
          legacySignature as StoredLoginSignature
      } else {
        Object.assign(signaturesByAddress, legacySignature as Record<string, StoredLoginSignature>)
      }
    }

    const sessionsByAddress: Record<string, StoredAuthSession> = {}
    const normalizedSession = normalizePersistedSession(session)
    if (normalizedSession) {
      sessionsByAddress[normalizeAuthAddress(normalizedSession.address)] = normalizedSession
    }

    return { signaturesByAddress, sessionsByAddress }
  } catch {
    return null
  }
}

function mergePersistedState(
  persistedState: Partial<
    AuthPersistState & { session?: StoredAuthSession | null; signature?: StoredLoginSignature | null }
  >,
  legacy: Partial<AuthPersistState> | null,
): AuthPersistState {
  const signaturesByAddress = {
    ...(legacy?.signaturesByAddress ?? {}),
    ...(persistedState.signaturesByAddress ?? {}),
  }

  if (persistedState.signature?.address) {
    signaturesByAddress[normalizeAuthAddress(persistedState.signature.address)] =
      persistedState.signature
  }

  const sessionsByAddress = normalizePersistedSessions({
    ...(legacy?.sessionsByAddress ?? {}),
    ...(persistedState.sessionsByAddress ?? {}),
  })

  // Fold any leftover pre-v2 top-level session into the address table.
  const legacySession = normalizePersistedSession(persistedState.session ?? null)
  if (legacySession) {
    sessionsByAddress[normalizeAuthAddress(legacySession.address)] = legacySession
  }

  return { signaturesByAddress, sessionsByAddress }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      signaturesByAddress: {},
      sessionsByAddress: {},
      hasHydrated: false,
      loginError: null,
      isLoggingIn: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      upsertSessionForAddress: (session) => {
        const normalized = normalizePersistedSession(session)
        if (!normalized) return

        set((state) => ({
          sessionsByAddress: {
            ...state.sessionsByAddress,
            [normalizeAuthAddress(normalized.address)]: normalized,
          },
        }))
      },
      removeSessionForAddress: (address) =>
        set((state) => {
          const sessionsByAddress = { ...state.sessionsByAddress }
          delete sessionsByAddress[normalizeAuthAddress(address)]
          return { sessionsByAddress }
        }),
      upsertSignatureForAddress: (signature) =>
        set((state) => ({
          signaturesByAddress: {
            ...state.signaturesByAddress,
            [normalizeAuthAddress(signature.address)]: signature,
          },
        })),
      readSignatureForAddress: (address) => {
        if (!address) return null
        return get().signaturesByAddress[normalizeAuthAddress(address)] ?? null
      },
      clearSignatureForAddress: (address) =>
        set((state) => {
          const signaturesByAddress = { ...state.signaturesByAddress }
          delete signaturesByAddress[normalizeAuthAddress(address)]
          return { signaturesByAddress }
        }),
      setLoginError: (loginError) => set({ loginError }),
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        signaturesByAddress: state.signaturesByAddress,
        sessionsByAddress: state.sessionsByAddress,
      }),
      merge: (persisted, currentState) => {
        const legacy = readLegacyPersistedAuth()
        const persistedState = (persisted ?? {}) as Partial<
          AuthPersistState & { session?: StoredAuthSession | null; signature?: StoredLoginSignature | null }
        >
        return {
          ...currentState,
          ...mergePersistedState(persistedState, legacy),
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export function createMemoryAuthStoreState(
  initial: Partial<AuthPersistState> = {},
): AuthStore {
  return {
    signaturesByAddress: initial.signaturesByAddress ?? {},
    sessionsByAddress: initial.sessionsByAddress ?? {},
    hasHydrated: true,
    loginError: null,
    isLoggingIn: false,
    setHasHydrated: () => {},
    upsertSessionForAddress: () => {},
    removeSessionForAddress: () => {},
    upsertSignatureForAddress: () => {},
    readSignatureForAddress: () => null,
    clearSignatureForAddress: () => {},
    setLoginError: () => {},
    setIsLoggingIn: () => {},
  }
}
