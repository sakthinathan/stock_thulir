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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: idx * 0.1 
          }}
          className={`
            relative p-8 rounded-[2.5rem] border-2 flex items-center justify-between shadow-2xl overflow-hidden group
            ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-50/50 border-emerald-100/50 shadow-emerald-100/20' : 
              card.color.split(' ')[0] === 'text-red-600' ? 'bg-rose-50/50 border-rose-100/50 shadow-rose-100/20' : 
              'bg-slate-50/50 border-slate-100/50 shadow-slate-100/20'}
          `}
        >
          {/* Decorative background circle */}
          <div className={`
            absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-transform group-hover:scale-150 duration-700
            ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-400' : 
              card.color.split(' ')[0] === 'text-red-600' ? 'bg-rose-400' : 'bg-slate-400'}
          `} />

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{card.title}</p>
            <div className="flex items-baseline gap-1">
              <p className={`text-5xl font-black font-mono tracking-tighter ${card.color.split(' ')[0]}`}>
                {card.value}
              </p>
              <span className="text-xs font-black opacity-30 uppercase tracking-widest">unit</span>
            </div>
          </div>

          <div className={`
            relative z-10 p-4 rounded-2xl shadow-inner
            ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-100 text-emerald-600' : 
              card.color.split(' ')[0] === 'text-red-600' ? 'bg-rose-100 text-rose-600' : 
              'bg-slate-100 text-slate-500'}
          `}>
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
