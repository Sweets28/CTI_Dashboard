import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts'


const COLORS = {
    CRITICAL: '#e24b4a',
    HIGH: '#ef9f27',
    MEDIUM: '#378add',
    LOW: '#5dcaa5',
    null: '#6b7280'
}
const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const SeverityChart =({ data }) => {
    const filtered = data.filter(d => validSeverities.includes(d.severity))
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 w-full">
            <p className="text-green-500 font-mono text-xs tracking-widest mb-4">// CVE SEVERITY</p>
            <PieChart width={300} height={250}>
                <Pie
                    data={filtered}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey='count'
                    nameKey='severity'
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[entry.severity] || '#6b7280'}/>
                    ))}
                </Pie>
                    <Tooltip contentStyle={{background: "#111827", border: '1px solid #1f2937', fontFamily: 'monospace', fontSize: '12px'}}/>
                    <Legend layout="vertical" verticalAlign='middle' align='right' formatter={(value) => <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af'}}>{value}</span>}/>
            </PieChart>
        </div>
    )
}


export default SeverityChart