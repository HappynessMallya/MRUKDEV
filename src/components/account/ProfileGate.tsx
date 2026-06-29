'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/cn'
import { AccountDashboard } from '@/components/account/AccountDashboard'

// Routes between the Sign in / Sign up forms when no user is authenticated,
// or renders the profile when one is. Persists across reloads via the
// authStore (localStorage).
type Tab = 'signin' | 'signup'

export function ProfileGate() {
  const currentUser = useAuthStore((s) => s.currentUser)

  if (!currentUser) return <AuthGate />
  return <AccountDashboard />
}

function AuthGate() {
  const [tab, setTab] = useState<Tab>('signup')
  // Distributors register/sign-in into a PENDING state — show a dedicated
  // "awaiting approval" screen instead of the auth forms.
  const [pending, setPending] = useState(false)

  if (pending) return <PendingApproval onBack={() => { setPending(false); setTab('signin') }} />

  return (
    <div className="mx-auto max-w-md">
      <header className="text-center">
        <p
          className="text-foreground/60"
          style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          Account
        </p>
        <h1
          className="mt-2 font-heading text-foreground"
          style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {tab === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-foreground/65" style={{ fontSize: 14, lineHeight: '20px' }}>
          {tab === 'signup'
            ? 'It takes less than a minute. We use your details for orders and quotations only.'
            : 'Sign in to track orders, manage your wishlist, and reach support faster.'}
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 rounded-xl bg-surface p-1">
        <TabButton active={tab === 'signup'} onClick={() => setTab('signup')}>
          Sign up
        </TabButton>
        <TabButton active={tab === 'signin'} onClick={() => setTab('signin')}>
          Sign in
        </TabButton>
      </div>

      <div className="mt-6">
        {tab === 'signup' ? (
          <SignUpForm onSwitch={() => setTab('signin')} onPending={() => setPending(true)} />
        ) : (
          <SignInForm onSwitch={() => setTab('signup')} onPending={() => setPending(true)} />
        )}
      </div>
    </div>
  )
}

function PendingApproval({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <Icon icon="material-symbols:hourglass-top-outline" width={30} />
      </span>
      <h1
        className="mt-5 font-heading text-foreground"
        style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.2, fontWeight: 700 }}
      >
        Your account is pending approval
      </h1>
      <p className="mt-3 text-foreground/65" style={{ fontSize: 14, lineHeight: '22px' }}>
        Thanks for registering as a distributor. Our team reviews new distributor
        accounts before activation — you’ll be able to sign in once approved.
      </p>
      <div className="mt-6">
        <Button type="button" variant="soft" size="md" onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg py-2 transition-colors',
        active ? 'bg-background text-foreground shadow-sm' : 'text-foreground/55 hover:text-foreground'
      )}
      style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
    >
      {children}
    </button>
  )
}

type Role = 'customer' | 'distributor'

function SignUpForm({ onSwitch, onPending }: { onSwitch: () => void; onPending: () => void }) {
  const signUp = useAuthStore((s) => s.signUp)
  const [role, setRole] = useState<Role>('customer')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        const data = new FormData(e.currentTarget)
        void (async () => {
          const result = await signUp({
            name: String(data.get('name') ?? ''),
            email: String(data.get('email') ?? ''),
            phone: String(data.get('phone') ?? '') || undefined,
            password: String(data.get('password') ?? ''),
            role,
            company: String(data.get('company') ?? '') || undefined,
            region: String(data.get('region') ?? '') || undefined,
            country: String(data.get('country') ?? '') || undefined,
          })
          if (!result.ok) {
            setError(result.error)
            setSubmitting(false)
            return
          }
          // Distributors land in a pending state; customers are auto-signed-in
          // and ProfileGate re-renders into <AccountDashboard/> on its own.
          if (result.pendingApproval) onPending()
        })()
      }}
    >
      <RoleToggle role={role} onChange={setRole} />

      <Field
        id="signup-name"
        label={role === 'distributor' ? 'Contact name' : 'Full name'}
        placeholder="Jane Doe"
        autoComplete="name"
        required
      />
      <Field
        id="signup-email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Field
        id="signup-phone"
        type="tel"
        label="Phone (optional)"
        placeholder="+255 7XX XXX XXX"
        autoComplete="tel"
      />

      {role === 'distributor' && (
        <>
          <Field id="signup-company" label="Company" placeholder="Acme Ltd" required />
          <Field id="signup-region" label="Region" placeholder="Dar es Salaam" />
          <Field id="signup-country" label="Country" placeholder="Tanzania" defaultValue="TZ" />
        </>
      )}

      <Field
        id="signup-password"
        type="password"
        label="Password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        required
        minLength={6}
        helper="At least 6 characters."
      />

      {role === 'distributor' && (
        <p className="text-foreground/60" style={{ fontSize: 12, lineHeight: '17px' }}>
          Distributor accounts are reviewed by our team before activation.
        </p>
      )}

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Button type="submit" variant="solid" size="md" fullWidth disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-foreground/55" style={{ fontSize: 13, lineHeight: '20px' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary underline underline-offset-2"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}

function RoleToggle({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface p-1">
      {(['customer', 'distributor'] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={role === r}
          className={cn(
            'rounded-lg py-2 capitalize transition-colors',
            role === r ? 'bg-background text-foreground shadow-sm' : 'text-foreground/55 hover:text-foreground'
          )}
          style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

function SignInForm({ onSwitch, onPending }: { onSwitch: () => void; onPending: () => void }) {
  const signIn = useAuthStore((s) => s.signIn)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        const data = new FormData(e.currentTarget)
        void (async () => {
          const result = await signIn({
            email: String(data.get('email') ?? ''),
            password: String(data.get('password') ?? ''),
          })
          if (!result.ok) {
            if (result.pendingApproval) {
              onPending()
              return
            }
            setError(result.error)
            setSubmitting(false)
          }
        })()
      }}
    >
      <Field
        id="signin-email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Field
        id="signin-password"
        type="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
        required
      />

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Button type="submit" variant="solid" size="md" fullWidth disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center text-foreground/55" style={{ fontSize: 13, lineHeight: '20px' }}>
        New here?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary underline underline-offset-2"
        >
          Create an account
        </button>
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  type = 'text',
  required,
  minLength,
  autoComplete,
  helper,
  defaultValue,
  placeholder,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  helper?: string
  defaultValue?: string
  placeholder?: string
}) {
  const name = id.split('-').slice(1).join('-')
  const isPassword = type === 'password'
  const [reveal, setReveal] = useState(false)
  const renderedType = isPassword && reveal ? 'text' : type

  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span
        className="text-foreground"
        style={{ fontSize: 13, lineHeight: '18px', fontWeight: 600 }}
      >
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={renderedType}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-200 bg-background px-4 py-3 text-foreground placeholder:text-foreground/45 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
            isPassword ? 'pr-11' : ''
          }`}
          style={{ fontSize: 14, lineHeight: '20px' }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            aria-pressed={reveal}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-foreground/55 transition-colors hover:bg-surface hover:text-foreground"
          >
            <Icon
              icon={
                reveal
                  ? 'material-symbols:visibility-off-outline'
                  : 'material-symbols:visibility-outline'
              }
              width={18}
            />
          </button>
        )}
      </div>
      {helper && (
        <span className="text-foreground/55" style={{ fontSize: 12, lineHeight: '16px' }}>
          {helper}
        </span>
      )}
    </label>
  )
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-700"
      role="alert"
      style={{ fontSize: 13, lineHeight: '18px' }}
    >
      <Icon icon="material-symbols:error-outline" width={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
