import type { ComponentType, ReactNode } from 'react'

import { CinematicShell } from './CinematicShell'
import type { TenantConfig } from '@/types/tenant'

export interface ShellProps {
  children: ReactNode
  config: TenantConfig
}

// Registry of layout shells keyed by `tenant.layout`.
// Adding a new layout = create a `<Name>Shell.tsx` and register it here.
const SHELLS: Record<string, ComponentType<ShellProps>> = {
  cinematic: CinematicShell,
}

export function getShell(layoutName: string) {
  return SHELLS[layoutName] ?? CinematicShell
}
