import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const IndicatorChart = ({ data }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 w-full">
            <p className="text-green-500 font-mono text-xs tracking-widest mb-4">// IOC TYPES</p>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    layout="horizontal" // Bars grow from down to up
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >

                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#378add" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#378add" stopOpacity={0.2}/>
                        </linearGradient>
                    </defs>

                    <XAxis 
                        dataKey="type" 
                        type="category"
                        stroke="#4b5563" 
                        tick={{ fontFamily: 'monospace', fontSize: 11, fill: '#9ca3af' }} 
                    />
                    <YAxis 
                        type="number"
                        stroke="#4b5563" 
                        tick={{ fontFamily: 'monospace', fontSize: 11, fill: '#9ca3af' }} 
                    />
                    <Tooltip 
                        cursor={{ fill: '#1f2937' }}
                        contentStyle={{ 
                            background: '#111827', 
                            border: '1px solid #1f2937', 
                            fontFamily: 'monospace', 
                            fontSize: '12px',
                            
                        }} 
                        labelStyle={{ color: '#9ca3af', marginBottom: '4px'}}
                        itemStyle={{ color: '#378add', paddingTop: '0px' }}
                    />
                    <Bar 
                        dataKey="count" 
                        fill="url(#barGradient)" 
                        radius={[4, 4, 0, 0]} // Rounds the top edges
                        barSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IndicatorChart;