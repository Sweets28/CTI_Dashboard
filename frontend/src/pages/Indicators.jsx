import React from "react";
import { useState, useEffect } from "react";
import { getIndicators, getIndicatorsCount } from "../api";
import Pagination from "../components/Pagination";


const Indicators = () => {
    const [indicators, setIndicators] = useState([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const LIMIT = 20


      useEffect(() => {
        getIndicatorsCount()
            .then(res => setTotalPages(Math.ceil(res.data.count / LIMIT)))
            .catch(err => console.error(err))
      }, [])

    useEffect(() => {
        getIndicators((page - 1) * LIMIT, LIMIT).then(res => setIndicators(res.data)).catch(err => console.error(err))
    }, [page])


    const onPrev = () => setPage(p => p - 1)
    const onNext = () => setPage(p => p + 1)

    const filtered = indicators.filter( i =>
        i.pattern?.toLowerCase().includes(search.toLowerCase()) ||
        i.pattern_type?.toLowerCase().includes(search.toLowerCase()) ||
        i.source?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg w-full">
            <div className="p-4 border-b border-gray-800">
                <p className="text-gray-4 font-mono text-xs tracking-widest text-green-500">// INDICATORS</p>
            </div>
            <input type='text' placeholder='Search Indicators...' value={search} onChange={e => setSearch(e.target.value)} className='w-full mb-4 px-4 py-2 bg-gray-900 border border-gray-800 rounded font-mono text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-700'/>
             <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-teal-950
                [&::-webkit-scrollbar-thumb]:bg-teal-500
                [&::-webkit-scrollbar-thumb]:rounded-full max-h-96">
            <table className="w-full">
                <thead>
                    <tr className="border-b  border-gray-800">
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">PATTERN</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">PATTERN TYPE</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">VALID FROM</th>
                        <th className="text-left p-3 text-xs text-gray-500 font-mono">SOURCE</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(i => (
                        <tr key={i.stix_id} className="border-b cursor-pointer border-gray-800 hover:bg-gray-800">
                            <td className="p-3 text-sm font-mono text-gray-300">{i.pattern}</td>
                            <td className="p-3 text-sm font-mono text-gray-300">{i.pattern_type}</td>
                            <td className="p-3 text-sm font-mono text-gray-300">{i.valid_from}</td>
                            <td className="p-3 text-sm font-mono text-gray-300">{i.source}</td>
                        </tr>
                    ))}
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
    )
}


export default Indicators