import { Inter } from 'next/font/google'

// The Mr UK Figma uses Inter for both headings and body. We expose only the
// body variable from next/font; CSS aliases `--brand-font-heading` to it via
// globals.css so utilities like `font-heading` still resolve. Future tenants
// that want a different heading face can override `--brand-font-heading` from
// the runtime CSS injection in app/layout.tsx.
export const inter = Inter({
  subsets: ['latin'],
  variable: '--brand-font-body',
  display: 'swap',
})
