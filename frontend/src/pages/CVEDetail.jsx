import { useParams } from "react-router-dom";
import { getVulnerability } from "../api";
import { useState, useEffect } from "react";

const CVEDetail = () => {
    const { cve_id } = useParams();
    const [vuln, setVuln] = useState(null);
    const [error, setError] = useState(false);

    const severityColors = {
        LOW: 'text-green-400 border-green-900/50 bg-green-900/10',
        MEDIUM: 'text-blue-400 border-blue-900/50 bg-blue-900/10',
        HIGH: 'text-amber-500 border-amber-900/50 bg-amber-900/10',
        CRITICAL: 'text-red-500 border-red-900/50 bg-red-900/10'
    };

    useEffect(() => {
        let isMounted = true;
        getVulnerability(cve_id)
            .then(res => { if (isMounted) setVuln(res.data); })
            .catch(err => { if (isMounted) setError(true); });
        return () => { isMounted = false; };
    }, [cve_id]);

    if (error) return <div className="p-6 text-red-500 font-mono text-center">ERROR_CVE_NOT_FOUND</div>;
    if (!vuln) return <div className="p-6 text-gray-500 font-mono text-center animate-pulse">SYNCING_CVE_DATA...</div>;

    const severityStyle = severityColors[vuln.severity?.toUpperCase()] || 'text-gray-400 border-gray-800 bg-gray-900';

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-5xl mx-auto bg-gray-950 min-h-screen text-gray-300">
            
            {/* --- HEADER BLOCK --- */}
            <header className="bg-gray-900 border-l-4 border-amber-600 p-6 rounded shadow-xl">
                <p className="text-amber-500 font-mono text-[10px] tracking-[0.3em] mb-1">VULNERABILITY // CVE_RECORD</p>
                <h1 className="text-white font-mono text-3xl font-black uppercase tracking-tight">{vuln.cve_id}</h1>
                <div className="flex items-center space-x-4 mt-2">
                    <span className="text-gray-500 font-mono text-[10px] bg-black px-2 py-0.5 rounded border border-gray-800">
                        NVD_REF: {vuln.id}
                    </span>
                    <span className="text-blue-500 font-mono text-[10px] uppercase tracking-tighter">Status: Verified_Vulnerability</span>
                </div>
            </header>

            {/* --- SCORE CARD ROW --- */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Severity Card */}
                <section className={`flex-1 border p-4 rounded flex flex-col justify-center items-center ${severityStyle}`}>
                    <h3 className="text-[10px] font-mono font-bold mb-1 uppercase opacity-70">Calculated Severity</h3>
                    <p className="text-2xl font-black font-mono tracking-tighter">{vuln.severity || "UNKNOWN"}</p>
                </section>

                {/* CVSS Card */}
                <section className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded flex flex-col justify-center items-center">
                    <h3 className="text-gray-500 font-mono font-bold text-[10px] mb-1 uppercase">CVSS v3.1 Score</h3>
                    <p className="text-2xl text-white font-mono font-black">{vuln.cvss_score?.toFixed(1) ?? '0.0'}</p>
                </section>

                {/* Date Card */}
                <section className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded flex flex-col justify-center items-center">
                    <h3 className="text-gray-500 font-mono font-bold text-[10px] mb-1 uppercase">Disclosure Date</h3>
                    <p className="text-white font-mono text-sm uppercase">
                        {vuln.published_date 
                            ? new Date(vuln.published_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'N/A'}
                    </p>
                </section>
            </div>

            {/* --- MAIN CONTENT: DESCRIPTION --- */}
            <main className="bg-gray-900 border border-gray-800 p-6 rounded relative overflow-hidden">
                {/* Decorative background ID */}
                <div className="absolute top-0 right-0 opacity-[0.03] text-8xl font-black font-mono select-none -mr-4 -mt-4">
                    {vuln.cve_id.split('-')[2]}
                </div>
                
                <h3 className="text-gray-500 font-mono font-bold text-[10px] mb-4 border-b border-gray-800 pb-1 uppercase tracking-widest">Technical Summary</h3>
                <p className="text-gray-300 font-mono text-sm leading-relaxed relative z-10">
                    {vuln.description || "No technical breakdown available for this record."}
                </p>
            </main>

            {/* --- SOURCE FOOTER --- */}
            <footer className="bg-gray-900/50 border border-gray-800 p-4 rounded flex justify-between items-center">
                <div>
                    <p className="text-gray-500 font-mono text-[10px] uppercase">Official Source</p>
                    <p className="text-green-500 font-mono text-xs font-bold uppercase tracking-widest">{vuln.source || "NIST National Vulnerability Database"}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600 font-mono text-[9px] uppercase tracking-tighter">Connection: Encrypted_Auth</p>
                    <p className="text-gray-600 font-mono text-[9px] uppercase tracking-tighter">Access: Lvl_4_Analyst</p>
                </div>
            </footer>
        </div>
    );
}

export default CVEDetail;