import React, { useState } from 'react';
import { Settings, Warehouse, Plus, CheckCircle2, User, MapPin, Layers, Shield } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const SettingsView = () => {
  const { warehouses, addWarehouse } = useInventory();
  const [isAddingWh, setIsAddingWh] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');
  const [capacity, setCapacity] = useState('5000');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !name) return;
    addWarehouse({ code, name, manager: manager || 'Unassigned', capacity: Number(capacity) });
    setCode('');
    setName('');
    setManager('');
    setIsAddingWh(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <Settings className="w-7 h-7 text-blue-400" />
            <span>Warehouse & Location Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-warehouse nodes, production racks, internal storage locations & capacity targets
          </p>
        </div>

        <button
          onClick={() => setIsAddingWh(!isAddingWh)}
          className="mt-4 sm:mt-0 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Warehouse / Rack Node</span>
        </button>
      </div>

      {/* Add Warehouse Form */}
      {isAddingWh && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-blue-500/40 shadow-xl animate-in slide-in-from-top-4">
          <h3 className="text-base font-bold text-white mb-4">Register New Location Node</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Code (e.g., WH/RackC)</label>
              <input
                type="text"
                required
                placeholder="WH/RackC"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location Name</label>
              <input
                type="text"
                required
                placeholder="Rack C - Electronic Assembly"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Warehouse Manager</label>
              <input
                type="text"
                placeholder="Sarah Chen"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Capacity (Units)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div className="sm:col-span-4 flex justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingWh(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save Location Node
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Warehouse Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {warehouses.map((wh) => (
          <div 
            key={wh.id}
            className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-black text-base text-blue-400">{wh.code}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{wh.name}</h3>

              <div className="space-y-2 text-xs text-slate-300 mt-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Manager: <strong className="text-white">{wh.manager}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Warehouse className="w-4 h-4 text-slate-400" />
                  <span>Storage Capacity: <strong className="text-amber-400">{wh.capacity} units</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sync Verified</span>
              </span>
              <button className="text-blue-400 hover:underline font-semibold">Configure Racks</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
