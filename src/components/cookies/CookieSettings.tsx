'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useConsentStore } from '@/stores/consentStore'

interface Category {
  key: 'necessary' | 'analytics' | 'marketing' | 'preferences'
  title: string
  description: string
  alwaysOn?: boolean
}

const CATEGORIES: Category[] = [
  {
    key: 'necessary',
    title: 'Strictly necessary',
    description:
      'Essential for the site to work — login state, cart contents, security checks. These cannot be disabled.',
    alwaysOn: true,
  },
  {
    key: 'analytics',
    title: 'Analytics',
    description:
      'Anonymous usage stats so we can improve the site (page views, popular products, broken pages).',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    description:
      'Lets us measure the effectiveness of campaigns and show you relevant offers on partner sites.',
  },
  {
    key: 'preferences',
    title: 'Preferences',
    description:
      'Remembers personal choices — language, region, viewed-products list — to make the site feel tailored.',
  },
]

// Local UI state mirrors the store so the user can toggle freely and only
// commit changes by tapping Save preferences. Reject all / Accept all
// shortcuts apply immediately.
export function CookieSettings() {
  const persisted = useConsentStore((s) => s.categories)
  const acceptAll = useConsentStore((s) => s.acceptAll)
  const rejectAll = useConsentStore((s) => s.rejectAll)
  const save = useConsentStore((s) => s.save)

  const [analytics, setAnalytics] = useState(persisted?.analytics ?? false)
  const [marketing, setMarketing] = useState(persisted?.marketing ?? false)
  const [preferences, setPreferences] = useState(persisted?.preferences ?? false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const flagFor = (key: Category['key']): boolean => {
    if (key === 'necessary') return true
    if (key === 'analytics') return analytics
    if (key === 'marketing') return marketing
    return preferences
  }
  const setFlag = (key: Category['key'], value: boolean) => {
    if (key === 'analytics') setAnalytics(value)
    if (key === 'marketing') setMarketing(value)
    if (key === 'preferences') setPreferences(value)
  }

  const handleSave = () => {
    save({ analytics, marketing, preferences })
    setSavedAt(Date.now())
  }
  const handleAcceptAll = () => {
    setAnalytics(true)
    setMarketing(true)
    setPreferences(true)
    acceptAll()
    setSavedAt(Date.now())
  }
  const handleRejectAll = () => {
    setAnalytics(false)
    setMarketing(false)
    setPreferences(false)
    rejectAll()
    setSavedAt(Date.now())
  }

  return (
    <div className="mt-10 max-w-3xl">
      <ul className="flex flex-col gap-4">
        {CATEGORIES.map((c) => {
          const enabled = flagFor(c.key)
          return (
            <li key={c.key} className="rounded-2xl bg-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="font-heading text-foreground"
                    style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="mt-2 text-foreground/65"
                    style={{ fontSize: 14, lineHeight: '20px' }}
                  >
                    {c.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={c.title}
                  disabled={c.alwaysOn}
                  onClick={() => !c.alwaysOn && setFlag(c.key, !enabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    enabled ? 'bg-primary' : 'bg-foreground/20'
                  } ${c.alwaysOn ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button variant="solid" size="sm" onClick={handleSave}>
          Save preferences
        </Button>
        <Button variant="outline" size="sm" onClick={handleAcceptAll}>
          Accept all
        </Button>
        <Button variant="soft" size="sm" onClick={handleRejectAll}>
          Reject all
        </Button>

        {savedAt && (
          <span
            className="inline-flex items-center gap-1.5 text-foreground/65"
            style={{ fontSize: 13, lineHeight: '18px' }}
          >
            <Icon icon="material-symbols:check-circle-outline" width={16} className="text-primary" />
            Preferences saved
          </span>
        )}
      </div>
    </div>
  )
}
