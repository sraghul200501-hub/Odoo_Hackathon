import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { OperationsView } from './components/OperationsView';
import { ProductManagement } from './components/ProductManagement';
import { MoveHistoryView } from './components/MoveHistoryView';
import { SettingsView } from './components/SettingsView';
import { AICopilotView } from './components/AICopilotView';
import { SmartScannerView } from './components/SmartScannerView';
import { SpatialHeatmapView } from './components/SpatialHeatmapView';
import { AuthModal } from './components/AuthModal';
import { DemoScenarioModal } from './components/DemoScenarioModal';
import { StockSenseChatbot } from './components/StockSenseChatbot';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts } = useInventory();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right-5 fade-in duration-300"
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {t.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
          <p className="text-xs font-semibold leading-relaxed">{t.message}</p>
        </div>
      ))}
    </div>
  );
};

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  
  // Quick preselected modal trigger
  const [preselectedOpType, setPreselectedOpType] = useState(null);

  const handleOpenNewOpModal = (type, prod = null) => {
    setPreselectedOpType(type);
    setActiveTab('operations');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      {/* Main Body View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onOpenNewOpModal={handleOpenNewOpModal} 
          />
        )}

        {activeTab === 'operations' && (
          <OperationsView
            viewMode={viewMode}
            setViewMode={setViewMode}
            preselectedOpType={preselectedOpType}
            onResetOpType={() => setPreselectedOpType(null)}
          />
        )}

        {activeTab === 'products' && (
          <ProductManagement onOpenNewOpModal={handleOpenNewOpModal} />
        )}

        {activeTab === 'moveHistory' && <MoveHistoryView />}

        {activeTab === 'settings' && <SettingsView />}

        {/* UNIQUE HACKATHON MODULES */}
        {activeTab === 'aiCopilot' && (
          <AICopilotView onOpenNewOpModal={handleOpenNewOpModal} />
        )}

        {activeTab === 'smartScanner' && (
          <SmartScannerView setActiveTab={setActiveTab} />
        )}

        {activeTab === 'spatialHeatmap' && (
          <SpatialHeatmapView setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-300">StockSense Modular IMS v2.4</span>
            <span>• Hackathon Innovation Edition</span>
          </div>
          <p>© 2026 Team StockSense. Built for Real-time Warehouse & Inventory Automation.</p>
        </div>
      </footer>

      {/* Modals, Floating Chatbot & Toasts */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <DemoScenarioModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
        setActiveTab={setActiveTab}
      />
      <StockSenseChatbot />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainContent />
    </InventoryProvider>
  );
}
