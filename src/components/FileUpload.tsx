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
          relative border-3 border-dashed rounded-3xl p-12 transition-all cursor-pointer
          flex flex-col items-center justify-center gap-4
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' 
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          type="file"
          accept=".xlsx,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center transition-all
          ${status === 'success' ? 'bg-emerald-100 text-emerald-600' : 
            status === 'error' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}
        `}>
          {status === 'loading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Upload size={32} />
            </motion.div>
          ) : status === 'success' ? (
            <CheckCircle size={32} />
          ) : status === 'error' ? (
            <AlertCircle size={32} />
          ) : (
            <Upload size={32} />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {status === 'success' ? 'Upload Complete!' : 'Upload Base Stock File'}
          </h3>
          <p className="text-gray-500 mt-1">
            Drag and drop Excel (.xlsx) or PDF (.pdf)
          </p>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle size={14} />
            {errorMsg}
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
        <div className="flex items-center gap-2">
          <FileText size={18} />
          <span className="text-sm">Auto-calculation</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={18} />
          <span className="text-sm">Real-time stats</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={18} />
          <span className="text-sm">Export report</span>
        </div>
      </div>
    </div>
  );
}
