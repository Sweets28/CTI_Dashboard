import React from "react";
import { Link, useLocation } from "react-router-dom";



const Sidebar = () => {
    const location = useLocation()

    const navItem = (to, label) => (
        <Link
        to={to}
        className={`text-sm font-mono px-3 py-2 rounded transition-all ${
            location.pathname === to
            ? 'text-green-400 bg-gray-800 border-1-2 border-green-500'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        >
            {label}
        </Link>
    )
  return (
    <div className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col p-4">
      <div className="mb-6">
        <p className="text-xs text-gray-600 font-mono tracking-widest mb-2">MONITOR</p>
        <nav className="flex flex-col gap-1">
          {navItem('/', 'Dashboard')}
          {navItem('/threat-actors', 'Threat Actors')}
          {navItem('/indicators', 'Indicators')}
        </nav>
      </div>
      <div className="mb-6">
        <p className="text-xs text-gray-600 font-mono tracking-widest mb-2">INTEL SOURCES</p>
        <nav className="flex flex-col gap-1">
          {navItem('/mitre', 'MITRE ATT&CK')}
          {navItem('/nvd', 'NVD/NIST')}
          {navItem('/otx', 'OTX Feed')}
        </nav>
      </div>
    </div>
  )
}



export default Sidebar