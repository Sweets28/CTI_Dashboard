import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getThreatActor } from "../api";
import ReactMarkdown from 'react-markdown';

const ThreatActorDetail = () => {
    const { stix_id } = useParams();
    const [actor, setActor] = useState(null);
    const [error, setError] = useState(false);
    
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_VISIBLE_ITEMS = 12; 

    useEffect(() => {
        let isMounted = true;
        getThreatActor(stix_id)
            .then(res => { if (isMounted) setActor(res.data); })
            .catch(err => { if (isMounted) setError(true); });
        return () => { isMounted = false; };
    }, [stix_id]);

    if (error) return <div className="p-6 text-red-500 font-mono text-center">ERROR_ACTOR_NOT_FOUND</div>;
    if (!actor) return <div className="p-6 text-gray-500 font-mono text-center animate-pulse">LOADING_DATA...</div>;

    const cleanDescription = actor.description?.split('(Citation:')[0].trim();
    const hasManyTTPs = actor.techniques?.length > MAX_VISIBLE_ITEMS;

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-6xl mx-auto bg-gray-950 min-h-screen text-gray-300">
            
            {/* --- HEADER BLOCK --- */}
            <header className="bg-gray-900 border-l-4 border-red-600 p-6 rounded shadow-xl">
                <p className="text-red-500 font-mono text-[10px] tracking-[0.3em] mb-1">UNCLASSIFIED // CTI_REPORT</p>
                <h1 className="text-white font-mono text-3xl font-black uppercase tracking-tight">{actor.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                    <span className="text-gray-500 font-mono text-[10px] bg-black px-2 py-0.5 rounded border border-gray-800">
                        UID: {actor.stix_id}
                    </span>
                    <span className="text-green-600 font-mono text-[10px] uppercase">Status: Active_Threat</span>
                </div>
            </header>

            {/* --- TOP ROW: ALIASES & SOFTWARE --- */}
            <div className="flex flex-col md:flex-row gap-4">
                <section className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded">
                    <h3 className="text-gray-500 font-mono font-bold text-[10px] mb-3 border-b border-gray-800 pb-1 uppercase">Known Aliases</h3>
                    <p className="text-gray-300 font-mono text-sm italic">{actor.aliases || "N/A"}</p>
                </section>

                <section className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded">
                    <h3 className="text-gray-500 font-mono font-bold text-[10px] mb-3 border-b border-gray-800 pb-1 uppercase">Associated Tooling</h3>
                    <div className="flex flex-wrap gap-2">
                        {actor.software?.length > 0 ? (
                            actor.software.map((sw, i) => (
                                <span key={i} className={`px-2 py-0.5 rounded-sm font-mono text-[10px] border ${
                                    sw.sw_type === 'malware' 
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                }`}>
                                    {sw.name}
                                </span>
                            ))
                        ) : <span className="text-gray-600 text-[10px]">No software detected.</span>}
                    </div>
                </section>
            </div>

            {/* --- MAIN CONTENT: INTEL DESCRIPTION --- */}
            <main className="bg-gray-900 border border-gray-800 p-6 rounded">
                <h3 className="text-gray-500 font-mono font-bold text-[10px] mb-4 border-b border-gray-800 pb-1 uppercase">Intelligence Summary</h3>
                <div className="text-gray-400 font-mono text-sm leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{cleanDescription}</ReactMarkdown>
                </div>
            </main>

            {/* --- TTPs SECTION --- */}
            <section className="bg-gray-900 border border-gray-800 p-4 rounded">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-1">
                    <h3 className="text-gray-500 font-mono font-bold text-[10px] uppercase tracking-widest">
                        Tactical Capabilities (TTPs)
                    </h3>
                    <span className="text-gray-600 font-mono text-[10px]">OBJS_LOADED: {actor.techniques?.length || 0}</span>
                </div>

                <div className={`relative overflow-hidden transition-all duration-500 ${!isExpanded && hasManyTTPs ? 'max-h-64' : 'max-h-fit'}`}>
                    <div className="flex flex-wrap gap-2">
                        {actor.techniques?.length > 0 ? (
                            actor.techniques.map((tech, index) => (
                                <div key={index} className="flex items-center bg-black/40 border border-gray-800 rounded group hover:border-red-500/50 transition-all overflow-hidden shrink-0">
                                    <span className="bg-gray-800 text-red-500 font-mono text-[10px] px-2 py-2 w-24 shrink-0 text-center border-r border-gray-700 font-bold group-hover:bg-red-950/20 transition-colors">
                                        {tech.mitre_id}
                                    </span>
                                    <span className="px-3 py-2 text-gray-400 font-mono text-[11px] group-hover:text-white" title={tech.name}>
                                        {tech.name}
                                    </span>
                                </div>
                            ))
                        ) : <p className="text-gray-600 text-xs">Zero techniques archived.</p>}
                    </div>

                    {/* Gradient Fade Overlay */}
                    {!isExpanded && hasManyTTPs && (
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
                    )}
                </div>

                {hasManyTTPs && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full mt-3 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-500 hover:text-green-500 font-mono text-[10px] transition-all border-t border-gray-800"
                    >
                        {isExpanded ? "[ CLOSE_DATA_SET ]" : `[ DECRYPT_ALL_${actor.techniques.length}_TECHNIQUES ]`}
                    </button>
                )}
            </section>

            {/* --- FOOTER --- */}
            <footer className="text-center py-4">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em]">
                    Source: {actor.source || "MITRE ATT&CK"} // Secure_Connection: Established
                </p>
            </footer>
        </div>
    );
}

export default ThreatActorDetail;