
export const COLORS = {
  LAND: '#1e293b',
  BOUNDARY: '#334155',
  SELECTED: '#3b82f6', // blue-500
  GMT_GROUP: '#10b981', // emerald-500
  HOVER: '#475569',
  WATER: '#0f172a'
};

export const DEFAULT_TZ = 'America/Sao_Paulo';

// Simplified GeoJSON source for performance in demo context
// In a real production app, we would use a tiled solution or optimized topojson
export const GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_time_zones.geojson';
