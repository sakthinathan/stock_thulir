"use client";

import { useStockStore } from '@/store/useStockStore';
import StockTable from './StockTable';
import Filters from './Filters';
import { motion } from 'framer-motion';

export default function InventoryView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Detailed Inventory</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Manage all SKU records</p>
        </div>
      </div>
      
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
