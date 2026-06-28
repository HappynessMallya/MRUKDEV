import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { login as apiLogin, refresh as apiRefresh, register as apiRegister } from '@/lib/api/auth'
import type { ApiError } from '@/lib/apiClient'

// Auth store. When NEXT_PUBLIC_USE_API is true it talks to the Fanisi Studio
// backend (POST /auth/login|register|refresh) and holds the access + refresh
// tokens in localStorage (the backend returns them in the body — no cookies).
// When the flag is off it falls back to a fully client-side mock so the UI
// flows still work without a backend.
//
// NOTE: access tokens are 7-day, refresh 30-day, NOT one-time-use. We expose
// refreshSession() for callers to renew on a 401, but because the access token
// is long-lived a silent-refresh-on-401 interceptor isn't wired yet.

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

export interface User {
  id: string
  name: string
  // May be empty for phone-only accounts.
  email: string
  phone?: string
  roleSlug?: string
  createdAt: number
}

interface StoredAccount extends User {
  password: string
}

export interface SignUpInput {
  name: string
  email?: string
  phone?: string
  password: string
  role?: 'customer' | 'distributor'
  company?: string
  region?: string
  country?: string
}

export interface SignInInput {
  email?: string
  phone?: string
  password: string
}

// Distributors register as PENDING and can't sign in until approved, so signUp
// reports `pendingApproval` instead of a signed-in user in that case.
export type SignUpResult =
  | { ok: true; pendingApproval: boolean; user?: User }
  | { ok: false; error: string }

// A pending/rejected distributor login surfaces `pendingApproval` so the UI can
// show the right message rather than "wrong credentials".
export type SignInResult =
  | { ok: true; user: User }
  | { ok: false; error: string; pendingApproval?: boolean }

interface AuthState {
  currentUser: User | null
  accessToken: string | null
  refreshToken: string | null
  // Mock-mode account store (unused when USE_API).
  accounts: StoredAccount[]
  signUp: (input: SignUpInput) => Promise<SignUpResult>
  signIn: (input: SignInInput) => Promise<SignInResult>
  signOut: () => void
  // Renew the token pair from the stored refresh token; signs out on failure.
  refreshSession: () => Promise<boolean>
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void
}

const newId = () => Math.random().toString(36).slice(2, 10)

// Backend user.email may be null (phone-only) — coerce to a string for the UI.
function toUser(api: { id: string; name: string; email?: string | null; phone?: string | null; roleSlug?: string }): User {
  return {
    id: api.id,
    name: api.name,
    email: api.email ?? '',
    phone: api.phone ?? undefined,
    roleSlug: api.roleSlug,
    createdAt: Date.now(),
  }
}

function errMessage(e: unknown): string {
  const payload = (e as ApiError)?.payload?.message
  if (Array.isArray(payload)) return payload.join('; ')
  if (typeof payload === 'string') return payload
  return e instanceof Error ? e.message : 'Unexpected error'
}

// The backend uses the literal "Account is deactivated" for pending/rejected
// distributors (there's no machine-readable code to branch on).
function isDeactivated(msg: string): boolean {
  return /deactivat/i.test(msg)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      accessToken: null,
      refreshToken: null,
      accounts: [],

      signUp: async (input) => {
        if (USE_API) {
          try {
            const res = await apiRegister({
              name: input.name.trim(),
              email: input.email?.trim() || undefined,
              phone: input.phone?.trim() || undefined,
              password: input.password,
              role: input.role,
              company: input.company?.trim() || undefined,
              region: input.region?.trim() || undefined,
              country: input.country?.trim() || undefined,
            })
            // Distributors stay pending — don't attempt to sign them in.
            if (res.pendingApproval) return { ok: true, pendingApproval: true }
            // Customers are active immediately; register returns no tokens, so
            // log in with the same credentials to obtain the token pair.
            const signedIn = await get().signIn({
              email: input.email,
              phone: input.phone,
              password: input.password,
            })
            if (!signedIn.ok) return { ok: true, pendingApproval: false }
            return { ok: true, pendingApproval: false, user: signedIn.user }
          } catch (e) {
            return { ok: false, error: errMessage(e) }
          }
        }

        // ── Mock mode ──
        const normalised = (input.email ?? '').trim().toLowerCase()
        if (normalised && get().accounts.some((a) => a.email === normalised)) {
          return { ok: false, error: 'An account with that email already exists.' }
        }
        const account: StoredAccount = {
          id: newId(),
          name: input.name.trim(),
          email: normalised,
          phone: input.phone?.trim() || undefined,
          roleSlug: input.role ?? 'customer',
          password: input.password,
          createdAt: Date.now(),
        }
        // Mirror the real flow: distributors land in a pending state.
        if (input.role === 'distributor') {
          set({ accounts: [...get().accounts, account] })
          return { ok: true, pendingApproval: true }
        }
        set({ accounts: [...get().accounts, account], currentUser: stripPassword(account) })
        return { ok: true, pendingApproval: false, user: stripPassword(account) }
      },

      signIn: async (input) => {
        if (USE_API) {
          try {
            const res = await apiLogin({
              email: input.email?.trim() || undefined,
              phone: input.phone?.trim() || undefined,
              password: input.password,
            })
            set({
              currentUser: toUser(res.user),
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            })
            return { ok: true, user: toUser(res.user) }
          } catch (e) {
            const msg = errMessage(e)
            if (isDeactivated(msg)) {
              return {
                ok: false,
                pendingApproval: true,
                error: 'Your account is awaiting approval. We’ll email you once it’s active.',
              }
            }
            return { ok: false, error: 'Email/phone or password is incorrect.' }
          }
        }

        // ── Mock mode ──
        const normalised = (input.email ?? '').trim().toLowerCase()
        const match = get().accounts.find(
          (a) => a.email === normalised && a.password === input.password
        )
        if (!match) return { ok: false, error: 'Email or password is incorrect.' }
        if (match.roleSlug === 'distributor') {
          return {
            ok: false,
            pendingApproval: true,
            error: 'Your account is awaiting approval.',
          }
        }
        set({ currentUser: stripPassword(match) })
        return { ok: true, user: stripPassword(match) }
      },

      signOut: () => set({ currentUser: null, accessToken: null, refreshToken: null }),

      refreshSession: async () => {
        const token = get().refreshToken
        if (!USE_API || !token) return false
        try {
          const res = await apiRefresh(token)
          set({
            currentUser: toUser(res.user),
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
          return true
        } catch {
          // Any 401 from refresh means re-login.
          set({ currentUser: null, accessToken: null, refreshToken: null })
          return false
        }
      },

      updateProfile: (patch) => {
        const { currentUser, accounts } = get()
        if (!currentUser) return
        const nextUser = { ...currentUser, ...patch }
        set({
          currentUser: nextUser,
          accounts: accounts.map((a) =>
            a.id === currentUser.id ? { ...a, ...patch } : a
          ),
        })
      },
    }),
    {
      name: 'mruk-auth',
      // Persist the session + tokens (and mock accounts) across reloads.
      partialize: (s) => ({
        currentUser: s.currentUser,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        accounts: s.accounts,
      }),
    }
  )
)

function stripPassword(a: StoredAccount): User {
  const { password: _password, ...rest } = a
  void _password
  return rest
}
