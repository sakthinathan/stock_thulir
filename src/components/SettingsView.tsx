"use client";

import { useStockStore } from '@/store/useStockStore';
import { motion } from 'framer-motion';
import { Shield, Bell, User, Monitor, Database } from 'lucide-react';

export default function SettingsView() {
  const sections = [
    { 
      icon: <User size={20} />, 
      title: "Account Profile", 
      desc: "Manage your authentication details and preferences",
      status: "Verified"
    },
    { 
      icon: <Database size={20} />, 
      title: "Inventory Config", 
      desc: "Adjust conversion factors and SKU mapping rules",
      status: "Active"
    },
    { 
      icon: <Shield size={20} />, 
      title: "System Security", 
      desc: "Audit logs and enterprise security protocols",
      status: "Secure"
    },
    { 
      icon: <Bell size={20} />, 
      title: "Notifications", 
      desc: "Stock mismatch alerts and automated reporting",
      status: "Enabled"
    }
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Portal Settings</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Configure your audit environment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-10 rounded-[3rem] border border-white/60 hover-lift group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
                {section.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {section.status}
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{section.title}</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium leading-relaxed">{section.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-700">
          <Monitor size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black tracking-tight mb-4">Enterprise System Status</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Engine Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Database Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
