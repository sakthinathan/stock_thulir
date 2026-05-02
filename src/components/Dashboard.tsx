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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <FileSpreadsheet size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">StockPro</h1>
          </div>
          <div className="flex items-center gap-4">
            {fullDataset.length > 0 && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Download Report</span>
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {fullDataset.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-[60vh] flex flex-col items-center justify-center text-center"
          >
            <FileUpload />
          </motion.div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              <div className="lg:col-span-3 space-y-6">
                <SummaryCards />
                <StockTable />
              </div>
              <div className="lg:col-span-1">
                <Filters />
              </div>
            </motion.div>
          </>
        )}
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} StockPro Inventory Management. All rights reserved.
      </footer>
    </div>
  );
}
