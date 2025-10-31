import { Line, Radar } from 'react-chartjs-2'
import { useRef, useState } from 'react'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  RadialLinearScale,
  Filler,
} from 'chart.js'
import { loadState, sortByDate } from '@/lib/storage'
import { categoryMeta, primaryBlue, secondaryBlue } from '@/lib/theme'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, RadialLinearScale, Filler)

export function Dashboard(){
  const { entries } = loadState()
  const allData = sortByDate(entries)
  const [range, setRange] = useState<'all'|'last2'|'last3'|'last5'>('all')
  const data = range==='all' ? allData : allData.slice(-Number(range.replace('last','')))
  const labels = data.map(d=>d.date)
  const latest = data.length ? data[data.length - 1] : undefined

  const line = (label: string, values: (number|null)[], color: string) => ({
    label,
    data: values,
    borderColor: color,
    backgroundColor: color,
    spanGaps: true,
    tension: .25,
  })

  // General lines
  const chartData = {
    labels,
    datasets: [
      line('General Anxiety', data.map(d=>d.general.anxiety), primaryBlue),
      line('General Avoidance', data.map(d=>d.general.avoidance), secondaryBlue),
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: { y: { beginAtZero: true } }
  }

  const last = data.length ? data[data.length - 1] : undefined

  // Per-category trend lines
  const categoryTrends = {
    labels,
    datasets: (
      (Object.keys(categoryMeta) as (keyof typeof categoryMeta)[]).flatMap(k => ([
        line(`${categoryMeta[k].label} Anxiety`, data.map(d => d[k].anxiety), categoryMeta[k].color),
        {
          ...line(`${categoryMeta[k].label} Avoidance`, data.map(d => d[k].avoidance), categoryMeta[k].color + '99'),
          borderDash: [6,4],
        },
      ]))
    )
  }

  // Radar for latest date
  const radarLabels = ['Mother','Father','General','Partner']
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Anxiety',
        data: latest ? [latest.mother.anxiety, latest.father.anxiety, latest.general.anxiety, latest.partner.anxiety].map(v=>v ?? 0) : [0,0,0,0],
        borderColor: primaryBlue,
        backgroundColor: primaryBlue + '30',
      },
      {
        label: 'Avoidance',
        data: latest ? [latest.mother.avoidance, latest.father.avoidance, latest.general.avoidance, latest.partner.avoidance].map(v=>v ?? 0) : [0,0,0,0],
        borderColor: secondaryBlue,
        backgroundColor: secondaryBlue + '30',
      }
    ]
  }

  // General trends chart download
  const generalRef = useRef<any>(null)
  const downloadGeneral = () => {
    const url = generalRef.current?.toBase64Image?.()
    if(!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = 'general-trends.png'
    a.click()
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="card">
        <div className="card-header">Overview</div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500">Most Recent Date</div>
            <div className="text-2xl font-semibold">{latest?.date ?? '—'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Overall</div>
            <div className="text-2xl font-semibold">{latest?.overall ?? '—'}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>General Trends</span>
            <label className="text-sm text-slate-600 flex items-center gap-2">
              Range:
              <select className="border border-slate-300 rounded-md px-2 py-1" value={range as any} onChange={(e)=>setRange(e.target.value as any)}>
                <option value="all">All</option>
                <option value="last2">Last 2</option>
                <option value="last3">Last 3</option>
                <option value="last5">Last 5</option>
              </select>
            </label>
          </div>
          <button className="btn-secondary" onClick={downloadGeneral}>Download PNG</button>
        </div>
        <div className="card-body">
          <Line ref={generalRef} data={chartData} options={options} />
        </div>
      </section>

      <section className="card">
        <div className="card-header">Per-Category Anxiety Trends</div>
        <div className="card-body">
          <Line data={categoryTrends} options={options} />
        </div>
      </section>

      <section className="card">
        <div className="card-header flex items-center justify-between">
          <span>Latest Snapshot (Radar)</span>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2">
          <div>
            <Radar data={radarData} options={{ plugins: { legend: { position: 'bottom' } }, scales: { r: { beginAtZero: true } } }} />
          </div>
          <div className="text-sm text-slate-600 leading-6">
            The radar shows Anxiety and Avoidance for each category on the latest date. Lower values indicate improvement.
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">Latest vs Previous</div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {(() => {
            if(data.length < 2) return <div className="text-slate-500">Add more entries to see comparisons.</div>
            const prev = data[data.length - 2]
            const cmp = (curr: number|null, prv: number|null) => {
              if(curr==null || prv==null) return '—'
              const d = +(curr - prv).toFixed(2)
              if(d === 0) return <span className="badge badge-neutral">0</span>
              const good = d < 0
              return <span className={`badge ${good? 'badge-good':'badge-bad'}`}>{good? '↓':'↑'} {Math.abs(d)}</span>
            }
            const rows: Array<{label:string, a:[number|null,number|null], v:[number|null,number|null]}> = [
              { label: 'Mother',  a:[latest?.mother.anxiety ?? null, prev.mother.anxiety],    v:[latest?.mother.avoidance ?? null, prev.mother.avoidance] },
              { label: 'Father',  a:[latest?.father.anxiety ?? null, prev.father.anxiety],    v:[latest?.father.avoidance ?? null, prev.father.avoidance] },
              { label: 'General', a:[latest?.general.anxiety ?? null, prev.general.anxiety],  v:[latest?.general.avoidance ?? null, prev.general.avoidance] },
              { label: 'Partner', a:[latest?.partner.anxiety ?? null, prev.partner.anxiety],  v:[latest?.partner.avoidance ?? null, prev.partner.avoidance] },
            ]
            return (
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Anxiety Δ</th>
                    <th className="py-2 pr-4">Avoidance Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r=> (
                    <tr key={r.label} className="border-t border-slate-100">
                      <td className="py-2 pr-4 font-medium">{r.label}</td>
                      <td className="py-2 pr-4">{cmp(r.a[0], r.a[1])}</td>
                      <td className="py-2 pr-4">{cmp(r.v[0], r.v[1])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
