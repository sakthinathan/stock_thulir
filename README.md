# 📦 StockPro - Advanced Inventory Management & Auditing

StockPro is a high-performance, modern web application designed for streamlined stock auditing and mismatch tracking. It specializes in processing system-generated Excel and PDF reports, calculating unit prices (MRP) on the fly, and providing real-time auditing tools for multi-unit inventory (Cases/CBB and Packets/PKT).

## ✨ Key Features

- **📂 Multi-Format Ingestion**: Seamlessly upload and parse `.xlsx` and `.pdf` system reports.
- **🧮 Smart Mapping & Conversion**:
  - Automatically calculates conversion factors using `Alt UOM1 Num/Den`.
  - Derives unit MRP from `Sellable Stock Val` and `Good Qty` for precise tracking.
- **📊 Real-Time Auditing**:
  - Compare "System Stock" vs. "Physical Count" instantly.
  - Live calculation of mismatches in both Case (CBB) and Packet (PKT) units.
  - Color-coded status tracking (Excess, Shortage, Equal).
- **🔍 Advanced Filtering**:
  - Brand-based isolation (Division Desc).
  - High-speed SKU and Description searching.
- **🎨 Premium UI/UX**:
  - Built with **Next.js 15** and **Tailwind CSS**.
  - Smooth micro-animations using **Framer Motion**.
  - Fully responsive, glassmorphic design.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Parsing**:
  - [XLSX](https://github.com/SheetJS/sheetjs) for Excel data processing.
  - [PDF.js](https://mozilla.github.io/pdf.js/) for high-precision PDF text extraction.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stock_thulir
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage Guide

1. **Login**: Use the default credentials (if configured) to access the dashboard.
2. **Upload**: Drag and drop your system-generated stock file. The app currently supports the standard export format containing `Material No`, `Alt UOM1 Num`, and `Good Qty`.
3. **Audit**: Enter your physical counts in the "Actual CBB" and "Actual PKT" columns. The mismatches will update in real-time.
4. **Filter**: Use the Brand dropdown to focus on specific categories or the search bar for individual SKUs.

## 🛠️ Customization

To update the default mapping for specific reports, refer to `src/store/useStockStore.ts`. The ingestion logic is optimized to handle common SAP/ERP export headers.

---

Built with ❤️ for precision inventory management.
