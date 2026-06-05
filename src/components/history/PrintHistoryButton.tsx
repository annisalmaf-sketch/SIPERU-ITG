"use client";

import React from "react";
import { Printer, Download } from "lucide-react";

export function PrintHistoryButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 active:scale-95"
    >
      <Download size={18} />
      <span>Eksport PDF / Cetak Laporan</span>
    </button>
  );
}
