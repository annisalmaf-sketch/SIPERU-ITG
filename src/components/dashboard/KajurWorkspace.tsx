"use client";

import React, { useState } from "react";
import { ApprovalCard } from "./ApprovalCard";
import { Inbox } from "lucide-react";
import { clsx } from "clsx";

export function KajurWorkspace({ bookings, kajurLevel }: { bookings: any[]; kajurLevel: number }) {
  const [filter, setFilter] = useState("ALL");

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") {
      if (kajurLevel === 1) return b.status === "PENDING_1";
      if (kajurLevel === 2) return b.status === "PENDING_2";
      if (kajurLevel === 3) return b.status === "PENDING_3";
    }
    if (filter === "PROCESSED") return b.status === "PROCESSED";
    if (filter === "APPROVED") {
      if (kajurLevel === 1) return ["PENDING_2", "PENDING_3", "APPROVED"].includes(b.status);
      if (kajurLevel === 2) return ["PENDING_3", "APPROVED"].includes(b.status);
      if (kajurLevel === 3) return b.status === "APPROVED";
    }
    if (filter === "REJECTED") return b.status === "REJECTED";
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        {["ALL", "PENDING", "PROCESSED", "APPROVED", "REJECTED", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={clsx(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              filter === status
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            )}
          >
            {status === "ALL" ? "Semua Peminjam" :
             status === "PENDING" ? "Menunggu" : 
             status === "PROCESSED" ? "Diproses" : 
             status === "APPROVED" ? "Disetujui" : 
             status === "REJECTED" ? "Ditolak" : "Selesai"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-8">
        {filteredBookings.length === 0 ? (
          <div className="py-32 glass-card rounded-[3rem] border-dashed border-2 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700">
              <Inbox size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-400">Tidak Ada Data</p>
              <p className="text-sm font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                Belum ada pengajuan dengan status ini.
              </p>
            </div>
          </div>
        ) : (
          filteredBookings.map((req) => (
            <ApprovalCard key={req.id} booking={req} kajurLevel={kajurLevel} />
          ))
        )}
      </div>
    </div>
  );
}
