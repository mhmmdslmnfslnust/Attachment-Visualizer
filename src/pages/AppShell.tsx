import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

export function AppShell(){
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200">
        <div className="container py-6 text-sm text-slate-500">
          Data is stored locally in your browser. Use Settings to export/import backups.
        </div>
      </footer>
    </div>
  )
}
