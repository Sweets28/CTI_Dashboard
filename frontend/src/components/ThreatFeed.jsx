import React from "react";
import { useNavigate } from "react-router-dom";


const severityColor = {
  CRITICAL: 'bg-red-900 text-red-400 border border-red-700',
  HIGH: 'bg-amber-900 text-amber-400 border border-amber-700',
  MEDIUM: 'bg-blue-900 text-blue-400 border border-blue-700',
  LOW: 'bg-green-900 text-green-400 border border-green-700',
}


const ThreatFeed =({ vulnerabilities }) => {
    const navigate = useNavigate()
    return(
        <div className="bg-gray-900 border border-gray-800 rounded-lg w-full">
            <div className="p-4 border-b border-gray-800">
                <p className="text-gray-400 font-mono text-xs tracking-widest">// LATEST THREATS</p>
            </div>
            <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-teal-950
                [&::-webkit-scrollbar-thumb]:bg-teal-500
                [&::-webkit-scrollbar-thumb]:rounded-full max-h-96">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-800">
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">CVE ID</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">SEVERITY</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">CVSS SCORE</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">DESCRIPTION</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">SOURCE</th>
                    </tr>
                </thead>
                <tbody>
                    {vulnerabilities.map(v => (
                        <tr key={v.id} onClick={() => navigate(`/vulnerabilities/${v.cve_id}`)} className="border-b border-gray-800 cursor-pointer hover:bg-gray-800">
                            <td className="p-3 text-sm font-mono text-gray-300">{v.cve_id}</td>
                            <td className="p-3">
                            <span className={`text-xs font-mono px-2 py-1 rounded ${severityColor[v.severity]}`}>
                                {v.severity}
                            </span>
                            </td>
                            <td className="p-3 text-sm font-mono text-gray-300">{v.cvss_score}</td>
                            <td className="p-3 text-sm font-mono text-gray-300 max-w-xs truncate">
                            {v.description}
                            </td>
                            <td className="p-3 text-sm font-mono text-gray-300">{v.source}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}


export default ThreatFeed