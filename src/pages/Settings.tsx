import { exportJson, importJson, resetState } from '@/lib/storage'
import { useRef } from 'react'

export function Settings(){
  const fileRef = useRef<HTMLInputElement|null>(null)

  const onExport = () => {
    const blob = new Blob([exportJson()], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attachment-visualizer.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (f: File) => {
    const text = await f.text()
    importJson(text)
    alert('Imported! Refresh to apply.')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="card">
        <div className="card-header">Backup</div>
        <div className="card-body flex gap-3">
          <button className="btn" onClick={onExport}>Export JSON</button>
          <input type="file" ref={fileRef} className="hidden" accept="application/json" onChange={(e)=>{
            const f = e.target.files?.[0]; if(f) onImport(f)
            if(fileRef.current) fileRef.current.value = ''
          }} />
          <button className="btn-secondary" onClick={()=>fileRef.current?.click()}>Import JSON</button>
        </div>
      </section>
      <section className="card">
        <div className="card-header">Danger Zone</div>
        <div className="card-body">
          <button className="btn bg-rose-600 hover:bg-rose-700" onClick={()=>{
            if(confirm('Reset data to defaults?')){ resetState(); alert('Reset complete. Refresh to apply.') }
          }}>Reset to Defaults</button>
        </div>
      </section>
    </div>
  )
}
