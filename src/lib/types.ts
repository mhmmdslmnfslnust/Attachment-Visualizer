// Core domain types for attachment results
export type Category = 'mother' | 'father' | 'general' | 'partner'

export interface Scores { anxiety: number | null; avoidance: number | null }

export interface Entry {
  date: string // ISO date YYYY-MM-DD
  overall: 'Secure' | 'Dismissive Avoidant' | 'Fearful/Disorganized' | 'Anxious/Preoccupied'
  mother: Scores
  father: Scores
  general: Scores
  partner: Scores
}

export interface AppState {
  entries: Entry[]
}
