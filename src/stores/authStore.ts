import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Client-side mock auth — registers and "signs in" entirely in the browser
// via localStorage so the UI flows can be built and tested before the
// backend lands. When /api/auth ships, swap the local check for a real
// fetch and the rest of the app keeps working unchanged.
//
// SECURITY NOTE: passwords are stored in plaintext in localStorage.
// Acceptable for a prototype, NOT acceptable in production. This whole
// store is meant to be replaced once the auth API is live.

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: number
}

interface StoredAccount extends User {
  password: string
}

interface AuthState {
  currentUser: User | null
  accounts: StoredAccount[]
  signUp: (input: {
    name: string
    email: string
    password: string
    phone?: string
  }) => { ok: true; user: User } | { ok: false; error: string }
  signIn: (input: {
    email: string
    password: string
  }) => { ok: true; user: User } | { ok: false; error: string }
  signOut: () => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void
}

const newId = () => Math.random().toString(36).slice(2, 10)

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      accounts: [],
      signUp: ({ name, email, password, phone }) => {
        const normalised = email.trim().toLowerCase()
        if (get().accounts.some((a) => a.email === normalised)) {
          return { ok: false, error: 'An account with that email already exists.' }
        }
        const account: StoredAccount = {
          id: newId(),
          name: name.trim(),
          email: normalised,
          phone: phone?.trim() || undefined,
          password,
          createdAt: Date.now(),
        }
        set({
          accounts: [...get().accounts, account],
          // Auto-sign-in after registration so the user lands directly on
          // the profile screen (matches the requested UX).
          currentUser: stripPassword(account),
        })
        return { ok: true, user: stripPassword(account) }
      },
      signIn: ({ email, password }) => {
        const normalised = email.trim().toLowerCase()
        const match = get().accounts.find(
          (a) => a.email === normalised && a.password === password
        )
        if (!match) return { ok: false, error: 'Email or password is incorrect.' }
        set({ currentUser: stripPassword(match) })
        return { ok: true, user: stripPassword(match) }
      },
      signOut: () => set({ currentUser: null }),
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
    { name: 'mruk-auth' }
  )
)

function stripPassword(a: StoredAccount): User {
  // Avoids leaking the plaintext password through `currentUser` reads.
  const { password: _password, ...rest } = a
  void _password
  return rest
}
