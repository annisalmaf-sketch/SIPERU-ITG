"use client";

import React, { useEffect } from "react";
import { BellRing } from "lucide-react";
import { toast } from "sonner";

interface Props {
  count: number;
  role: string;
}

export function PendingNotificationBanner({ count, role }: Props) {
  useEffect(() => {
    if (count > 0) {
      // Small delay to ensure toaster is mounted
      const timer = setTimeout(() => {
        toast.info(`Ada ${count} pengajuan baru!`, {
          description: `Silakan periksa daftar persetujuan ${role}.`,
          duration: 5000,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count, role]);

  if (count === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-fade-in relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex flex-shrink-0 items-center justify-center text-amber-600 dark:text-amber-500">
        <BellRing size={24} className="animate-bounce" />
      </div>
      <div className="z-10 relative">
        <h4 className="font-black text-sm uppercase tracking-wider">Notifikasi {role}</h4>
        <p className="text-sm font-medium">Terdapat <b>{count} pengajuan peminjaman ruangan baru</b> yang menunggu persetujuan Anda.</p>
      </div>
    </div>
  );
}
