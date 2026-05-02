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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 flex flex-col relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-6 py-4 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">StockPro</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-tight">Intelligence Audit</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {fullDataset.length > 0 && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                <Download size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all font-bold text-sm"
            >
              <LogOut size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 space-y-8 relative z-10">
        {fullDataset.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="min-h-[70vh] flex flex-col items-center justify-center"
          >
            <FileUpload />
          </motion.div>
        ) : (
          <div className="space-y-8">
            <SummaryCards />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
            >
              <div className="lg:col-span-3">
                <StockTable />
              </div>
              <div className="lg:col-span-1 sticky top-32">
                <Filters />
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="py-10 text-center text-slate-400 text-xs font-medium tracking-wide uppercase">
        <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
          <div className="w-10 h-[1px] bg-slate-300" />
          <span className="px-2 italic tracking-tighter lowercase">powered by antigravity</span>
          <div className="w-10 h-[1px] bg-slate-300" />
        </div>
        &copy; {new Date().getFullYear()} StockPro Systems &bull; Version 2.0.4
      </footer>
    </div>
  );
}
