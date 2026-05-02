export interface StockRow {
  "Parent SKU": string | number;
  "Parent SKU Desc": string;
  "Brand Desc": string;
  "MRP": number;
  "Conversion": number;
  "Stock in CBB": number;
  "Stock in PKT": number;
  "Actual CBB"?: number;
  "Actual PKT"?: number;
  "Difference in CBB"?: number;
  "Difference in PKT"?: number;
  "Status"?: string;
  [key: string]: any;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  column: keyof StockRow | null;
  direction: SortDirection;
}
