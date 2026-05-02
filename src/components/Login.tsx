"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStockStore } from '@/store/useStockStore';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useStockStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 relative overflow-hidden group">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
          
          <div className="text-center mb-10">
            <div className="inline-flex bg-indigo-600 p-4 rounded-[1.5rem] text-white shadow-xl shadow-indigo-200 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Lock size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">StockPro</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] mt-2">Enterprise Audit Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Identifier</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(false); }}
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Encrypted Access</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 shadow-inner"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-rose-100"
              >
                <AlertCircle size={16} />
                Invalid credentials
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="mt-8 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            Restricted Access System
          </p>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase opacity-50">
          &copy; {new Date().getFullYear()} StockPro Systems &bull; All Rights Reserved
        </p>
      </motion.div>
    </div>
  );
}
