"use client";

import { motion } from 'framer-motion';
import { useStockStore } from '@/store/useStockStore';
import FileUpload from './FileUpload';
import StockTable from './StockTable';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import { LogOut, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const { logout, fullDataset, filteredDataset } = useStockStore();

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(fullDataset);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
    XLSX.writeFile(wb, `Stock_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 selection:bg-indigo-100 flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-rose-100/20 rounded-full blur-[150px] pointer-events-none" 
      />
      
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-8 py-5 border-b border-white/40 shadow-xl shadow-slate-200/20">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 rounded-[1.25rem] text-white shadow-2xl shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FileSpreadsheet size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">StockPro</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] leading-none">Intelligence Audit</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {fullDataset.length > 0 && (
              <button
                onClick={handleDownload}
                className="shimmer flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-slate-300 active:scale-95"
              >
                <Download size={16} strokeWidth={3} />
                <span>Export Analytics</span>
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-600 px-5 py-3 rounded-2xl hover:bg-rose-50 transition-all font-black text-xs uppercase tracking-widest"
            >
              <LogOut size={16} strokeWidth={3} />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 sm:p-10 lg:p-12 space-y-12 relative z-10">
        {fullDataset.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="min-h-[70vh] flex flex-col items-center justify-center"
          >
            <FileUpload />
          </motion.div>
        ) : (
          <div className="space-y-12">
            <SummaryCards />
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start">
              <div className="xl:col-span-3">
                <StockTable />
              </div>
              <div className="xl:col-span-1 sticky top-32">
                <Filters />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10" />
        <div className="flex items-center justify-center gap-4 mb-4 opacity-30">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-slate-400" />
          <div className="bg-slate-400 p-1 rounded-full" />
          <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-slate-400" />
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} StockPro Cognitive Systems &bull; v2.5.0
        </p>
      </footer>
    </div>
  );
}
