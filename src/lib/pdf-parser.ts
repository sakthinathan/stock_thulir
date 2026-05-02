import { StockRow } from '@/types';

export async function parseStockPDF(file: File): Promise<StockRow[]> {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Configure worker for client-side use
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const rows: StockRow[] = [];

  const COLS = {
    SKU: { min: 10, max: 50 },
    DESC: { min: 52, max: 130 },
    MRP: { min: 135, max: 170 },
    CONV: { min: 172, max: 200 },
    CBB: { min: 205, max: 240 },
    PKT: { min: 245, max: 290 },
    BRAND: { min: 540, max: 600 }
  };

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const lineMap: { [y: number]: any[] } = {};
    textContent.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]);
      const x = Math.round(item.transform[4]);
      if (!lineMap[y]) lineMap[y] = [];
      lineMap[y].push({ text: item.str, x });
    });

    const sortedY = Object.keys(lineMap).map(Number).sort((a, b) => b - a);

    let currentStockRow: StockRow | null = null;

    sortedY.forEach((y) => {
      // Ignore header/address area (Y > 650) to prevent picking up pincodes as SKUs
      if (y > 650) return;

      const items = lineMap[y].sort((a, b) => a.x - b.x);
      
      // Valid SKUs in your report are exactly 7 digits (e.g., 9003253)
      const skuItem = items.find(item => 
        item.x >= COLS.SKU.min && 
        item.x <= COLS.SKU.max && 
        /^\d{7}$/.test(item.text.trim())
      );
      
      if (skuItem) {
        // If we were processing a previous row, push it now
        if (currentStockRow) rows.push(currentStockRow);

        currentStockRow = {
          "Parent SKU": skuItem.text.trim(),
          "Parent SKU Desc": items
            .filter(item => item.x >= COLS.DESC.min && item.x <= COLS.DESC.max)
            .map(item => item.text)
            .join(' ').trim(),
          "MRP": parseFloat(items.find(item => item.x >= COLS.MRP.min && item.x <= COLS.MRP.max)?.text.replace(/,/g, '') || '0'),
          "Conversion": parseFloat(items.find(item => item.x >= COLS.CONV.min && item.x <= COLS.CONV.max)?.text.replace(/,/g, '') || '1'),
          "Stock in CBB": parseFloat(items.find(item => item.x >= COLS.CBB.min && item.x <= COLS.CBB.max)?.text.replace(/,/g, '') || '0'),
          "Stock in PKT": parseFloat(items.find(item => item.x >= COLS.PKT.min && item.x <= COLS.PKT.max)?.text.replace(/,/g, '') || '0'),
          "Brand Desc": items.find(item => item.x >= COLS.BRAND.min && item.x <= COLS.BRAND.max)?.text.trim() || "General"
        };
      } else if (currentStockRow) {
        // Check if this line is a continuation of the description
        const continuationDesc = items
          .filter(item => item.x >= COLS.DESC.min && item.x <= COLS.DESC.max)
          .map(item => item.text)
          .join(' ').trim();
        
        // If there's text in the description column but NO SKU or other numbers, it's a continuation
        const hasOtherData = items.some(item => 
          (item.x >= COLS.MRP.min && item.x <= COLS.PKT.max) && /\d/.test(item.text)
        );

        if (continuationDesc && !hasOtherData) {
          currentStockRow["Parent SKU Desc"] += ' ' + continuationDesc;
        } else {
          // It's a different kind of line, finish the current row
          rows.push(currentStockRow);
          currentStockRow = null;
        }
      }
    });

    if (currentStockRow) rows.push(currentStockRow);
  }

  return rows;
}
