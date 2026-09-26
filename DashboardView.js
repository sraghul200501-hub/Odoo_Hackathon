import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Filter, 
  TrendingUp, 
  Layers, 
  Warehouse, 
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { useInventory } from '../context/InventoryContext';
export const DashboardView = ({ setActiveTab, onOpenNewOpModal }) => {
  const { products, operations, warehouses, filters, setFilters, updateOperationStatus } = useInventory();
  // Calculation of KPIs
  const totalProductsCount = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const lowStockItems = products.filter((p) => (p.totalStock || 0) <= (p.minReorder || 15));
  
  const pendingReceipts = operations.filter((o) => o.type === 'Receipt' && o.status !== 'Done' && o.status !== 'Canceled');
  const pendingDeliveries = operations.filter((o) => o.type === 'Delivery' && o.status !== 'Done' && o.status !== 'Canceled');
  const internalTransfersScheduled = operations.filter((o) => o.type === 'Internal' && o.status !== 'Done' && o.status !== 'Canceled');
  // Filtered operations based on dynamic filters
  const filteredOps = operations.filter((op) => {
    if (filters.docType !== 'All' && op.type !== filters.docType.replace('s', '')) return false;
    if (filters.status !== 'All' && op.status !== filters.status) return false;
    if (filters.warehouse !== 'All' && op.from !== filters.warehouse && op.to !== filters.warehouse) return false;
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
  // Chart Data preparation
  const categoryDataMap = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.totalStock;
    return acc;
  }, {});
  const categoryChartData = Object.keys(categoryDataMap).map((cat) => ({
    name: cat,
    stock: categoryDataMap[cat]
  }));
  const statusDistribution = [
    { name: 'Ready', value: operations.filter((o) => o.status === 'Ready').length, color: '#3b82f6' },
    { name: 'Waiting', value: operations.filter((o) => o.status === 'Waiting').length, color: '#f59e0b' },
    { name: 'Done', value: operations.filter((o) => o.status === 'Done').length, color: '#10b981' },
    { name: 'Draft', value: operations.filter((o) => o.status === 'Draft').length, color: '#64748b' }
  ];
  const BAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>Inventory Operations Dashboard</span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
              Live IMS
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time digitised tracking, stock ledger, multi-location workflow management
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={() => onOpenNewOpModal('Receipt')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ New Receipt</span>
          </button>
          <button
            onClick={() => onOpenNewOpModal('Delivery')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ New Delivery</span>
          </button>
        </div>
      </div>
      {/* KPI CARDS (Requirements fulfilled: Total Products, Low Stock, Pending Receipts, Pending Deliveries, Internal Transfers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Products */}
        <div 
          onClick={() => setActiveTab('products')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalProductsCount}</span>
            <span className="text-xs text-slate-400 ml-2">({totalStockUnits} units total)</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-400 font-medium flex items-center space-x-1">
            <span>View Catalogue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {/* KPI 2: Low Stock / Out of Stock Items */}
        <div 
          onClick={() => setActiveTab('products')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low / Out of Stock</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-400">{lowStockItems.length}</span>
            <span className="text-xs text-slate-400 ml-2">items below threshold</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-medium flex items-center space-x-1">
            <span>Action Required</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {/* KPI 3: Pending Receipts */}
        <div 
          onClick={() => { setFilters({ ...filters, docType: 'Receipts' }); setActiveTab('operations'); }}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Receipts</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">{pendingReceipts.length}</span>
            <span className="text-xs text-slate-400 ml-2">incoming goods</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
            <span>Process Stock In</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {/* KPI 4: Pending Deliveries */}
        <div 
          onClick={() => { setFilters({ ...filters, docType: 'Delivery' }); setActiveTab('operations'); }}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Deliveries</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-indigo-400">{pendingDeliveries.length}</span>
            <span className="text-xs text-slate-400 ml-2">outgoing shipments</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-400 font-medium flex items-center space-x-1">
            <span>Process Delivery</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {/* KPI 5: Internal Transfers Scheduled */}
        <div 
          onClick={() => { setFilters({ ...filters, docType: 'Internal' }); setActiveTab('operations'); }}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Internal Transfers</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-400">{internalTransfersScheduled.length}</span>
            <span className="text-xs text-slate-400 ml-2">in-house moves</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-400 font-medium flex items-center space-x-1">
            <span>View Transfers</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
      {/* DYNAMIC FILTERS BAR (Doc Type, Status, Warehouse, Category) */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2 mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Dynamic IMS Operational Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Document Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Document Type</label>
            <select
              value={filters.docType}
              onChange={(e) => setFilters({ ...filters, docType: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Document Types</option>
              <option value="Receipts">Receipts (Incoming)</option>
              <option value="Delivery">Delivery Orders (Outgoing)</option>
              <option value="Internal">Internal Transfers</option>
              <option value="Adjustments">Inventory Adjustments</option>
            </select>
          </div>
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          {/* Warehouse Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Warehouse / Location</label>
            <select
              value={filters.warehouse}
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Warehouses & Locations</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.code}>
                  {wh.code} - {wh.name}
                </option>
              ))}
            </select>
          </div>
          {/* Product Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Product Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Product Categories</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Furniture">Furniture</option>
              <option value="Components">Components</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>
        </div>
      </div>
      {/* CHARTS & RECENT OPERATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Stock Level by Category */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Stock Quantities by Category</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Aggregated inventory levels across categories</p>
          </div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Chart 2: Operations Status Distribution */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Operation Status Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Breakdown of operational states</p>
          </div>
          <div className="h-48 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-[11px] text-slate-400">
            {statusDistribution.map((st) => (
              <div key={st.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }}></span>
                <span>{st.name} ({st.value})</span>
              </div>
            ))}
          </div>
        </div>
        {/* Low Stock Alerts Box */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-amber-400 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Stock Warning Board</span>
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                {lowStockItems.length} Alert{lowStockItems.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Items requiring immediate reordering</p>
          </div>
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {lowStockItems.map((prod) => (
              <div 
                key={prod.id}
                className="p-3 bg-slate-800/80 rounded-xl border border-amber-500/30 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-100">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-amber-400">
                    {prod.totalStock} / {prod.minReorder} {prod.uom}
                  </p>
                  <button 
                    onClick={() => onOpenNewOpModal('Receipt', prod)}
                    className="mt-1 text-[10px] text-blue-400 hover:underline font-semibold"
                  >
                    + Reorder Now
                  </button>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                All product stock levels are healthy!
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="w-full mt-3 py-2 text-center text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-colors"
          >
            Manage Product Catalog & Reordering Rules
          </button>
        </div>
      </div>
      {/* FILTERED RECENT OPERATIONS LIST */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Live Stock Operations Feed</h3>
            <p className="text-xs text-slate-400">Real-time status of receipts, deliveries, internal moves & adjustments</p>
          </div>
          <button
            onClick={() => setActiveTab('operations')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Open Operations View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Operation Type</th>
                <th className="py-3 px-4">From Location</th>
                <th className="py-3 px-4">To Location / Contact</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredOps.slice(0, 8).map((op) => (
                <tr key={op.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{op.ref}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      op.type === 'Receipt' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      op.type === 'Delivery' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      op.type === 'Internal' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {op.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-300">{op.from}</td>
                  <td className="py-3 px-4 text-slate-300">{op.to || op.contact}</td>
                  <td className="py-3 px-4 text-slate-400">{op.scheduledDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      op.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400' :
                      op.status === 'Ready' ? 'bg-blue-500/20 text-blue-400' :
                      op.status === 'Waiting' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {op.status !== 'Done' ? (
                      <button
                        onClick={() => updateOperationStatus(op.id, 'Done')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm transition-all"
                      >
                        Validate
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center justify-end space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Validated</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredOps.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No operations match the selected dynamic filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
