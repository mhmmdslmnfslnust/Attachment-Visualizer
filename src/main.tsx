import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import { AppShell } from './pages/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Data } from './pages/Data'
import { Scatter } from './pages/Scatter'
import { Tables } from './pages/Tables'
import { Settings } from './pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
    { index: true, element: <Dashboard /> },
    { path: 'data', element: <Data /> },
      { path: 'scatter', element: <Scatter /> },
      { path: 'tables', element: <Tables /> },
      { path: 'settings', element: <Settings /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
