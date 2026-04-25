import React from 'react';
import { Chart } from 'react-google-charts';

const WorldMap = ({ data }) => {
  // 1. Format data for Google Charts: [ ['Country', 'Attacks'], ['US', 10], ... ]
  // Google Geochart natively understands Alpha-2 codes (US, FR, etc.)
  const chartData = [
    ['Country', 'Attacks'],
    ...data.map(d => [d.country.toUpperCase(), d.count])
  ];

  const options = {
    // Background of the map area
    backgroundColor: '#111827', // Tailwind gray-900 to match your container
    
    // Dataless regions (countries with 0 attacks)
    datalessRegionColor: '#1a2535', 
    
    // The color gradient: from your dark base to neon green
    colorAxis: { 
      colors: ['#1a2535', '#00ff88'],
      minValue: 0 
    },
    
    // Border lines between countries
    defaultColor: '#1a2535',
    keepAspectRatio: true,
    legend: 'none', // We'll keep your custom CSS legend below
    tooltip: { 
      textStyle: { color: '#006400', fontName: 'monospace' },
      showColorCode: true 
    },
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-green-500 font-mono text-xs tracking-widest mb-4">
        // TARGETED COUNTRIES
      </p>
      
      <div className="w-full flex justify-center overflow-hidden">
        <Chart
          chartType="GeoChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
          // Note: Google Charts requires a small delay to load the library
          loader={<div className="text-gray-600 font-mono text-xs">INITIALIZING SATELLITE UPLINK...</div>}
        />
      </div>

      {/* Your original CSS Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="font-mono text-xs text-gray-600">LOW</span>
        <div 
          className="flex-1 h-2 rounded" 
          style={{ background: 'linear-gradient(to right, #1a2535, #00ff88)' }}
        ></div>
        <span className="font-mono text-xs text-gray-600">HIGH</span>
      </div>
    </div>
  );
};

export default WorldMap;
