"use client";

import { motion } from 'framer-motion';
import { useStockStore } from '@/store/useStockStore';
import FileUpload from './FileUpload';
import StockTable from './StockTable';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import Sidebar from './Sidebar';
import InventoryView from './InventoryView';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';
import { LogOut, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const { fullDataset, currentView } = useStockStore();

  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <InventoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
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
        );
    }
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(fullDataset);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
    XLSX.writeFile(wb, `Stock_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 selection:bg-indigo-100 flex relative">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
        
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
            renderView()
          )}
        </main>

        <footer className="py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10" />
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} StockPro Cognitive Systems & bull; v2.5.0
          </p>
        </footer>
      </div>
    </div>
  );
}
