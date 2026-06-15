import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { isJwtExpired, withJwtExpiry } from '../lib/api/auth/jwt'
import type { StoredLoginSignature } from '../lib/api/auth/login-signature-cache'
import {
  AUTH_SESSION_STORAGE_KEY,
  AUTH_SIGNATURE_STORAGE_KEY,
  type StoredAuthSession,
} from '../lib/api/auth/session'

export const AUTH_STORE_STORAGE_KEY = 'aegis.auth.store'

interface AuthPersistState {
  session: StoredAuthSession | null
  signature: StoredLoginSignature | null
}

interface AuthStore extends AuthPersistState {
  hasHydrated: boolean
  loginError: string | null
  isLoggingIn: boolean
  setHasHydrated: (value: boolean) => void
  setSession: (session: StoredAuthSession) => void
  clearSession: () => void
  setSignature: (signature: StoredLoginSignature) => void
  clearSignature: () => void
  clearWalletAuth: () => void
  setLoginError: (error: string | null) => void
  setIsLoggingIn: (value: boolean) => void
}

function readLegacyPersistedAuth(): AuthPersistState | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const legacySessionRaw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    const legacySignatureRaw = localStorage.getItem(AUTH_SIGNATURE_STORAGE_KEY)
    if (!legacySessionRaw && !legacySignatureRaw) return null

    const session = legacySessionRaw
      ? (JSON.parse(legacySessionRaw) as StoredAuthSession)
      : null
    const signature = legacySignatureRaw
      ? (JSON.parse(legacySignatureRaw) as StoredLoginSignature)
      : null

    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    localStorage.removeItem(AUTH_SIGNATURE_STORAGE_KEY)

    return { session, signature }
  } catch {
    return null
  }
}

function normalizePersistedSession(
  session: StoredAuthSession | null,
): StoredAuthSession | null {
  if (!session?.token || !session.address) return null
  if (isJwtExpired(session.token)) return null
  return withJwtExpiry(session)
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      signature: null,
      hasHydrated: false,
      loginError: null,
      isLoggingIn: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setSession: (session) => set({ session: normalizePersistedSession(session) }),
      clearSession: () => set({ session: null }),
      setSignature: (signature) => set({ signature }),
      clearSignature: () => set({ signature: null }),
      clearWalletAuth: () => set({ session: null, signature: null }),
      setLoginError: (loginError) => set({ loginError }),
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        signature: state.signature,
      }),
      merge: (persisted, currentState) => {
        const legacy = readLegacyPersistedAuth()
        const persistedState = (persisted ?? {}) as Partial<AuthPersistState>
        const merged: AuthPersistState = {
          session:
            normalizePersistedSession(persistedState.session ?? null) ??
            normalizePersistedSession(legacy?.session ?? null),
          signature: persistedState.signature ?? legacy?.signature ?? null,
        }

        return {
          ...currentState,
          ...merged,
        }
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          state?.setHasHydrated(true)
          return
        }

        if (state.session && isJwtExpired(state.session.token)) {
          state.clearSession()
        }

        state.setHasHydrated(true)
      },
    },
  ),
)

export function createMemoryAuthStoreState(
  initial: Partial<AuthPersistState> = {},
): AuthStore {
  return {
    session: initial.session ?? null,
    signature: initial.signature ?? null,
    hasHydrated: true,
    loginError: null,
    isLoggingIn: false,
    setHasHydrated: () => {},
    setSession: () => {},
    clearSession: () => {},
    setSignature: () => {},
    clearSignature: () => {},
    clearWalletAuth: () => {},
    setLoginError: () => {},
    setIsLoggingIn: () => {},
  }
}
