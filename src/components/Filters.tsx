"use client";

import { useStockStore } from '@/store/useStockStore';
import { Search, Filter, LayoutGrid, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Filters() {
  const { 
    fullDataset, 
    brandFilter, 
    setBrandFilter, 
    searchTerm, 
    setSearchTerm,
    headers,
    visibleHeaders,
    setVisibleHeaders
  } = useStockStore();

  const brands = Array.from(new Set(fullDataset.map(r => r["Brand Desc"]))).filter(Boolean);

  const toggleHeader = (header: string) => {
    if (["Parent SKU", "Parent SKU Desc"].includes(header)) return;
    const newHeaders = visibleHeaders.includes(header)
      ? visibleHeaders.filter(h => h !== header)
      : [...visibleHeaders, header];
    setVisibleHeaders(newHeaders);
  };

  return (
    <div className="space-y-6 sticky top-24">
      {/* Search */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-900">
          <Search size={18} />
          <h3 className="font-bold">Quick Search</h3>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search SKU or Desc..."
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Brand Filter */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-900">
          <Filter size={18} />
          <h3 className="font-bold">Brand Filter</h3>
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm cursor-pointer font-medium text-gray-900"
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Column Selector */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-900">
          <LayoutGrid size={18} />
          <h3 className="font-bold">Columns</h3>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
          {headers.map(header => {
            const isVisible = visibleHeaders.includes(header);
            const isMandatory = ["Parent SKU", "Parent SKU Desc"].includes(header);
            
            return (
              <button
                key={header}
                disabled={isMandatory}
                onClick={() => toggleHeader(header)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all
                  ${isVisible ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}
                  ${isMandatory ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
                `}
              >
                <span className="truncate mr-2">{header}</span>
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
