import React from "react";
import { Link } from "react-router-dom";



const Sidebar = () => {
    return(
        <div className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col p-4">
            <div className="mb-6">
                <p className="text-xs text-gray-600 font-mono tracking-widest mb-2">MONITOR</p>
                <nav className="flex flex-col gap-1">
                    <Link to="/" className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded">Dashboard</Link>
                    <Link to="/threat-actors" className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded">Threat Actors</Link>
                    <Link to="/indicators" className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded">Indicators</Link>
                    <a className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded cursor-pointer">CVE Feed</a>
                </nav>
            </div>
            <div className="mb-6">
                <p className="text-xs text-gray-600 font-mono tracking-widest mb-2">INTEL SOURCES</p>
                <nav className="flex flex-col gap-1">
                    <a className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded cursor-pointer">MITRE ATT&CK</a>
                    <a className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded cursor-pointer">NVD/NIST</a>
                    <a className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded cursor-pointer">OTX Feed</a>
                </nav>
            </div>
        </div>
    )
}



export default Sidebar