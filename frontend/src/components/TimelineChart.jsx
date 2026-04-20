import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const TimelineChart = ({ data }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-green-500 font-mono text-xs tracking-widest mb-4">// CVEs OVER TIME</p>
      <LineChart width={600} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="month" stroke="#4b5563" tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#9ca3af' }} />
        <YAxis stroke="#4b5563" tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#9ca3af' }} />
        <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', fontFamily: 'monospace', fontSize: '12px' }} />
        <Line type="monotone" dataKey="count" stroke="#5dcaa5" strokeWidth={2} dot={false} />
      </LineChart>
    </div>
  )
}

export default TimelineChart