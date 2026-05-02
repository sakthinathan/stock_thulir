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
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden"
    >
      <div className="overflow-x-auto max-h-[750px] scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 sticky top-0 z-20">
            <tr>
              {visibleHeaders.map((header) => (
                <th 
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-colors border-b border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.column === header && (
                      <span className="text-indigo-400">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            <AnimatePresence mode='popLayout'>
              {filteredDataset.map((row, idx) => {
                const originalIndex = fullDataset.findIndex(r => r["Parent SKU"] === row["Parent SKU"]);
                
                return (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    key={row["Parent SKU"]}
                    className="hover:bg-white/80 transition-all group relative cursor-default"
                  >
                    {visibleHeaders.map((header) => {
                      if (header === "Actual CBB") {
                        return (
                          <td key={header} className="px-8 py-5">
                            <div className="relative w-32 group/input">
                              <input
                                type="number"
                                defaultValue={row[header] || 0}
                                onBlur={(e) => updateRow(originalIndex, parseFloat(e.target.value) || 0, row["Actual PKT"] || 0)}
                                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-black text-slate-900 shadow-inner"
                              />
                            </div>
                          </td>
                        );
                      }
                      if (header === "Actual PKT") {
                        return (
                          <td key={header} className="px-8 py-5">
                            <div className="relative w-32 group/input">
                              <input
                                type="number"
                                defaultValue={row[header] || 0}
                                onBlur={(e) => updateRow(originalIndex, row["Actual CBB"] || 0, parseFloat(e.target.value) || 0)}
                                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-black text-slate-900 shadow-inner"
                              />
                            </div>
                          </td>
                        );
                      }
                      if (header === "Status") {
                        const status = row[header] || 'Equal';
                        return (
                          <td key={header} className="px-8 py-5">
                            <span className={`
                              inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm
                              ${status === 'Excess' ? 'bg-emerald-500 text-white glow-emerald' : 
                                status === 'Shortage' ? 'bg-rose-500 text-white glow-rose' : 
                                'bg-slate-100 text-slate-400'}
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
                      
                      const diffColor = isDifference ? (row[header] > 0 ? 'text-emerald-600 font-black' : row[header] < 0 ? 'text-rose-600 font-black' : 'text-slate-300') : '';
                      
                      let displayValue = row[header];
                      if (isNumeric && isNaN(displayValue)) displayValue = '0.00';

                      return (
                        <td key={header} className={`
                          px-8 py-5 text-sm
                          ${isSKU ? 'font-black text-slate-900 tracking-tighter' : ''}
                          ${isDesc ? 'font-bold text-slate-600 max-w-[250px] truncate' : ''}
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
    </motion.div>
  );
}
