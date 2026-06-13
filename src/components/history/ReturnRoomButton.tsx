"use client";

import React, { useTransition } from "react";
import { Undo2, Loader2 } from "lucide-react";
import { returnBooking } from "@/actions/booking";
import { toast } from "sonner";
import { clsx } from "clsx";

export function ReturnRoomButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleReturn = () => {
    if (!confirm("Apakah Anda yakin ingin mengembalikan ruangan ini? Pastikan ruangan dalam keadaan rapi dan bersih.")) {
      return;
    }

    startTransition(async () => {
      try {
        const res = await returnBooking(bookingId);
        if (res.success) {
          toast.success("Ruangan Berhasil Dikembalikan", {
            description: "Terima kasih telah menggunakan fasilitas kami.",
          });
        } else {
          toast.error("Gagal Mengembalikan Ruangan", {
            description: res.error || "Terjadi kesalahan.",
          });
        }
      } catch (err: any) {
        toast.error("Gagal Mengembalikan Ruangan", {
          description: err.message || "Terjadi kesalahan.",
        });
      }
    });
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isPending}
      className={clsx(
        "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-purple-100 group/return",
        isPending && "opacity-70 cursor-not-allowed"
      )}
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Undo2 size={16} className="group-hover/return:-rotate-12 transition-transform" />
      )}
      Selesai Gunakan
    </button>
  );
}
