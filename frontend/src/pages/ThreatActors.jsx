import React from "react";
import { useState, useEffect } from "react";
import { getThreatActors, getThreatActorsCount } from "../api";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown'; // 1. Import Markdown

const ThreatActors = () => {
    const [actors, setActors] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 20;
    const navigate = useNavigate();

    useEffect(() => {
        getThreatActorsCount()
            .then(res => setTotalPages(Math.ceil(res.data.count / LIMIT)))
            .catch(err => console.error(err));
    }, []);
    
    useEffect(() => {
        getThreatActors((page - 1) * LIMIT, LIMIT)
            .then(res => setActors(res.data))
            .catch(err => console.error(err));
    }, [page]);

    const onPrev = () => setPage(p => Math.max(1, p - 1));
    const onNext = () => setPage(p => Math.min(totalPages, p + 1));

    const filtered = actors.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.aliases?.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Helper to clean table descriptions
    const formatDescription = (text) => {
        if (!text) return "";
        return text.split('(Citation:')[0].trim();
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg w-full">
            <div className="p-4 border-b border-gray-800">
                <p className="font-mono text-xs tracking-widest text-green-500">// THREAT ACTORS</p>
            </div>
            
            <div className="p-4">
                <input 
                    type='text' 
                    placeholder='Search current page...' 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className='w-full mb-4 px-4 py-2 bg-gray-900 border border-gray-800 rounded font-mono text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-700'
                />
            </div>

            <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-teal-950
                [&::-webkit-scrollbar-thumb]:bg-teal-500
                [&::-webkit-scrollbar-thumb]:rounded-full max-h-96">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800 text-left">
                            <th className="p-3 text-xs text-gray-500 font-mono">NAME</th>
                            <th className="p-3 text-xs text-gray-500 font-mono w-96">ALIASES</th>
                            <th className="p-3 text-xs text-gray-500 font-mono">DESCRIPTION</th>
                            <th className="p-3 text-xs text-gray-500 font-mono">SOURCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map(a => (
                                <tr 
                                    key={a.id} 
                                    onClick={() => navigate(`/actors/${a.stix_id}`)} 
                                    className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
                                >
                                    <td className="p-3 text-sm font-mono text-gray-300 whitespace-nowrap">{a.name}</td>
                                    <td className="p-3 text-sm font-mono text-gray-300 italic opacity-70">
                                        {Array.isArray(a.aliases) ? a.aliases.join(', ') : a.aliases}
                                    </td>
                                    {/* 3. Rendered Markdown in Table Cell */}
                                    <td className="p-3 text-xs font-mono text-gray-400 max-w-xl">
                                        <div className="line-clamp-2 prose prose-invert prose-xs max-w-none pointer-events-none">
                                            <ReactMarkdown 
                                                allowedElements={['p', 'a', 'strong', 'em']}
                                                unwrapDisallowed={true}
                                            >
                                                {formatDescription(a.description)}
                                            </ReactMarkdown>
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm font-mono text-gray-300">{a.source}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-600 font-mono text-sm">
                                    No actors found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={onPrev}
                onNext={onNext}
            />
        </div>
    );
};

export default ThreatActors;