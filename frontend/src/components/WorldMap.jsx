import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const WorldMap = ({ data }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    const countryMap = {}
    data.forEach(d => { countryMap[d.country.toLowerCase()] = d.count })

    const width = 800
    const height = 400

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const projection = d3.geoNaturalEarth1()
      .scale(140)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    const maxCount = Math.max(...data.map(d => d.count), 1)
    const color = d3.scaleSequential()
      .domain([0, maxCount])
      .interpolator(d3.interpolate('#1a2535', '#00ff88'))

    // fetch both topology and country names
    Promise.all([
      d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
      d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    ]).then(([world]) => {
      const countries = topojson.feature(world, world.objects.countries)

      // build id -> name lookup from nato names
      const nameById = {}
      countries.features.forEach(f => {
        if (f.properties?.name) {
          nameById[f.id] = f.properties.name
        }
      })

      svg.selectAll('path')
        .data(countries.features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => {
          const name = (d.properties?.name || '').toLowerCase()
          return countryMap[name] ? color(countryMap[name]) : '#1a2535'
        })
        .attr('stroke', '#2a3550')
        .attr('stroke-width', 0.5)
        .append('title')
        .text(d => {
          const name = d.properties?.name || ''
          const count = countryMap[name.toLowerCase()] || 0
          return `${name}: ${count} attacks`
        })
    })
  }, [data])

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-green-500 font-mono text-xs tracking-widest mb-4">// TARGETED COUNTRIES</p>
      <svg ref={svgRef} width="100%" viewBox="0 0 800 400" />
      <div className="flex items-center gap-2 mt-3">
        <span className="font-mono text-xs text-gray-600">LOW</span>
        <div className="flex-1 h-2 rounded" style={{background: 'linear-gradient(to right, #1a2535, #00ff88)'}}></div>
        <span className="font-mono text-xs text-gray-600">HIGH</span>
      </div>
    </div>
  )
}

export default WorldMap

