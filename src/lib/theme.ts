import type { Category } from './types'

export const categoryMeta: Record<Category, { label: string; color: string } > = {
  mother:  { label: 'Mother',  color: '#2563eb' },
  father:  { label: 'Father',  color: '#7c3aed' },
  general: { label: 'General', color: '#059669' },
  partner: { label: 'Partner', color: '#ea580c' },
}

export const primaryBlue = '#1e5bef'
export const secondaryBlue = '#8fbaff'