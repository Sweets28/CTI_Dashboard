import { Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ThreatActors from './pages/ThreatActors'
import Indicators from './pages/Indicators'
import TopBar from './components/TopBar'
import Sidebar from './components/SideBar'
import CVEDetail from './pages/CVEDetail'
import ThreatActorDetail from './pages/ThreatActorDetail'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {!isLoginPage && <TopBar />}
      <div className="flex flex-1">
        {!isLoginPage && <Sidebar />}
        <main className={`flex-1 ${!isLoginPage ? 'p-6' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/threat-actors" element={<ProtectedRoute><ThreatActors /></ProtectedRoute>} />
            <Route path="/indicators" element={<ProtectedRoute><Indicators /></ProtectedRoute>} />
            <Route path="/vulnerabilities/:cve_id" element={<ProtectedRoute><CVEDetail /></ProtectedRoute>} />
            <Route path="/actors/:stix_id" element={<ProtectedRoute><ThreatActorDetail /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App