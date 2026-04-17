import React from "react"


const colorMap = {
  red: 'text-red-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
}

// then use it:


const MetricCard = ({
    label, value, delta, color
}) => {
    return (
        <div className="bg-teal-950 border border-teal-700 rounded-lg p-4">
            <p className="text-xs text-teal-800">{label}</p>
            <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
            <p className="text-xs text-teal-800">{delta}</p>
        </div>
    )

}

export default MetricCard