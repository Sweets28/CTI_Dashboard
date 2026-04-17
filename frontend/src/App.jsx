import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ThreatActors from './pages/ThreatActors'
import Indicators from './pages/Indicators'
import TopBar from './components/TopBar'
import Sidebar from './components/SideBar'
import CVEDetail from './pages/CVEDetail'
import ThreatActorDetail from './pages/ThreatActorDetail'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/threat-actors" element={<ThreatActors />} />
            <Route path="/indicators" element={<Indicators />} />
            <Route path="/vulnerabilities/:cve_id" element={<CVEDetail />} />
            <Route path="/actors/:stix_id" element={<ThreatActorDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App