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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
            <tr>
              {visibleHeaders.map((header) => (
                <th 
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.column === header && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence mode='popLayout'>
              {filteredDataset.map((row) => {
                // Find original index in fullDataset for updating
                const originalIndex = fullDataset.findIndex(r => r["Parent SKU"] === row["Parent SKU"]);
                
                return (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={row["Parent SKU"]}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    {visibleHeaders.map((header) => {
                      if (header === "Actual CBB") {
                        return (
                          <td key={header} className="px-6 py-4">
                            <input
                              type="number"
                              defaultValue={row[header] || 0}
                              onBlur={(e) => updateRow(originalIndex, parseFloat(e.target.value) || 0, row["Actual PKT"] || 0)}
                              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                          </td>
                        );
                      }
                      if (header === "Actual PKT") {
                        return (
                          <td key={header} className="px-6 py-4">
                            <input
                              type="number"
                              defaultValue={row[header] || 0}
                              onBlur={(e) => updateRow(originalIndex, row["Actual CBB"] || 0, parseFloat(e.target.value) || 0)}
                              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                          </td>
                        );
                      }
                      if (header === "Status") {
                        return (
                          <td key={header} className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(row[header] || 'Equal')}`}>
                              {row[header]}
                            </span>
                          </td>
                        );
                      }
                      
                      const isNumeric = typeof row[header] === 'number';
                      const isDifference = header.includes('Difference');
                      const diffColor = isDifference ? (row[header] > 0 ? 'text-emerald-700' : row[header] < 0 ? 'text-red-700' : 'text-gray-500') : '';
                      
                      let displayValue = row[header];
                      if (isNumeric && isNaN(displayValue)) {
                        displayValue = '0.00';
                      }

                      return (
                        <td key={header} className={`px-6 py-4 text-sm font-semibold ${isNumeric ? 'font-mono text-gray-900' : 'text-gray-800'} ${diffColor}`}>
                          {displayValue}
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
        <div className="py-20 text-center text-gray-400">
          No records found matching your filters.
        </div>
      )}
    </div>
  );
}
