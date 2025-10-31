import type { AppState, Entry } from './types'

const KEY = 'attachment-visualizer-v1'

// Initial Dummy data, does not represent any real person

const defaultData: Entry[] = [
  {
    date: '2025-04-12', overall: 'Dismissive Avoidant',
    mother: { anxiety: 2, avoidance: 5 },
    father: { anxiety: 2.33, avoidance: 6.17 },
    general:{ anxiety: 3, avoidance: 5.83 },
    partner:{ anxiety: 4.67, avoidance: 3 }
  },
  {
    date: '2025-08-27', overall: 'Secure',
    mother: { anxiety: 1.67, avoidance: 4.83 },
    father: { anxiety: 2.33, avoidance: 5.67 },
    general:{ anxiety: 2.67, avoidance: 3.5 },
    partner:{ anxiety: 4, avoidance: 3.17 }
  },
  {
    date: '2025-10-31', overall: 'Dismissive Avoidant',
    mother: { anxiety: 1.67, avoidance: 3.83 },
    father: { anxiety: 3.67, avoidance: 6 },
    general:{ anxiety: 3, avoidance: 4.5 },
    partner:{ anxiety: 3.67, avoidance: 3 }
  },
]

export function sortByDate(entries: Entry[]) {
  return [...entries].sort((a,b)=> a.date.localeCompare(b.date))
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if(!raw) return { entries: sortByDate(defaultData) }
    const parsed = JSON.parse(raw) as AppState
    if(!Array.isArray(parsed.entries)) return { entries: sortByDate(defaultData) }
    return { entries: sortByDate(parsed.entries) }
  } catch {
    return { entries: sortByDate(defaultData) }
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify({ entries: sortByDate(state.entries) }))
}

export function upsertEntry(entry: Entry) {
  const state = loadState()
  const idx = state.entries.findIndex(e=>e.date===entry.date)
  if(idx>=0) state.entries[idx]=entry; else state.entries.push(entry)
  saveState(state)
}

export function resetState() {
  saveState({ entries: defaultData })
}

export function exportJson(): string {
  return JSON.stringify(loadState(), null, 2)
}

export function importJson(text: string) {
  const json = JSON.parse(text) as AppState
  if(!Array.isArray(json.entries)) throw new Error('Invalid file: no entries array')
  json.entries.forEach(e=>{ if(!e.date) throw new Error('Invalid entry missing date') })
  saveState(json)
}
