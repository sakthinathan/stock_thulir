"use client";

import { useStockStore } from '@/store/useStockStore';
import { 
  LayoutDashboard, 
  FileUp, 
  FileDown, 
  Settings, 
  LogOut, 
  Package, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Sidebar() {
  const { logout, fullDataset, currentView, setCurrentView } = useStockStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: 'inventory', icon: <Database size={20} />, label: "Inventory" },
    { id: 'analytics', icon: <Activity size={20} />, label: "Analytics" },
    { id: 'settings', icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="glass h-screen sticky top-0 z-50 border-r border-white/40 flex flex-col transition-all duration-500 ease-in-out shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)]"
    >
      {/* Logo Section */}
      <div className="p-6 mb-8 flex items-center gap-4 overflow-hidden">
        <div className="min-w-[40px] h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
          <Package size={24} strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="whitespace-nowrap"
            >
              <h1 className="text-xl font-black text-slate-900 tracking-tighter">StockPro</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Cognitive Audit</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setCurrentView(item.id as any)}
            className={`
              w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
              ${currentView === item.id 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}
            `}
          >
            <div className="min-w-[20px]">{item.icon}</div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-black text-xs uppercase tracking-widest"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Active Indicator */}
            {currentView === item.id && !isCollapsed && (
              <motion.div 
                layoutId="active-pill"
                className="absolute right-4 w-1.5 h-1.5 bg-indigo-400 rounded-full"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Actions Section */}
      <div className="p-4 space-y-2 mb-4">
        {fullDataset.length > 0 && (
          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-4 px-4 py-3.5 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all group overflow-hidden"
          >
            <FileDown size={20} />
            {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">Export Data</span>}
          </button>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">Exit Portal</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Footer Branding */}
      {!isCollapsed && (
        <div className="p-8 text-center opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">System v2.5.0</p>
        </div>
      )}
    </motion.aside>
  );
}
