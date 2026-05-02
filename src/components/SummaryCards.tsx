"use client";

import { useStockStore } from '@/store/useStockStore';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ThumbsUp } from 'lucide-react';

export default function SummaryCards() {
  const { filteredDataset } = useStockStore();

  const totalItems = filteredDataset.length;
  const auditedItems = filteredDataset.filter(r => (r["Actual CBB"] || 0) > 0 || (r["Actual PKT"] || 0) > 0).length;
  const mismatchedItems = filteredDataset.filter(r => r["Status"] !== 'Equal' && ((r["Actual CBB"] || 0) > 0 || (r["Actual PKT"] || 0) > 0)).length;

  const cards = [
    {
      title: "Audit Completion",
      value: `${auditedItems}/${totalItems}`,
      suffix: "SKUs",
      icon: <CheckCircle size={28} strokeWidth={2.5} />,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Critical Issues",
      value: mismatchedItems.toString(),
      suffix: mismatchedItems > 1 ? "Errors" : "Error",
      icon: mismatchedItems > 0 ? <AlertTriangle size={28} strokeWidth={2.5} /> : <ThumbsUp size={28} strokeWidth={2.5} />,
      color: mismatchedItems > 0 ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ 
            type: "spring",
            stiffness: 150,
            damping: 20,
            delay: idx * 0.1 
          }}
          className={`
            relative p-10 rounded-[3rem] border border-white/60 flex items-center justify-between shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] overflow-hidden group cursor-pointer
            ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50' : 
              card.color.split(' ')[0] === 'text-red-600' ? 'bg-gradient-to-br from-rose-50 to-rose-100/50' : 
              'bg-gradient-to-br from-slate-50 to-slate-100/50'}
          `}
        >
          {/* Animated Aura Blob */}
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className={`
              absolute -right-16 -bottom-16 w-48 h-48 rounded-full blur-[60px] opacity-20
              ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-400' : 
                card.color.split(' ')[0] === 'text-red-600' ? 'bg-rose-400' : 'bg-indigo-400'}
            `}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
               <div className={`w-1.5 h-6 rounded-full ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-500' : card.color.split(' ')[0] === 'text-red-600' ? 'bg-rose-500' : 'bg-slate-400'}`} />
               <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">{card.title}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className={`text-6xl font-black font-mono tracking-tighter ${card.color.split(' ')[0]}`}>
                {card.value}
              </p>
              <span className="text-sm font-black opacity-30 uppercase tracking-[0.2em]">{card.suffix}</span>
            </div>
          </div>

          <div className={`
            relative z-10 p-5 rounded-3xl shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110
            ${card.color.split(' ')[0] === 'text-emerald-600' ? 'bg-emerald-500 text-white glow-emerald' : 
              card.color.split(' ')[0] === 'text-red-600' ? 'bg-rose-500 text-white glow-rose' : 
              'bg-slate-900 text-white shadow-slate-200'}
          `}>
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
