import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Sliders, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  List, 
  Grid, 
  X, 
  Package, 
  User, 
  Calendar,
  AlertCircle,
  Truck,
  CheckSquare
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const OperationsView = ({ viewMode, setViewMode, preselectedOpType, onResetOpType }) => {
  const { operations, products, warehouses, createOperation, updateOperationStatus, filters, setFilters } = useInventory();

  const [activeSubTab, setActiveSubTab] = useState(preselectedOpType || 'All'); // 'All', 'Receipt', 'Delivery', 'Internal', 'Adjustment'
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Operation Form state
  const [opType, setOpType] = useState('Receipt');
  const [fromLoc, setFromLoc] = useState('Vendor - Apex Steel Inc.');
  const [toLoc, setToLoc] = useState('WH/Main');
  const [contact, setContact] = useState('Apex Steel Inc.');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState('50');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Filtered list
  const filteredOps = operations.filter((op) => {
    // Type Filter
    let targetType = activeSubTab;
    if (filters.docType !== 'All') {
      if (filters.docType === 'Receipts') targetType = 'Receipt';
      if (filters.docType === 'Delivery') targetType = 'Delivery';
      if (filters.docType === 'Internal') targetType = 'Internal';
      if (filters.docType === 'Adjustments') targetType = 'Adjustment';
    }

    if (targetType !== 'All' && op.type !== targetType) return false;

    // Status Filter
    const activeStatus = filters.status !== 'All' ? filters.status : statusFilter;
    if (activeStatus !== 'All' && op.status !== activeStatus) return false;

    // Search Query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchRef = op.ref.toLowerCase().includes(q);
      const matchContact = op.contact ? op.contact.toLowerCase().includes(q) : false;
      const matchFrom = op.from.toLowerCase().includes(q);
      const matchTo = op.to.toLowerCase().includes(q);
      if (!matchRef && !matchContact && !matchFrom && !matchTo) return false;
    }

    return true;
  });

  const handleOpenModal = (type = 'Receipt') => {
    setOpType(type);
    if (type === 'Receipt') {
      setFromLoc('Vendor - Apex Steel Inc.');
      setToLoc('WH/Main');
      setContact('Apex Steel Inc.');
    } else if (type === 'Delivery') {
      setFromLoc('WH/Stock1');
      setToLoc('Customer - Azure Interior');
      setContact('Azure Interior');
    } else if (type === 'Internal') {
      setFromLoc('WH/Main');
      setToLoc('Production Floor');
      setContact('Internal Production');
    } else if (type === 'Adjustment') {
      setFromLoc('WH/Main');
      setToLoc('Inventory Difference');
      setContact('Quality Control');
    }
    setIsModalOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId) || products[0];

    const opData = {
      type: opType,
      from: fromLoc,
      to: toLoc,
      contact,
      scheduledDate,
      status: 'Ready',
      items: [{ productId: prod.id, productName: prod.name, qty: Number(qty), uom: prod.uom }],
      notes
    };

    createOperation(opData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {activeSubTab === 'All' && 'All Inventory Operations'}
              {activeSubTab === 'Receipt' && 'Receipts (Incoming Stock)'}
              {activeSubTab === 'Delivery' && 'Delivery Orders (Outgoing Stock)'}
              {activeSubTab === 'Internal' && 'Internal Stock Transfers'}
              {activeSubTab === 'Adjustment' && 'Inventory Adjustments'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pick, pack, receive, transfer and validate stock movements across warehouses
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => handleOpenModal('Receipt')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>NEW Receipt</span>
          </button>
          <button
            onClick={() => handleOpenModal('Delivery')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center space-x-1.5 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>NEW Delivery</span>
          </button>
          <button
            onClick={() => handleOpenModal('Internal')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>NEW Transfer</span>
          </button>
        </div>
      </div>

      {/* OPERATIONS SUB-TABS & STATUS FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        
        {/* Operation Sub-Tabs */}
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 w-full lg:w-auto overflow-x-auto">
          {[
            { id: 'All', label: 'All Ops' },
            { id: 'Receipt', label: 'Receipts (IN)' },
            { id: 'Delivery', label: 'Delivery (OUT)' },
            { id: 'Internal', label: 'Internal (INT)' },
            { id: 'Adjustment', label: 'Adjustments (ADJ)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setFilters((f) => ({ ...f, docType: tab.id === 'All' ? 'All' : tab.id === 'Receipt' ? 'Receipts' : tab.id }));
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                (activeSubTab === tab.id || (filters.docType === tab.id || (filters.docType === 'Receipts' && tab.id === 'Receipt')))
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center space-x-2 w-full lg:w-auto overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400">Status:</span>
          {['All', 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-slate-700 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* OPERATIONS LIST VIEW (EXACT MATCH TO EXCALIDRAW MOCKUP SCREENSHOT) */}
      {viewMode === 'list' ? (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">From</th>
                  <th className="py-3.5 px-4">To</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Scheduled Date</th>
                  <th className="py-3.5 px-4">Items / Qty</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                {filteredOps.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Reference (e.g. WH/OUT/0001) */}
                    <td className="py-4 px-4 font-mono font-bold text-blue-400 flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        op.type === 'Receipt' ? 'bg-emerald-400' :
                        op.type === 'Delivery' ? 'bg-blue-400' :
                        op.type === 'Internal' ? 'bg-purple-400' : 'bg-amber-400'
                      }`}></span>
                      <span>{op.ref}</span>
                    </td>

                    {/* From */}
                    <td className="py-4 px-4 font-medium text-slate-300">{op.from}</td>

                    {/* To */}
                    <td className="py-4 px-4 font-medium text-slate-300">{op.to}</td>

                    {/* Contact (e.g. Azure Interior) */}
                    <td className="py-4 px-4 text-slate-300">{op.contact}</td>

                    {/* Scheduled Date */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{op.scheduledDate}</td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      {op.items.map((item, idx) => (
                        <div key={idx} className="text-slate-200 font-semibold">
                          {item.productName}: <span className="text-amber-400">{item.qty} {item.uom}</span>
                        </div>
                      ))}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        op.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        op.status === 'Ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        op.status === 'Waiting' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {op.status}
                      </span>
                    </td>

                    {/* Workflow Action (Pick -> Pack -> Validate) */}
                    <td className="py-4 px-4 text-right">
                      {op.status === 'Draft' && (
                        <button
                          onClick={() => updateOperationStatus(op.id, 'Waiting')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px]"
                        >
                          Mark Ready
                        </button>
                      )}

                      {op.status === 'Waiting' && (
                        <button
                          onClick={() => updateOperationStatus(op.id, 'Ready')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                        >
                          Pick & Pack
                        </button>
                      )}

                      {op.status === 'Ready' && (
                        <button
                          onClick={() => updateOperationStatus(op.id, 'Done')}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-lg shadow-emerald-600/30 animate-pulse"
                        >
                          Validate Stock Change
                        </button>
                      )}

                      {op.status === 'Done' && (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Validated & Logged</span>
                        </span>
                      )}
                    </td>

                  </tr>
                ))}

                {filteredOps.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      No inventory operations found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN / CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOps.map((op) => (
            <div 
              key={op.id}
              className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-sm text-blue-400">{op.ref}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    op.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400' :
                    op.status === 'Ready' ? 'bg-blue-500/20 text-blue-400' :
                    op.status === 'Waiting' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {op.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p><strong>From:</strong> {op.from}</p>
                  <p><strong>To:</strong> {op.to}</p>
                  <p><strong>Contact:</strong> {op.contact}</p>
                  <p><strong>Scheduled:</strong> {op.scheduledDate}</p>
                </div>

                <div className="mt-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Stock Items:</p>
                  {op.items.map((it, idx) => (
                    <div key={idx} className="text-xs font-bold text-white flex justify-between">
                      <span>{it.productName}</span>
                      <span className="text-amber-400">{it.qty} {it.uom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-right">
                {op.status !== 'Done' ? (
                  <button
                    onClick={() => updateOperationStatus(op.id, 'Done')}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Validate & Update Stock
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Stock Movement Completed</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW OPERATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-4">
              Create New {opType} Operation
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Operation Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Receipt', 'Delivery', 'Internal'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleOpenModal(t)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        opType === t
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">From Location / Source *</label>
                  <input
                    type="text"
                    required
                    value={fromLoc}
                    onChange={(e) => setFromLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">To Destination / Location *</label>
                  <input
                    type="text"
                    required
                    value={toLoc}
                    onChange={(e) => setToLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Contact Name (Supplier / Customer)</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <p className="font-bold text-blue-400 flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>Operation Line Items</span>
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-1">Select Product</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-bold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku}) - Avail: {p.totalStock} {p.uom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-bold text-base"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg"
              >
                Create Operation & Schedule Workflow
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
