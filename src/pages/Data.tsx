import { useMemo, useState } from 'react'
import { loadState, sortByDate, upsertEntry } from '@/lib/storage'
import type { Entry } from '@/lib/types'

function useLatest(): Entry | undefined {
  const { entries } = loadState()
  const data = sortByDate(entries)
  return data.length ? data[data.length-1] : undefined
}

export function Data(){
  const latest = useLatest()
  const [date, setDate] = useState(latest?.date ?? '')
  const [overall, setOverall] = useState<Entry['overall']>(latest?.overall ?? 'Secure')
  const [mA, setMA] = useState<number | ''>(latest?.mother.anxiety ?? '')
  const [mV, setMV] = useState<number | ''>(latest?.mother.avoidance ?? '')
  const [fA, setFA] = useState<number | ''>(latest?.father.anxiety ?? '')
  const [fV, setFV] = useState<number | ''>(latest?.father.avoidance ?? '')
  const [gA, setGA] = useState<number | ''>(latest?.general.anxiety ?? '')
  const [gV, setGV] = useState<number | ''>(latest?.general.avoidance ?? '')
  const [pA, setPA] = useState<number | ''>(latest?.partner.anxiety ?? '')
  const [pV, setPV] = useState<number | ''>(latest?.partner.avoidance ?? '')

  const save = () => {
    if(!date){ alert('Please choose a date'); return }
    const num = (v: number|'' ) => v === '' ? null : Number(v)
    upsertEntry({
      date,
      overall,
      mother: { anxiety: num(mA), avoidance: num(mV) },
      father: { anxiety: num(fA), avoidance: num(fV) },
      general:{ anxiety: num(gA), avoidance: num(gV) },
      partner:{ anxiety: num(pA), avoidance: num(pV) },
    })
    alert('Saved! Check Dashboard/Scatter/Tables.')
  }

  const common = 'border border-slate-300 rounded-lg px-3 py-2 w-full'

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="card">
        <div className="card-header">Add / Edit Entry</div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className={common} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Overall</label>
            <select value={overall} onChange={e=>setOverall(e.target.value as Entry['overall'])} className={common}>
              <option>Secure</option>
              <option>Dismissive Avoidant</option>
              <option>Fearful/Disorganized</option>
              <option>Anxious/Preoccupied</option>
            </select>
          </div>

          <div>
            <div className="font-semibold mb-2">Mother</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Anxiety</label>
                <input type="number" step="0.01" value={mA} onChange={e=>setMA(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Avoidance</label>
                <input type="number" step="0.01" value={mV} onChange={e=>setMV(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Father</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Anxiety</label>
                <input type="number" step="0.01" value={fA} onChange={e=>setFA(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Avoidance</label>
                <input type="number" step="0.01" value={fV} onChange={e=>setFV(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">General</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Anxiety</label>
                <input type="number" step="0.01" value={gA} onChange={e=>setGA(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Avoidance</label>
                <input type="number" step="0.01" value={gV} onChange={e=>setGV(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Partner</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Anxiety</label>
                <input type="number" step="0.01" value={pA} onChange={e=>setPA(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Avoidance</label>
                <input type="number" step="0.01" value={pV} onChange={e=>setPV(e.target.value===''? '' : Number(e.target.value))} className={common} />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button className="btn" onClick={save}>Save Entry</button>
          </div>
        </div>
      </section>
    </div>
  )
}