"use client";

import { useStockStore } from '@/store/useStockStore';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StockTable() {
  const { 
    filteredDataset, 
    visibleHeaders, 
    sortConfig, 
    setSortConfig, 
    updateRow,
    fullDataset
  } = useStockStore();

  const handleSort = (column: string) => {
    const isAsc = sortConfig.column === column && sortConfig.direction === 'asc';
    setSortConfig({ column: column as any, direction: isAsc ? 'desc' : 'asc' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excess': return 'text-emerald-600 bg-emerald-50';
      case 'Shortage': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto max-h-[700px] scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
            <tr>
              {visibleHeaders.map((header) => (
                <th 
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.column === header && (
                      <span className="text-indigo-600">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode='popLayout'>
              {filteredDataset.map((row) => {
                const originalIndex = fullDataset.findIndex(r => r["Parent SKU"] === row["Parent SKU"]);
                
                return (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={row["Parent SKU"]}
                    className="hover:bg-slate-50/50 transition-colors group relative"
                  >
                    {visibleHeaders.map((header) => {
                      if (header === "Actual CBB") {
                        return (
                          <td key={header} className="px-6 py-4">
                            <div className="relative w-28 group/input">
                              <input
                                type="number"
                                defaultValue={row[header] || 0}
                                onBlur={(e) => updateRow(originalIndex, parseFloat(e.target.value) || 0, row["Actual PKT"] || 0)}
                                className="w-full px-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-black text-slate-900 shadow-inner"
                              />
                            </div>
                          </td>
                        );
                      }
                      if (header === "Actual PKT") {
                        return (
                          <td key={header} className="px-6 py-4">
                            <div className="relative w-28 group/input">
                              <input
                                type="number"
                                defaultValue={row[header] || 0}
                                onBlur={(e) => updateRow(originalIndex, row["Actual CBB"] || 0, parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-black text-slate-900 shadow-inner"
                              />
                            </div>
                          </td>
                        );
                      }
                      if (header === "Status") {
                        const status = row[header] || 'Equal';
                        return (
                          <td key={header} className="px-6 py-4">
                            <span className={`
                              inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                              ${status === 'Excess' ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-100' : 
                                status === 'Shortage' ? 'bg-rose-100 text-rose-700 shadow-sm shadow-rose-100' : 
                                'bg-slate-100 text-slate-500'}
                            `}>
                              {status}
                            </span>
                          </td>
                        );
                      }
                      
                      const isNumeric = typeof row[header] === 'number';
                      const isDifference = header.includes('Difference');
                      const isSKU = header === "Parent SKU";
                      const isDesc = header === "Parent SKU Desc";
                      
                      const diffColor = isDifference ? (row[header] > 0 ? 'text-emerald-600' : row[header] < 0 ? 'text-rose-600' : 'text-slate-400') : '';
                      
                      let displayValue = row[header];
                      if (isNumeric && isNaN(displayValue)) {
                        displayValue = '0.00';
                      }

                      return (
                        <td key={header} className={`
                          px-6 py-4 text-sm
                          ${isSKU ? 'font-black text-slate-900 tracking-tight' : ''}
                          ${isDesc ? 'font-medium text-slate-600 max-w-[200px] truncate' : ''}
                          ${isNumeric ? 'font-mono' : ''}
                          ${diffColor}
                        `}>
                          {isNumeric && isDifference && displayValue !== 0 ? (displayValue > 0 ? `+${displayValue}` : displayValue) : displayValue}
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {filteredDataset.length === 0 && (
        <div className="py-32 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-slate-200">🔍</span>
          </div>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching inventory records</p>
        </div>
      )}
    </div>
  );
}
