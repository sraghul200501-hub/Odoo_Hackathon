import React, { useState } from 'react';
import { KeyRound, Mail, UserCheck, ShieldCheck, ArrowRight, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
export const AuthModal = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, addToast } = useInventory();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Inventory Manager');
  
  // OTP State
  const [otpStep, setOtpStep] = useState(1); // 1: Send Email, 2: Enter OTP, 3: Reset Password
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  if (!isOpen) return null;
  const handleQuickLogin = (selectedRole) => {
    setCurrentUser({
      name: selectedRole === 'Inventory Manager' ? 'Raghul S (Manager)' : 'Alex Rivera (Warehouse Staff)',
      email: selectedRole === 'Inventory Manager' ? 'manager@stocksense.io' : 'staff@stocksense.io',
      role: selectedRole,
      avatar: selectedRole === 'Inventory Manager' ? 'RM' : 'WS',
      isLoggedIn: true
    });
    addToast(`Logged in successfully as ${selectedRole}`);
    onClose();
  };
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpStep(2);
    addToast(`OTP Code sent to ${email} (Demo Code: ${code})`, 'info');
  };
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered === generatedOtp || entered === '1234') {
      setOtpStep(3);
      addToast('OTP verified successfully!');
    } else {
      addToast('Invalid OTP Code! Try 1234 or generated code', 'error');
    }
  };
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    addToast('Password reset successfully! You can now log in.');
    setAuthMode('login');
    setOtpStep(1);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create StockSense Account'}
            {authMode === 'forgot' && 'Reset Password with OTP'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login' && 'Sign in to access real-time inventory management'}
            {authMode === 'signup' && 'Register your warehouse team member'}
            {authMode === 'forgot' && 'OTP-based security verification system'}
          </p>
        </div>
        {/* Quick Demo Login Preset Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
            ⚡ Quick Hackathon Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('Inventory Manager')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Login Manager</span>
            </button>
            <button
              onClick={() => handleQuickLogin('Warehouse Staff')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Login Staff</span>
            </button>
          </div>
        </div>
        {/* Auth Forms */}
        {authMode === 'login' && (
          <form onSubmit={(e) => { e.preventDefault(); handleQuickLogin(role); }} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="manager@stocksense.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
