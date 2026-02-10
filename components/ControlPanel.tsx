
import React from 'react';
import { Search, Globe, MapPin, Layers, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
import { getTimezoneOffset, formatOffset } from '../services/geoService';

interface ControlPanelProps {
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  tzids: string[];
  loading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ viewState, setViewState, tzids, loading }) => {
  const currentOffset = getTimezoneOffset(viewState.selectedTzid);

  const toggleSelected = () => {
    setViewState(prev => ({ ...prev, showSelectedArea: !prev.showSelectedArea }));
  };

  const toggleGmt = () => {
    setViewState(prev => ({ ...prev, showGmtArea: !prev.showGmtArea }));
  };

  const handleTzChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewState(prev => ({ ...prev, selectedTzid: e.target.value }));
  };

  return (
    <div className="w-full md:w-96 h-full bg-slate-800 border-r border-slate-700 flex flex-col shadow-xl z-10">
      <div className="p-6 border-b border-slate-700 space-y-2">
        <div className="flex items-center gap-3">
          <Globe className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold text-white tracking-tight">Timezone Explorer</h1>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Visualize boundaries from the <span className="text-slate-300 font-medium">timezone-boundary-builder</span> project.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Selector Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
            <Search size={16} /> Select Timezone
          </label>
          <div className="relative group">
            <select
              value={viewState.selectedTzid}
              onChange={handleTzChange}
              disabled={loading}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {tzids.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-1">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Current Base Offset</div>
            <div className="text-2xl font-bold text-blue-400">
              {formatOffset(currentOffset)}
            </div>
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="space-y-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
            <Layers size={16} /> Visualization Layers
          </label>

          {/* Toggle Selected */}
          <button
            onClick={toggleSelected}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              viewState.showSelectedArea 
                ? 'bg-blue-500/10 border-blue-500/50 text-white' 
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-sm">Zone Boundary</span>
              <span className="text-xs opacity-70">Highlight {viewState.selectedTzid}</span>
            </div>
            {viewState.showSelectedArea ? <ToggleRight className="text-blue-400" size={32} /> : <ToggleLeft size={32} />}
          </button>

          {/* Toggle GMT Group */}
          <button
            onClick={toggleGmt}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              viewState.showGmtArea 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white' 
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-sm">Offset Area</span>
              <span className="text-xs opacity-70 text-emerald-300/80">Highlight all {formatOffset(currentOffset)} zones</span>
            </div>
            {viewState.showGmtArea ? <ToggleRight className="text-emerald-400" size={32} /> : <ToggleLeft size={32} />}
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-slate-700 text-[10px] text-slate-500 font-medium uppercase text-center space-y-1">
        <div>Data: Evansiroky / Natural Earth</div>
        <div>Visualizer Engine: React + D3</div>
      </div>
    </div>
  );
};

export default ControlPanel;
