"use client";

import { useState, useCallback } from 'react';
import { useStockStore } from '@/store/useStockStore';
import { Upload, FileText, CheckCircle, AlertCircle, FileType } from 'lucide-react';
import * as XLSX from 'xlsx';
import { parseStockPDF } from '@/lib/pdf-parser';
import { motion } from 'framer-motion';

export default function FileUpload() {
  const setFullDataset = useStockStore((state) => state.setFullDataset);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    const isPDF = file.name.endsWith('.pdf');
    const isExcel = file.name.endsWith('.xlsx');

    if (!isPDF && !isExcel) {
      setStatus('error');
      setErrorMsg('Please upload a valid Excel or PDF file');
      return;
    }

    setStatus('loading');
    setErrorMsg(null);
    try {
      if (isPDF) {
        const jsonData = await parseStockPDF(file);
        if (jsonData.length === 0) throw new Error('Could not extract data from PDF');
        setFullDataset(jsonData as any);
      } else {
        const jsonData = await new Promise<any[]>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const result = XLSX.utils.sheet_to_json(worksheet);
              if (result.length === 0) reject(new Error('Excel file is empty'));
              resolve(result);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsArrayBuffer(file);
        });
        setFullDataset(jsonData);
      }
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'An error occurred while processing the file');
    }
  }, [setFullDataset]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-[3rem] p-16 transition-all duration-500 cursor-pointer
          flex flex-col items-center justify-center gap-6 group
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.03] shadow-2xl shadow-indigo-100' 
            : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-2xl hover:shadow-slate-200/50'
          }
        `}
      >
        <input
          type="file"
          accept=".xlsx,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className={`
          w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-xl
          ${status === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
            status === 'error' ? 'bg-rose-500 text-white shadow-rose-200' : 
            'bg-indigo-600 text-white shadow-indigo-200 group-hover:rotate-6'}
        `}>
          {status === 'loading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Upload size={36} strokeWidth={2.5} />
            </motion.div>
          ) : status === 'success' ? (
            <CheckCircle size={36} strokeWidth={2.5} />
          ) : status === 'error' ? (
            <AlertCircle size={36} strokeWidth={2.5} />
          ) : (
            <div className="relative">
               <Upload size={36} strokeWidth={2.5} />
               <motion.div 
                 animate={{ y: [0, -5, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-300 rounded-full border-2 border-white"
               />
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {status === 'success' ? 'Report Processed' : 'Upload Inventory Data'}
          </h3>
          <p className="text-slate-400 font-medium text-sm">
            {isDragging ? 'Drop it here' : 'Excel or PDF system reports'}
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-rose-100"
          >
            <AlertCircle size={14} />
            {errorMsg}
          </motion.div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-2 group">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
            <FileText size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
            <CheckCircle size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Validate</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
            <Upload size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync</span>
        </div>
      </div>
    </div>
  );
}
