import { useState } from 'react'
import LoginPage        from './pages/LoginPage'
import ProjectMasterPage from './pages/ProjectMasterPage'
/*import ReportPage       from './pages/ReportPage'*/

export default function App() {
  const [page, setPage] = useState('login')   // 'login' | 'projects' | 'report'
  const [activeProject, setActive] = useState(null)

  const handleLogin = () => setPage('projects')

  const handleViewReport = (project) => {
    setActive(project)
    setPage('report')
  }

  const handleBack = () => {
    setPage('projects')
    setActive(null)
  }

  const handleLogout = () => {
    setPage('login')
    setActive(null)
  }

  if (page === 'login')    return <LoginPage onLogin={handleLogin}/>
  if (page === 'projects') return <ProjectMasterPage/>
  {/*
  if (page === 'report')   return <ReportPage project={activeProject} onBack={handleBack}/>
  */}

  return null
}
