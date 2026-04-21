import { useState, useEffect } from 'react'
import { getVulnerabilities, ingestNVD, ingestMitre, ingestOTX, getVulnerabilitiesCount } from '../api'
import MetricCard from '../components/MetricCard'
import ThreatFeed from '../components/ThreatFeed'
import Pagination from '../components/Pagination'
import SeverityChart from '../components/SeverityChart'
import IndicatorChart from '../components/BarChart'
import TimelineChart from '../components/TimelineChart'
import { getSeverityStats } from '../api'
import { getIndicatorTypes } from '../api'
import { getVulnerabilityTimeline } from '../api'
import WorldMap from '../components/WorldMap'
import { getCountryStats } from '../api'



const Dashboard = () => {
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [ingesting, setIngesting] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 20
  const [severityData, setSeverityData] = useState([])
  const [indicatorTypes, setIndicatorTypes] = useState([])
  const [VulnerabilityTimeline, setVulnerabilityTimeline] = useState([])
  const [countryData, setCountryData] = useState([])  
  // Refresh counts and total pages
  const refreshStats = () => {
    getVulnerabilitiesCount()
        .then(res => {
          setTotalCount(res.data.count);
          setTotalPages(Math.ceil(res.data.count / LIMIT));
        })
        .catch(err => console.error(err))
  }

  useEffect(() => {
    refreshStats();
  }, [])

  useEffect(() => {
    getIndicatorTypes()
    .then(res => setIndicatorTypes(res.data))
    .catch(err => console.error(err))
  }, [])
  
  useEffect(() => {
    getCountryStats()
    .then(res => setCountryData(res.data))
    catch(err => console.error(err))
  }, [])

  useEffect(() => {
    getSeverityStats()
      .then(res => setSeverityData(res.data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    getVulnerabilityTimeline()
    .then(res => setVulnerabilityTimeline(res.data))
    .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    getVulnerabilities((page - 1) * LIMIT, LIMIT)
      .then(res => setVulnerabilities(res.data))
      .catch(err => console.error(err))
  }, [page])

  const handleIngest = (ingestFn) => {
    setIngesting(true)
    ingestFn()
      .then(() => {
        refreshStats();
        return getVulnerabilities(0, LIMIT);
      })
      .then(res => {
        setVulnerabilities(res.data);
        setPage(1);
      })
      .catch(err => console.error(err))
      .finally(() => setIngesting(false))
  }

  // Filtered list based on current page data
  const filtered = vulnerabilities.filter(v =>
    v.cve_id?.toLowerCase().includes(search.toLowerCase()) ||
    v.severity?.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col space-y-6 p-2">
      
      {/* --- TOP HEADER & STATUS --- */}
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em]">// SYSTEM_DASHBOARD</p>
          <h1 className="text-white font-mono text-2xl font-bold uppercase">Intelligence Overview</h1>
        </div>
        <div className="text-right">
          <p className="text-gray-600 font-mono text-[10px]">UPLINK_STATUS: <span className="text-green-500">STABLE</span></p>
          <p className="text-gray-600 font-mono text-[10px]">LOCAL_TIME: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="CRITICAL THREATS" value={vulnerabilities.filter(v => v.severity === 'CRITICAL').length} delta="CURRENT_PAGE" color="red" />
        <MetricCard label="HIGH SEVERITY" value={vulnerabilities.filter(v => v.severity === 'HIGH').length} delta="CURRENT_PAGE" color="amber" />
        <MetricCard label="TOTAL RECORDS" value={totalCount} delta="DATABASE_TOTAL" color="blue" />
        <MetricCard label="ACTIVE FEEDS" value="03" delta="NVD, MITRE, OTX" color="green" />
      </div>

      {/* --- ACTIONS & SEARCH BAR --- */}
      <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => handleIngest(ingestNVD)} 
            disabled={ingesting} 
            className="flex-1 font-mono text-[10px] px-3 py-2 rounded border border-blue-900 text-blue-400 hover:bg-blue-900/20 transition-all disabled:opacity-30"
          >
            {ingesting ? '>_ INGESTING' : '>_ NVD_SYNC'}
          </button>
          <button 
            onClick={() => handleIngest(ingestMitre)} 
            disabled={ingesting} 
            className="flex-1 font-mono text-[10px] px-3 py-2 rounded border border-red-900 text-red-400 hover:bg-red-900/20 transition-all disabled:opacity-30"
          >
            {ingesting ? '>_ INGESTING' : '>_ MITRE_SYNC'}
          </button>
          <button 
            onClick={() => handleIngest(ingestOTX)} 
            disabled={ingesting} 
            className="flex-1 font-mono text-[10px] px-3 py-2 rounded border border-green-900 text-green-400 hover:bg-green-900/20 transition-all disabled:opacity-30"
          >
            {ingesting ? '>_ INGESTING' : '>_ OTX_SYNC'}
          </button>
        </div>

        <div className="relative w-full">
            <span className="absolute left-3 top-2.5 text-gray-600 font-mono text-xs">SEARCH_REF:</span>
            <input 
                type='text' 
                placeholder='...' 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className='w-full pl-24 pr-4 py-2 bg-black border border-gray-800 rounded font-mono text-sm text-blue-400 focus:outline-none focus:border-blue-600 transition-colors'
            />
        </div>
      </div>

      {/* --- MAIN FEED --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Vulnerability Data Feed</span>
            <span className="text-gray-600 font-mono text-[10px]">PAGE: {page} / {totalPages}</span>
        </div>
        <div className="p-4">
            <ThreatFeed vulnerabilities={filtered} />
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage(p => Math.max(1, p - 1))}
                onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 rounded-lg">
        <SeverityChart data={severityData}/>
        <IndicatorChart data={indicatorTypes}/>
      </div>
        <div className="grid grid-cols-3 gap-6 rounded-lg">
        <div className="col-span-2 gap-6 rounded-lg">
          <TimelineChart data={VulnerabilityTimeline}/>
          </div>
        </div>
        <WorldMap data={countryData}/>

      <footer className="text-center opacity-30 font-mono text-[9px] tracking-widest uppercase">
        Terminal_Session_Active // Node_ID: {Math.random().toString(36).substring(7).toUpperCase()}
      </footer>
    </div>
  )
}

export default Dashboard
