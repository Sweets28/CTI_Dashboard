import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";


const IndicatorChart = ({ data }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-green-500 font-mono text-xs tracking-widest mb-4">// IOC TYPES</p>
            <BarChart
                width={300}
                height={250}
                data={data}
                layout="vertical"
            >
            <XAxis type="number" stroke="#4b5563" tick={{ fontFamily: 'monospace', fontSize: 11, fill: '#9ca3af' }} />
            <YAxis type="category" dataKey="type" stroke="#4b5563" tick={{ fontFamily: 'monospace', fontSize: 11, fill: '#9ca3af' }} width={80} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', fontFamily: 'monospace', fontSize: '12px' }} />
            <Bar dataKey="count" fill="#378add" radius={[0, 4, 4, 0]} />

            </BarChart>
        </div>
    )
}

export default IndicatorChart