import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ArrowRight, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import confetti from 'canvas-confetti';
export const DemoScenarioModal = ({ isOpen, onClose, setActiveTab }) => {
  const { products, operations, createOperation, updateOperationStatus, processStockAdjustment, addToast } = useInventory();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [stepLogs, setStepLogs] = useState([]);
  if (!isOpen) return null;
  const steps = [
    {
      title: 'Step 1: Receive Goods from Vendor',
      desc: 'Receive 100 kg Steel Rods into WH/Main',
      actionText: 'Execute Step 1 (+100 kg Steel)',
      detail: 'Creates a Receipt (WH/IN) for 100 kg Steel Rods from Apex Steel Inc. and automatically validates stock increase (+100 kg total stock).'
    },
    {
      title: 'Step 2: Move to Production Rack',
      desc: 'Internal Transfer: WH/Main -> Production Floor (40 kg)',
      actionText: 'Execute Step 2 (Internal Transfer)',
      detail: 'Transfers 40 kg Steel Rods from WH/Main to Production Floor. Total stock remains 100 kg, location breakdown updates instantly!'
    },
    {
      title: 'Step 3: Deliver Finished Goods',
      desc: 'Deliver 20 units Ergonomic Chairs to Customer',
      actionText: 'Execute Step 3 (Ship Out -20 units)',
      detail: 'Picks, packs, and validates Delivery Order (WH/OUT) reducing Ergonomic Office Chairs by 20 units.'
    },
    {
      title: 'Step 4: Adjust Damaged Items',
      desc: 'Stock Count Fix: Write off 3 kg damaged steel',
      actionText: 'Execute Step 4 (Physical Adjustment -3 kg)',
      detail: 'Simulates warehouse audit count finding 3 kg damaged steel rods. System auto-updates stock to 97 kg and logs audit in Stock Ledger!'
    }
  ];
  const handleRunStep = (stepIdx) => {
    setIsExecuting(true);
    setTimeout(() => {
      if (stepIdx === 0) {
        // Step 1: Receive Goods
        const newOp = createOperation({
          type: 'Receipt',
          from: 'Vendor - Apex Steel Inc.',
          to: 'WH/Main',
          contact: 'Apex Steel Inc.',
          scheduledDate: new Date().toISOString().split('T')[0],
          status: 'Ready',
          items: [{ productId: 'prod-1', productName: 'Steel Rods', qty: 100, uom: 'kg' }],
          notes: 'Hackathon Demo Step 1: Incoming vendor shipment'
        });
        updateOperationStatus(newOp.id, 'Done');
        setStepLogs((prev) => [...prev, 'Step 1 COMPLETED: Received +100 kg Steel Rods into WH/Main. Stock updated.']);
      } else if (stepIdx === 1) {
        // Step 2: Internal Transfer
        const newOp = createOperation({
          type: 'Internal',
          from: 'WH/Main',
          to: 'Production Floor',
          contact: 'Internal Move',
          scheduledDate: new Date().toISOString().split('T')[0],
          status: 'Ready',
          items: [{ productId: 'prod-1', productName: 'Steel Rods', qty: 40, uom: 'kg' }],
          notes: 'Hackathon Demo Step 2: Main Store -> Production Rack'
        });
        updateOperationStatus(newOp.id, 'Done');
        setStepLogs((prev) => [...prev, 'Step 2 COMPLETED: Transferred 40 kg Steel Rods to Production Floor. Total unchanged, location updated.']);
      } else if (stepIdx === 2) {
        // Step 3: Deliver Finished Goods
        const newOp = createOperation({
          type: 'Delivery',
          from: 'WH/Main',
          to: 'Customer - Azure Interior',
          contact: 'Azure Interior',
          scheduledDate: new Date().toISOString().split('T')[0],
          status: 'Ready',
          items: [{ productId: 'prod-2', productName: 'Ergonomic Office Chair', qty: 20, uom: 'units' }],
          notes: 'Hackathon Demo Step 3: Deliver 20 chairs'
        });
        updateOperationStatus(newOp.id, 'Done');
        setStepLogs((prev) => [...prev, 'Step 3 COMPLETED: Delivered 20 Chairs to Azure Interior. Stock reduced by 20 units.']);
      } else if (stepIdx === 3) {
        // Step 4: Adjust damaged items
        processStockAdjustment('prod-1', 'WH/Main', 57, '3 kg damaged during handling write-off');
        setStepLogs((prev) => [...prev, 'Step 4 COMPLETED: Physical count audit: 3 kg damaged steel written off. Logged in Stock Ledger!']);
        
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (err) {}
      }
      setCurrentStep(stepIdx + 1);
      setIsExecuting(false);
    }, 600);
  };
  const handleRunAll = () => {
    setStepLogs([]);
    setCurrentStep(0);
    let delay = 0;
    [0, 1, 2, 3].forEach((idx) => {
      setTimeout(() => {
        handleRunStep(idx);
      }, delay);
      delay += 1200;
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">StockSense Interactive Problem Statement Flow</h2>
            <p className="text-xs text-slate-400">Automated 4-Step Inventory Walkthrough (Live Demonstration)</p>
          </div>
        </div>
        {/* Run All Button */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-emerald-400">⚡ Fast 1-Click Automated Scenario</p>
            <p className="text-[11px] text-slate-400">Executes all 4 steps in real-time sequence and updates stock ledger automatically</p>
          </div>
          <button
            onClick={handleRunAll}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Auto Run All 4 Steps</span>
          </button>
        </div>
        {/* Step Cards */}
        <div className="space-y-3">
          {steps.map((st, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone ? 'bg-slate-800/40 border-emerald-500/40' :
                  isCurrent ? 'bg-slate-800 border-blue-500 shadow-lg' : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-500 text-slate-950' :
                      isCurrent ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{st.title}</h4>
                      <p className="text-xs text-slate-400">{st.desc}</p>
                    </div>
                  </div>
                  {!isDone && (
                    <button
                      onClick={() => handleRunStep(idx)}
                      disabled={isExecuting}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    >
                      {st.actionText}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 bg-slate-900/70 p-2 rounded-xl border border-slate-800/80">
                  {st.detail}
                </p>
              </div>
            );
          })}
        </div>
        {/* Execution Log */}
        {stepLogs.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <p className="font-bold text-emerald-400 mb-2">Real-Time Execution Logs:</p>
            <div className="space-y-1 text-slate-300">
              {stepLogs.map((log, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Footer actions */}
        <div className="mt-6 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              onClose();
              setActiveTab('moveHistory');
            }}
            className="text-blue-400 hover:underline font-bold"
          >
            View Full Stock Movement Ledger →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
          >
            Close Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
};
