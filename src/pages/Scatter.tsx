import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { loadState, sortByDate } from '@/lib/storage'
import type { Category, Entry } from '@/lib/types'

const categories: { key: Category, label: string, color: string }[] = [
  { key: 'mother', label: 'Mother', color: '#2563eb' },
  { key: 'father', label: 'Father', color: '#7c3aed' },
  { key: 'general', label: 'General', color: '#059669' },
  { key: 'partner', label: 'Partner', color: '#ea580c' },
]

type Zone = { name: string, color: string, alpha: number, x0: number, x1: number, y0: number, y1: number }

export function Scatter(){
  const { entries } = loadState()
  const data = sortByDate(entries)
  const [enabled, setEnabled] = useState<Record<Category, boolean>>({ mother:true, father:true, general:true, partner:true })
  const [showZones, setShowZones] = useState<boolean>(true)

  const svgRef = useRef<SVGSVGElement|null>(null)
  const size = { width: 900, height: 520, margin: { top: 24, right: 24, bottom: 40, left: 48 } }

  const points = useMemo(()=>{
    // Transform entries into points per category with previous link
    const out: { category: Category, date: string, anxiety: number|null, avoidance: number|null, prev?: { anxiety:number|null, avoidance:number|null, date:string } }[] = []
    for(const c of categories){
      let prev: Entry | undefined
      for(const e of data){
        out.push({ category: c.key, date: e.date, anxiety: e[c.key].anxiety, avoidance: e[c.key].avoidance, prev: prev? { anxiety: prev[c.key].anxiety, avoidance: prev[c.key].avoidance, date: prev.date } : undefined })
        prev = e
      }
    }
    return out
  }, [data])

  useEffect(()=>{
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height, margin } = size
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const allVals = points.flatMap(p=> [p.anxiety ?? 0, p.avoidance ?? 0])
    const maxVal = Math.max(8, d3.max(allVals) ?? 8)

    const x = d3.scaleLinear().domain([0, maxVal]).range([0, innerW])
    const y = d3.scaleLinear().domain([0, maxVal]).range([innerH, 0])

    // optional style zones (quadrants)
    if(showZones){
      const thrX = 4
      const thrY = 4
      const zones: Zone[] = [
        { name: 'Secure', color: '#22c55e', alpha: 0.2, x0: 0,    x1: thrX, y0: 0,    y1: thrY },
        { name: 'Dismissive Avoidant', color: '#3b82f6', alpha: 0.2, x0: 0,    x1: thrX, y0: thrY, y1: maxVal },
        { name: 'Anxious/Preoccupied', color: '#f59e0b', alpha: 0.2, x0: thrX, x1: maxVal, y0: 0,    y1: thrY },
        { name: 'Fearful/Disorganized', color: '#ef4444', alpha: 0.2, x0: thrX, x1: maxVal, y0: thrY, y1: maxVal },
      ]

      const zonesG = g.append('g')
      zonesG.selectAll('rect.zone')
        .data(zones)
        .join('rect')
  .attr('x', (d: Zone)=> x(Math.min(d.x0, d.x1)))
  .attr('y', (d: Zone)=> y(Math.max(d.y0, d.y1)))
  .attr('width', (d: Zone)=> Math.abs(x(d.x1) - x(d.x0)))
  .attr('height', (d: Zone)=> Math.abs(y(d.y0) - y(d.y1)))
  .attr('fill', (d: Zone)=> d.color)
  .attr('fill-opacity', (d: Zone)=> d.alpha)
        .attr('rx', 2)
    }

    // axes
    g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x))
    g.append('g').call(d3.axisLeft(y))

    // grid
    g.append('g')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .selectAll('line.h')
  .data(y.ticks())
      .join('line')
  .attr('x1', 0).attr('x2', innerW)
  .attr('y1', (d: number)=>y(d)).attr('y2', (d: number)=>y(d))

    g.append('g')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .selectAll('line.v')
  .data(x.ticks())
      .join('line')
  .attr('y1', 0).attr('y2', innerH)
  .attr('x1', (d: number)=>x(d)).attr('x2', (d: number)=>x(d))

    // labels
    g.append('text').attr('x', innerW/2).attr('y', innerH+32).attr('text-anchor','middle').attr('fill','#334155').text('Anxiety')
    g.append('text').attr('x', -innerH/2).attr('y', -36).attr('transform','rotate(-90)').attr('text-anchor','middle').attr('fill','#334155').text('Avoidance')

    // Draw arrows and points per category
    for(const c of categories){
      if(!enabled[c.key]) continue
  const cat = points.filter((p)=>p.category===c.key)

      // arrows from prev to current
      g.append('g').selectAll('line.arrow')
  .data(cat.filter((p)=>p.prev && p.prev.anxiety!=null && p.prev.avoidance!=null && p.anxiety!=null && p.avoidance!=null))
        .join('line')
  .attr('x1', (p: typeof cat[number])=>x(p.prev!.anxiety!))
  .attr('y1', (p: typeof cat[number])=>y(p.prev!.avoidance!))
  .attr('x2', (p: typeof cat[number])=>x(p.anxiety!))
  .attr('y2', (p: typeof cat[number])=>y(p.avoidance!))
        .attr('stroke', c.color)
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)')

      // points
      g.append('g').selectAll('circle.pt')
  .data(cat)
        .join('circle')
  .attr('cx', (p: typeof cat[number])=>x(p.anxiety ?? 0))
  .attr('cy', (p: typeof cat[number])=>y(p.avoidance ?? 0))
        .attr('r', 5)
        .attr('fill', c.color)
        .attr('fill-opacity', .85)
        .append('title')
  .text((p: typeof cat[number])=> `${c.label} ${p.date}\nAnxiety: ${p.anxiety ?? '—'} / Avoidance: ${p.avoidance ?? '—'}`)
    }

    // arrowhead marker
    svg.select('defs').remove()
    svg.append('defs').append('marker')
      .attr('id','arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8).attr('refY', 5)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d','M 0 0 L 10 5 L 0 10 z')
      .attr('fill','#334155')

  }, [points, enabled, showZones])

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="card">
        <div className="card-header">Controls</div>
        <div className="card-body flex flex-wrap gap-4 items-center">
          <label className="inline-flex items-center gap-2 mr-4">
            <input type="checkbox" checked={showZones} onChange={(e)=> setShowZones(e.target.checked)} />
            <span className="text-sm text-slate-700">Show style zones</span>
          </label>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><span style={{background:'#22c55e', opacity:.25, width:12, height:12, display:'inline-block', borderRadius:2}}></span> Secure</span>
            <span className="inline-flex items-center gap-1"><span style={{background:'#3b82f6', opacity:.22, width:12, height:12, display:'inline-block', borderRadius:2}}></span> Dismissive</span>
            <span className="inline-flex items-center gap-1"><span style={{background:'#f59e0b', opacity:.25, width:12, height:12, display:'inline-block', borderRadius:2}}></span> Anxious</span>
            <span className="inline-flex items-center gap-1"><span style={{background:'#ef4444', opacity:.22, width:12, height:12, display:'inline-block', borderRadius:2}}></span> Fearful</span>
          </div>
          {categories.map(c=> (
            <label key={c.key} className="inline-flex items-center gap-2">
              <input type="checkbox" checked={enabled[c.key]} onChange={(e)=> setEnabled(s=>({ ...s, [c.key]: e.target.checked }))} />
              <span className="badge" style={{ borderColor: c.color, color: c.color, backgroundColor: `${c.color}15` }}>{c.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">Cartesian Plane: Anxiety (X) vs Avoidance (Y)</div>
        <div className="card-body">
          <svg ref={svgRef} width={size.width} height={size.height} className="w-full h-auto"></svg>
        </div>
      </section>
    </div>
  )
}
