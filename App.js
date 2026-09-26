import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { OperationsView } from './components/OperationsView';
import { ProductManagement } from './components/ProductManagement';
import { MoveHistoryView } from './components/MoveHistoryView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { DemoScenarioModal } from './components/DemoScenarioModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
function App() {
  const [count, setCount] = useState(0)
const ToastContainer = () => {
  const { toasts } = useInventory();
  if (toasts.length === 0) return null;
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
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
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
      ))}
    </div>
  );
};
      <div className="ticks"></div>
const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  
  // Quick preselected modal trigger
  const [preselectedOpType, setPreselectedOpType] = useState(null);
      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
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
      </main>
      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-300">StockSense Modular IMS v2.4</span>
            <span>• Hackathon Edition</span>
          </div>
          <p>© 2026 Team StockSense. Built for Real-time Warehouse & Inventory Automation.</p>
        </div>
