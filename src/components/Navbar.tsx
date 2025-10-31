import { NavLink } from 'react-router-dom'

export function Navbar(){
  const linkClass = ({isActive}:{isActive:boolean})=>
    `nav-link ${isActive? 'nav-link-active' : ''}`
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container h-16 flex items-center justify-center">
        <div className="flex items-center gap-8">
          <div className="text-lg font-bold text-primary-700">Attachment Visualizer</div>
          <div className="flex items-center gap-6">
            <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
            <NavLink to="/data" className={linkClass}>Data</NavLink>
            <NavLink to="/scatter" className={linkClass}>Scatter</NavLink>
            <NavLink to="/tables" className={linkClass}>Tables</NavLink>
            <NavLink to="/settings" className={linkClass}>Settings</NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
