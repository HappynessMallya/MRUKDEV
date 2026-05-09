import type { ReactNode } from 'react'

import { Container } from '@/components/atoms'

interface Section {
  id: string
  title: string
  body: ReactNode
}

// Shared shell for /privacy and /terms — eyebrow, title, "last updated"
// line, then a 2-column layout with a sticky table-of-contents on the
// left and the section bodies on the right.
export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  sections,
}: {
  eyebrow: string
  title: string
  lastUpdated: string
  sections: Section[]
}) {
  return (
    <Container className="py-12 md:py-16">
      <header className="max-w-2xl">
        <p
          className="text-foreground/60"
          style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          {eyebrow}
        </p>
        <h1
          className="mt-2 font-heading text-foreground"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          {title}
        </h1>
        <p
          className="mt-3 text-foreground/55"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          Last updated {lastUpdated}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl bg-surface p-5">
            <p
              className="text-foreground/60"
              style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              On this page
            </p>
            <ul className="mt-4 space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-foreground/75 transition-colors hover:text-foreground"
                    style={{ fontSize: 14, lineHeight: '20px' }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex flex-col gap-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2
                className="font-heading text-foreground"
                style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', lineHeight: 1.2, fontWeight: 700 }}
              >
                {s.title}
              </h2>
              <div
                className="mt-4 flex flex-col gap-4 text-foreground/75"
                style={{ fontSize: 15, lineHeight: '24px' }}
              >
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Container>
  )
}
