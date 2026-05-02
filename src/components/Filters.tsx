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
    <div className="space-y-8 sticky top-32">
      {/* Search */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6 text-slate-900">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
            <Search size={16} strokeWidth={3} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Quick Search</h3>
        </div>
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU or Desc..."
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-inner"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6 text-slate-900">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
            <Filter size={16} strokeWidth={3} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Categories</h3>
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm cursor-pointer font-bold text-slate-900 shadow-inner appearance-none"
        >
          <option value="all">All Products</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Column Selector */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6 text-slate-900">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
            <LayoutGrid size={16} strokeWidth={3} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Data View</h3>
        </div>
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-3 scrollbar-thin">
          {headers.map(header => {
            const isVisible = visibleHeaders.includes(header);
            const isMandatory = ["Parent SKU", "Parent SKU Desc"].includes(header);
            
            return (
              <button
                key={header}
                disabled={isMandatory}
                onClick={() => toggleHeader(header)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${isVisible 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}
                  ${isMandatory ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.03] active:scale-95'}
                `}
              >
                <span className="truncate mr-2">{header}</span>
                {isVisible ? <Eye size={12} strokeWidth={3} /> : <EyeOff size={12} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
