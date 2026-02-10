
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { TimezoneCollection, ViewState } from '../types';
import { COLORS } from '../constants';
import { getTimezoneOffset } from '../services/geoService';

interface TimezoneMapProps {
  data: TimezoneCollection;
  viewState: ViewState;
  onTzidSelect: (tzid: string) => void;
}

const TimezoneMap: React.FC<TimezoneMapProps> = ({ data, viewState, onTzidSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize offset for the selected timezone to avoid recalculating during renders
  const selectedOffset = useMemo(() => {
    return getTimezoneOffset(viewState.selectedTzid);
  }, [viewState.selectedTzid]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear previous render

    const g = svg.append('g');

    // Projection & Path
    const projection = d3.geoEquirectangular()
      .scale(width / (2 * Math.PI))
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Zooming
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Render Timezones
    g.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('class', 'timezone-path transition-colors duration-300')
      .attr('fill', (d) => {
        const tzid = d.properties.tzid || d.properties.name;
        
        // Highlight logic
        if (viewState.showSelectedArea && tzid === viewState.selectedTzid) {
          return COLORS.SELECTED;
        }

        if (viewState.showGmtArea) {
          const featureOffset = getTimezoneOffset(tzid);
          if (featureOffset === selectedOffset) {
            return COLORS.GMT_GROUP;
          }
        }

        return COLORS.LAND;
      })
      .attr('stroke', COLORS.BOUNDARY)
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function() {
        d3.select(this).attr('stroke-width', 1.5).attr('stroke', '#ffffff');
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('stroke-width', 0.5).attr('stroke', COLORS.BOUNDARY);
      })
      .on('click', (event, d) => {
        const tzid = d.properties.tzid || d.properties.name;
        onTzidSelect(tzid);
      })
      .append('title')
      .text((d) => d.properties.tzid || d.properties.name);

    // Initial scale to fit
    const bounds = path.bounds(data as any);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

  }, [data, viewState, selectedOffset, onTzidSelect]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 overflow-hidden relative">
      <svg ref={svgRef} className="block w-full h-full" />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 p-4 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl pointer-events-none space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          <span className="text-slate-300">Other Timezones</span>
        </div>
        {viewState.showSelectedArea && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-300">Selected: {viewState.selectedTzid}</span>
          </div>
        )}
        {viewState.showGmtArea && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-slate-300">Same Offset (GMT{selectedOffset >= 0 ? '+' : ''}{selectedOffset})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneMap;
