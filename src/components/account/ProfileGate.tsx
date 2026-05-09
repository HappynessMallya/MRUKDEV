'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/cn'

// Routes between the Sign in / Sign up forms when no user is authenticated,
// or renders the profile when one is. Persists across reloads via the
// authStore (localStorage).
type Tab = 'signin' | 'signup'

export function ProfileGate() {
  const currentUser = useAuthStore((s) => s.currentUser)

  if (!currentUser) return <AuthGate />
  return <Profile />
}

function AuthGate() {
  const [tab, setTab] = useState<Tab>('signup')
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
        {tab === 'signup' ? <SignUpForm onSwitch={() => setTab('signin')} /> : <SignInForm onSwitch={() => setTab('signup')} />}
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

function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const signUp = useAuthStore((s) => s.signUp)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        const form = e.currentTarget
        const data = new FormData(form)
        const result = signUp({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          phone: String(data.get('phone') ?? '') || undefined,
          password: String(data.get('password') ?? ''),
        })
        if (!result.ok) {
          setError(result.error)
          setSubmitting(false)
        }
        // On success the store updates currentUser and ProfileGate
        // re-renders into <Profile/> automatically — no nav needed.
      }}
    >
      <Field
        id="signup-name"
        label="Full name"
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

function SignInForm({ onSwitch }: { onSwitch: () => void }) {
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
        const form = e.currentTarget
        const data = new FormData(form)
        const result = signIn({
          email: String(data.get('email') ?? ''),
          password: String(data.get('password') ?? ''),
        })
        if (!result.ok) {
          setError(result.error)
          setSubmitting(false)
        }
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

function Profile() {
  const user = useAuthStore((s) => s.currentUser)!
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const signOut = useAuthStore((s) => s.signOut)
  const [editing, setEditing] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const created = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-2xl">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon icon="iconoir:profile-circle" width={32} />
          </span>
          <div>
            <p
              className="text-foreground/60"
              style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              My profile
            </p>
            <h1
              className="mt-1 font-heading text-foreground"
              style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.15, fontWeight: 700 }}
            >
              {user.name}
            </h1>
            <p className="mt-1 text-foreground/65" style={{ fontSize: 14, lineHeight: '20px' }}>
              Member since {created}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="text-foreground/55 underline underline-offset-4 hover:text-foreground"
          style={{ fontSize: 13, lineHeight: '20px' }}
        >
          Sign out
        </button>
      </header>

      <section className="mt-10 rounded-2xl bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2
            className="font-heading text-foreground"
            style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
          >
            Account details
          </h2>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-primary underline underline-offset-4 hover:opacity-75"
              style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600 }}
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const data = new FormData(form)
              updateProfile({
                name: String(data.get('name') ?? user.name),
                phone: String(data.get('phone') ?? '') || undefined,
              })
              setEditing(false)
              setSavedAt(Date.now())
            }}
          >
            <Field
              id="profile-name"
              label="Full name"
              defaultValue={user.name}
              required
            />
            <Field
              id="profile-phone"
              type="tel"
              label="Phone"
              defaultValue={user.phone ?? ''}
            />
            <p className="text-foreground/55" style={{ fontSize: 13, lineHeight: '18px' }}>
              Email cannot be changed.
            </p>
            <div className="flex items-center gap-3">
              <Button type="submit" variant="solid" size="sm">
                Save changes
              </Button>
              <Button type="button" variant="soft" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Full name" value={user.name} />
            <Detail label="Email" value={user.email} />
            <Detail label="Phone" value={user.phone || '—'} />
          </dl>
        )}

        {savedAt && !editing && (
          <p
            className="mt-4 inline-flex items-center gap-1.5 text-foreground/60"
            style={{ fontSize: 13, lineHeight: '18px' }}
          >
            <Icon icon="material-symbols:check-circle-outline" width={16} className="text-primary" />
            Profile updated
          </p>
        )}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <ShortcutCard
          icon="material-symbols:local-shipping-outline"
          title="Orders"
          description="Track current orders and view your order history."
          href="/account/orders"
        />
        <ShortcutCard
          icon="material-symbols:headset-mic-outline"
          title="Support"
          description="Reach our team — we typically reply in under 2 hours."
          href="/contact"
        />
      </section>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-foreground/55" style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </dt>
      <dd className="mt-1 text-foreground" style={{ fontSize: 15, lineHeight: '22px', fontWeight: 500 }}>
        {value}
      </dd>
    </div>
  )
}

function ShortcutCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 rounded-2xl bg-surface p-5 transition-colors hover:bg-surface-alt"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
        <Icon icon={icon} width={18} />
      </span>
      <div>
        <h3
          className="font-heading text-foreground"
          style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700 }}
        >
          {title}
        </h3>
        <p className="mt-1 text-foreground/65" style={{ fontSize: 13, lineHeight: '18px' }}>
          {description}
        </p>
      </div>
    </a>
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
