"use client";

import React, { useState } from "react";
import { Ban, Loader2, X } from "lucide-react";
import { cancelBooking } from "@/actions/booking";
import { toast } from "sonner";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Alasan wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      const res = await cancelBooking(bookingId, reason);
      if (res.success) {
        toast.success("Pengajuan berhasil dibatalkan");
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Gagal membatalkan pengajuan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-colors group/btn"
      >
        <Ban size={16} className="group-hover/btn:scale-110 transition-transform" />
        Batal Pengajuan
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Ban className="text-red-500" />
                Batalkan Pengajuan
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <p className="text-sm font-medium text-slate-500">
                Apakah Anda yakin ingin membatalkan pengajuan ini? Mohon berikan alasan pembatalan.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alasan Pembatalan</label>
                <textarea 
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium text-slate-700 dark:text-white resize-none"
                  placeholder="Contoh: Jadwal acara diundur..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Tutup
                </button>
                <button 
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
