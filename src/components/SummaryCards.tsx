"use client";

import { useStockStore } from '@/store/useStockStore';
import { motion } from 'framer-motion';
import { Package, PackagePlus, PackageMinus } from 'lucide-react';

export default function SummaryCards() {
  const { fullDataset } = useStockStore();

  const totals = fullDataset.reduce((acc, row) => {
    acc.diffCbb += row["Difference in CBB"] || 0;
    acc.diffPkt += row["Difference in PKT"] || 0;
    return acc;
  }, { diffCbb: 0, diffPkt: 0 });

  const cards = [
    {
      title: "Total Difference (CBB)",
      value: totals.diffCbb.toFixed(2),
      icon: <Package size={24} />,
      color: totals.diffCbb > 0 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : 
             totals.diffCbb < 0 ? "text-red-600 bg-red-50 border-red-100" : "text-gray-600 bg-gray-50 border-gray-100"
    },
    {
      title: "Total Difference (PKT)",
      value: totals.diffPkt.toFixed(2),
      icon: totals.diffPkt > 0 ? <PackagePlus size={24} /> : <PackageMinus size={24} />,
      color: totals.diffPkt > 0 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : 
             totals.diffPkt < 0 ? "text-red-600 bg-red-50 border-red-100" : "text-gray-600 bg-gray-50 border-gray-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-6 rounded-2xl border-2 flex items-center justify-between shadow-sm ${card.color}`}
        >
          <div>
            <p className="text-sm font-bold opacity-90">{card.title}</p>
            <p className="text-3xl font-black mt-1 font-mono">{card.value}</p>
          </div>
          <div className="opacity-80">
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
