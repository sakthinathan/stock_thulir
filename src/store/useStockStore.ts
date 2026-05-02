import { create } from 'zustand';
import { StockRow, SortConfig } from '../types';

interface StockState {
  fullDataset: StockRow[];
  filteredDataset: StockRow[];
  headers: string[];
  visibleHeaders: string[];
  brandFilter: string;
  searchTerm: string;
  sortConfig: SortConfig;
  isLoggedIn: boolean;
  
  setFullDataset: (data: StockRow[]) => void;
  updateRow: (index: number, actualCbb: number, actualPkt: number) => void;
  setBrandFilter: (brand: string) => void;
  setSearchTerm: (term: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setVisibleHeaders: (headers: string[]) => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  applyFilters: () => void;
}

const BRAND_KEYWORDS = [
  "50-50", "Biscafe", "Bourbon", "Cake", "Croissant", "Dairy Whitener", "Ghee",
  "Good Day", "Little Hearts", "Marie Gold", "Milk Bikis", "Nice Time",
  "Non Milk Drinks", "Nutri Choice PH", "Nutri Choice RH", "Pure Magic",
  "Rusk", "Snacking", "Tiger Creams", "Tiger Glucose", "Tiger Krunch",
  "Tiger Others", "Time Pass", "Treat", "UHT Milk", "Wafers", "Winkin FM",
  "Winkin Grow", "Winkin Lassi", "Winkin Milkshake", "Winkin Richshake"
];

export const useStockStore = create<StockState>((set, get) => ({
  fullDataset: [],
  filteredDataset: [],
  headers: [],
  visibleHeaders: [
    "Parent SKU",
    "Parent SKU Desc",
    "MRP",
    "Conversion",
    "Stock in CBB",
    "Stock in PKT",
    "Actual CBB",
    "Actual PKT",
    "Difference in CBB",
    "Difference in PKT",
    "Status"
  ],
  brandFilter: 'all',
  searchTerm: '',
  sortConfig: { column: null, direction: 'asc' },
  isLoggedIn: false,

  setFullDataset: (data) => {
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    
    // Map the incoming data to our internal StockRow structure
    const enrichedData = data.map(row => {
      const sku = String(row["Material No"] || row["Parent SKU"] || "");
      const desc = String(row["Material Description"] || row["Parent SKU Desc"] || "");
      
      // Calculate conversion factor: Alt UOM1 Num / Alt UOM1 Den
      const num = parseFloat(row["Alt UOM1 Num"] as any);
      const den = parseFloat(row["Alt UOM1 Den"] as any) || 1;
      let conversion = !isNaN(num) ? num / den : parseFloat(row["Conversion"] as any);
      if (isNaN(conversion) || conversion <= 0) conversion = 1;

      const cbb = parseFloat(row["Stock in CBB"] as any) || 0;
      const pkt = parseFloat(row["Stock in PKT"] as any) || 0;
      
      // Detected Brand Logic
      let brand = row["DMSDivisionDesc"] || row["Brand Desc"] || "General";
      
      // Auto-detect brand from description for better filtering
      const descUpper = desc.toUpperCase();
      const detectedBrand = BRAND_KEYWORDS.find(b => descUpper.includes(b.toUpperCase()));
      if (detectedBrand) {
        brand = detectedBrand;
      } else if (brand === "Biscuits , Cake&Rusk" || brand === "General") {
        brand = "Others";
      }
      
      // Calculate MRP from Sellable Stock Val / Good Qty if MRP is missing
      const totalVal = parseFloat(row["Sellable Stock Val"] as any) || 0;
      const totalQty = parseFloat(row["Good Qty"] as any) || 0;
      const calculatedMrp = totalQty > 0 ? Number((totalVal / totalQty).toFixed(2)) : 0;
      const mrp = parseFloat(row["MRP"] as any) || calculatedMrp;

      // Initial Actual values default to 0
      const actualCbb = parseFloat(row["Actual CBB"] as any) || 0;
      const actualPkt = parseFloat(row["Actual PKT"] as any) || 0;

      // Initial Difference calculation based on 0 actuals vs system stock
      const fileStockPktTotal = cbb * conversion + pkt;
      const actualPktTotal = actualCbb * conversion + actualPkt;
      const diffPkt = actualPktTotal - fileStockPktTotal;
      const diffCbb = diffPkt / conversion;

      let status = "Equal";
      if (diffPkt > 0.01) status = "Excess";
      else if (diffPkt < -0.01) status = "Shortage";

      return {
        ...row,
        "Parent SKU": sku,
        "Parent SKU Desc": desc,
        "Conversion": conversion,
        "Stock in CBB": cbb,
        "Stock in PKT": pkt,
        "Brand Desc": brand,
        "MRP": mrp,
        "Actual CBB": actualCbb,
        "Actual PKT": actualPkt,
        "Difference in CBB": Number(diffCbb.toFixed(2)),
        "Difference in PKT": Number(diffPkt.toFixed(2)),
        "Status": status
      };
    }).filter(row => {
      // Filter out rows that are likely not stock items (e.g., pincodes, empty rows)
      return row["Parent SKU"] && 
             row["Parent SKU"].length > 3 && 
             row["Parent SKU Desc"] &&
             row["Parent SKU Desc"].length > 2;
    });

    set({ fullDataset: enrichedData, headers, filteredDataset: enrichedData });
    get().applyFilters();
  },

  updateRow: (index, actualCbb, actualPkt) => {
    const { fullDataset } = get();
    const updatedDataset = [...fullDataset];
    const row = updatedDataset[index];
    if (!row) return;
    
    const conversionFactor = parseFloat(row["Conversion"] as any) || 1;
    const fileStockCbb = parseFloat(row["Stock in CBB"] as any) || 0;
    const fileStockPkt = parseFloat(row["Stock in PKT"] as any) || 0;

    const fileStockPktTotal = fileStockCbb * conversionFactor + fileStockPkt;
    const actualPktTotal = actualCbb * conversionFactor + actualPkt;

    const diffPkt = actualPktTotal - fileStockPktTotal;
    const diffCbb = diffPkt / conversionFactor;

    let status = "Equal";
    if (diffPkt > 0.01) status = "Excess";
    else if (diffPkt < -0.01) status = "Shortage";

    updatedDataset[index] = {
      ...row,
      "Actual CBB": actualCbb,
      "Actual PKT": actualPkt,
      "Difference in CBB": Number(diffCbb.toFixed(2)),
      "Difference in PKT": Number(diffPkt.toFixed(2)),
      "Status": status
    };

    set({ fullDataset: updatedDataset });
    get().applyFilters();
  },

  setBrandFilter: (brand) => {
    set({ brandFilter: brand });
    get().applyFilters();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },

  setSortConfig: (config) => {
    set({ sortConfig: config });
    get().applyFilters();
  },

  setVisibleHeaders: (headers) => set({ visibleHeaders: headers }),

  login: (user, pass) => {
    if (user === 'user' && pass === '123') {
      set({ isLoggedIn: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isLoggedIn: false, fullDataset: [], filteredDataset: [] }),

  applyFilters: () => {
    const { fullDataset, brandFilter, searchTerm, sortConfig } = get();
    let filtered = [...fullDataset];

    if (brandFilter !== 'all') {
      filtered = filtered.filter(row => row["Brand Desc"] === brandFilter);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(row => 
        String(row["Parent SKU"]).toLowerCase().includes(lowerSearch) ||
        String(row["Parent SKU Desc"]).toLowerCase().includes(lowerSearch)
      );
    }

    if (sortConfig.column) {
      const { column, direction } = sortConfig;
      filtered.sort((a, b) => {
        const aVal = a[column] ?? '';
        const bVal = b[column] ?? '';
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    set({ filteredDataset: filtered });
  }
}));
