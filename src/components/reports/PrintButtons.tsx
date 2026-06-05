"use client";

import React from "react";
import { Printer, FileSpreadsheet, FileJson, Download } from "lucide-react";

export function PrintButtons({ data }: { data?: any[] }) {
  const downloadJSON = () => {
    if (!data || data.length === 0) return alert("Tidak ada data untuk diekspor.");
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `ITG_Reports_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) return alert("Tidak ada data untuk diekspor.");
    
    // Create CSV headers
    const headers = ["ID Peminjaman", "Tanggal Dibuat", "Nama Peminjam", "Email", "Ruangan", "Tujuan Kegiatan", "Status", "Waktu Mulai", "Waktu Selesai"];
    
    // Map data to CSV rows
    const rows = data.map(b => [
      b.id,
      new Date(b.createdAt).toLocaleDateString("id-ID"),
      `"${b.user?.name || '-'}"`,
      `"${b.user?.email || '-'}"`,
      `"${b.room?.name || '-'}"`,
      `"${b.purpose || '-'}"`,
      b.status,
      new Date(b.startTime).toLocaleString("id-ID"),
      new Date(b.endTime).toLocaleString("id-ID")
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `ITG_Reports_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 shadow-sm">
        <button onClick={() => window.print()} className="p-2.5 text-slate-400 hover:text-primary transition-colors border-r border-slate-100 dark:border-slate-800" title="Cetak Halaman"><Printer size={18} /></button>
        <button onClick={downloadCSV} className="p-2.5 text-slate-400 hover:text-emerald-600 transition-colors border-r border-slate-100 dark:border-slate-800" title="Ekspor CSV"><FileSpreadsheet size={18} /></button>
        <button onClick={downloadJSON} className="p-2.5 text-slate-400 hover:text-amber-600 transition-colors" title="Ekspor JSON"><FileJson size={18} /></button>
      </div>
      <button onClick={() => window.print()} className="btn-primary">
        <Download size={18} />
        Generate Full PDF
      </button>
    </div>
  );
}
