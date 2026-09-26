import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Layers, 
  Warehouse, 
  Sliders, 
  AlertTriangle, 
  Edit3, 
  Check, 
  X,
  MapPin,
  TrendingDown
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const ProductManagement = ({ onOpenNewOpModal }) => {
  const { products, saveProduct, processStockAdjustment, warehouses } = useInventory();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [uom, setUom] = useState('kg');
  const [initialStock, setInitialStock] = useState('50');
  const [minReorder, setMinReorder] = useState('20');
  const [maxReorder, setMaxReorder] = useState('200');
  const [targetWarehouse, setTargetWarehouse] = useState('WH/Main');

  // Stock Adjustment Drawer/Modal state
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [adjLocation, setAdjLocation] = useState('WH/Main');
  const [adjCountedQty, setAdjCountedQty] = useState('');
  const [adjReason, setAdjReason] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setName(prod.name);
      setSku(prod.sku);
      setCategory(prod.category);
      setUom(prod.uom);
      setMinReorder(prod.minReorder || 20);
      setMaxReorder(prod.maxReorder || 200);
    } else {
      setEditingProduct(null);
      setName('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('Raw Materials');
      setUom('kg');
      setInitialStock('50');
      setMinReorder('20');
      setMaxReorder('200');
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editingProduct ? editingProduct.id : null,
      name,
      sku,
      category,
      uom,
      minReorder: Number(minReorder),
      maxReorder: Number(maxReorder),
      initialStock: Number(initialStock),
      locations: editingProduct ? editingProduct.locations : { [targetWarehouse]: Number(initialStock) }
    };

    saveProduct(payload);
    setIsModalOpen(false);
  };

  const handleAdjustmentSubmit = (e) => {
    e.preventDefault();
    if (!adjustingProduct || adjCountedQty === '') return;
    processStockAdjustment(adjustingProduct.id, adjLocation, Number(adjCountedQty), adjReason);
    setAdjustingProduct(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <Package className="w-7 h-7 text-blue-400" />
            <span>Product Master Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage SKU codes, category rules, reorder thresholds & per-warehouse stock distribution
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal()}
          className="mt-4 sm:mt-0 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Raw Materials', 'Furniture', 'Components', 'Hardware'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Location Breakdown</th>
                <th className="py-3.5 px-4">Reordering Rule</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredProducts.map((prod) => {
                const isLow = prod.totalStock <= prod.minReorder;
                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{prod.name}</span>
                        {isLow && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">{prod.sku}</td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {prod.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`text-sm font-black ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {prod.totalStock} {prod.uom}
                      </span>
                    </td>

                    {/* Stock availability per location */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {Object.entries(prod.locations || {}).map(([loc, count]) => (
                          <span key={loc} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300 flex items-center space-x-1">
                            <MapPin className="w-2.5 h-2.5 text-blue-400" />
                            <span>{loc}: <strong className="text-white">{count}</strong></span>
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      Min: <span className="font-bold text-slate-200">{prod.minReorder}</span> | Max: <span className="font-bold text-slate-200">{prod.maxReorder}</span> {prod.uom}
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      {/* Physical count count adjustment button */}
                      <button
                        onClick={() => {
                          setAdjustingProduct(prod);
                          setAdjLocation(Object.keys(prod.locations)[0] || 'WH/Main');
                          setAdjCountedQty(prod.locations[Object.keys(prod.locations)[0]] || 0);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-semibold text-[11px] border border-amber-500/30 transition-all"
                        title="Count & Adjust Physical Stock"
                      >
                        Adjust
                      </button>

                      <button
                        onClick={() => handleOpenCreateModal(prod)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] border border-slate-700 transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
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
              {editingProduct ? 'Edit Product & Reordering Rules' : 'Create New Product Master'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steel Rods 12mm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Components">Components</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unit of Measure (UOM)</label>
                  <select
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="units">units</option>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="boxes">boxes</option>
                    <option value="meters">meters</option>
                  </select>
                </div>

                {!editingProduct && (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Initial Stock</label>
                    <input
                      type="number"
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {!editingProduct && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Initial Warehouse Location</label>
                  <select
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.code}>{wh.code} - {wh.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reordering Rules Section */}
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <p className="font-bold text-blue-400 flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Reordering Threshold Rules</span>
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Minimum Stock Alert Threshold</label>
                    <input
                      type="number"
                      value={minReorder}
                      onChange={(e) => setMinReorder(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Maximum Stock Target</label>
                    <input
                      type="number"
                      value={maxReorder}
                      onChange={(e) => setMaxReorder(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product Master Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <button 
              onClick={() => setAdjustingProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-white mb-2">
              Physical Stock Count Adjustment
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Item: <strong className="text-white">{adjustingProduct.name}</strong> ({adjustingProduct.sku})
            </p>

            <form onSubmit={handleAdjustmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Location</label>
                <select
                  value={adjLocation}
                  onChange={(e) => {
                    setAdjLocation(e.target.value);
                    setAdjCountedQty(adjustingProduct.locations[e.target.value] || 0);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                >
                  {Object.keys(adjustingProduct.locations).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
                <span className="text-slate-400">Currently Recorded Stock:</span>
                <span className="font-bold text-blue-400 text-sm">
                  {adjustingProduct.locations[adjLocation] || 0} {adjustingProduct.uom}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Physical Count Quantity *</label>
                <input
                  type="number"
                  required
                  value={adjCountedQty}
                  onChange={(e) => setAdjCountedQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  placeholder="e.g. 3 kg damaged during handling / Audit variance"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-lg"
              >
                Validate & Log Stock Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
