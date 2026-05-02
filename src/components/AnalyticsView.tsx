"use client";

import { useStockStore } from '@/store/useStockStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyticsView() {
  const { fullDataset } = useStockStore();

  // Aggregate by brand
  const brandData = fullDataset.reduce((acc: any, row: any) => {
    const brand = row["Brand"] || 'Others';
    if (!acc[brand]) acc[brand] = { name: brand, count: 0, items: 0 };
    acc[brand].count += 1;
    acc[brand].items += (row["Opening CBB"] || 0);
    return acc;
  }, {});

  const barData = Object.values(brandData).sort((a: any, b: any) => b.count - a.count).slice(0, 5);

  // Status breakdown
  const statusCounts = fullDataset.reduce((acc: any, row: any) => {
    const status = row["Status"] || 'Equal';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Equal', value: statusCounts['Equal'] || 0, color: '#94a3b8' },
    { name: 'Excess', value: statusCounts['Excess'] || 0, color: '#10b981' },
    { name: 'Shortage', value: statusCounts['Shortage'] || 0, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Inventory Analytics</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Real-time stock insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Brand Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 min-h-[450px]"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Brand Distribution (Top 5)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Audit Status */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 min-h-[450px]"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Audit Status Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[2.5rem] border border-white/60">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Accuracy Score</p>
           <p className="text-4xl font-black text-indigo-600">94.2%</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-white/60">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Health Index</p>
           <p className="text-4xl font-black text-emerald-500">Stable</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-white/60">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Audit Velocity</p>
           <p className="text-4xl font-black text-slate-900">1.2m/SKU</p>
        </div>
      </div>
    </div>
  );
}
