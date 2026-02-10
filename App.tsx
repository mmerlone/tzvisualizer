
import React, { useState, useEffect, useMemo } from 'react';
import TimezoneMap from './components/TimezoneMap';
import ControlPanel from './components/ControlPanel';
import { TimezoneCollection, ViewState } from './types';
import { GEOJSON_URL, DEFAULT_TZ } from './constants';
import { fetchTimezoneData } from './services/geoService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<TimezoneCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    selectedTzid: DEFAULT_TZ,
    showSelectedArea: true,
    showGmtArea: true,
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const geojson = await fetchTimezoneData(GEOJSON_URL);
        setData(geojson);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Extract unique TZIDs for the selector
  const tzids = useMemo(() => {
    if (!data) return [];
    const ids = data.features.map(f => f.properties.tzid || f.properties.name);
    return Array.from(new Set(ids)).sort();
  }, [data]);

  const handleTzidSelect = (tzid: string) => {
    setViewState(prev => ({ ...prev, selectedTzid: tzid }));
  };

  if (error) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-2xl font-bold">Failed to load Map Data</h2>
        <p className="text-slate-400 max-w-md text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-950">
      <ControlPanel 
        viewState={viewState} 
        setViewState={setViewState} 
        tzids={tzids} 
        loading={loading}
      />
      
      <main className="flex-1 relative bg-slate-900">
        {loading ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-slate-400 font-medium animate-pulse">Fetching global timezone boundaries...</p>
          </div>
        ) : data && (
          <TimezoneMap 
            data={data} 
            viewState={viewState} 
            onTzidSelect={handleTzidSelect} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
