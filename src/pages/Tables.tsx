import { loadState, sortByDate } from '@/lib/storage'
import { useState } from 'react'

function fmt(n: number | null){
  if(n==null || Number.isNaN(n)) return ''
  const s = Number(n).toFixed(2)
  return s.endsWith('.00')? s.slice(0,-3) : s
}

export function Tables(){
  const { entries } = loadState()
  const data = sortByDate(entries)
  const [compact, setCompact] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="card">
        <div className="card-header flex items-center justify-between">
          <span>Overview by Date</span>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={compact} onChange={(e)=>setCompact(e.target.checked)} /> Compact
          </label>
        </div>
        <div className="card-body overflow-x-auto">
          <table className={`min-w-full ${compact ? 'text-xs' : 'text-sm'}`}>
            <thead>
              <tr className="text-left text-slate-600">
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Date</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Overall</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Mother A</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Mother V</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Father A</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Father V</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>General A</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>General V</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Partner A</th>
                <th className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>Partner V</th>
              </tr>
            </thead>
            <tbody>
              {data.map(r=> (
                <tr key={r.date} className="border-t border-slate-100">
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'} font-medium`}>{r.date}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{r.overall}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.mother.anxiety)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.mother.avoidance)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.father.anxiety)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.father.avoidance)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.general.anxiety)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.general.avoidance)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.partner.anxiety)}</td>
                  <td className={`${compact ? 'py-1 pr-2' : 'py-2 pr-4'}`}>{fmt(r.partner.avoidance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
