"use client";

import React, { useTransition } from "react";
import { 
  CalendarDays, 
  Clock, 
  Check, 
  X,
  Loader2,
  ChevronRight,
  User as UserIcon,
  MessageSquare,
  FileText,
  Stamp
} from "lucide-react";
import { updateBookingStatus } from "@/actions/booking";
import { clsx } from "clsx";
import { toast } from "sonner";

interface ApprovalCardProps {
  booking: {
    id: string;
    room: { name: string };
    startTime: Date;
    endTime: Date;
    purpose: string;
    user: { name: string | null };
    documentUrl?: string | null;
    status: string;
    notes?: string | null;
    pic?: string | null;
  };
  kajurLevel?: number;
}

export function ApprovalCard({ booking, kajurLevel }: ApprovalCardProps) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = React.useState(booking.notes || "");

  const handleAction = (status: "APPROVED" | "REJECTED" | "PROCESSED" | "COMPLETED") => {
    if (status === "REJECTED" && (!note || note.trim() === "")) {
      toast.error("Catatan Diperlukan", {
        description: "Alasan penolakan wajib diisi untuk menyatakan kenapa tahapan ditolak.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateBookingStatus(booking.id, status, note);
        if (result && result.success) {
          toast.success(`Booking ${status === "APPROVED" ? "Approved" : "Updated"}`, {
            description: `Successfully processed request for ${booking.room.name}.`,
          });
        } else {
          toast.error("Process Failed", {
            description: result?.error || "There was an error updating the booking status.",
          });
        }
      } catch (err: any) {
        toast.error("Process Failed", {
          description: err.message || "There was an error updating the booking status.",
        });
      }
    });
  };

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const dateStr = start.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

  const isCurrentTier = 
    (booking.status === "PENDING_1" && kajurLevel === 1) ||
    (booking.status === "PENDING_2" && kajurLevel === 2) ||
    (booking.status === "PENDING_3" && kajurLevel === 3);

  const isFullyApproved = booking.status === "APPROVED";
  const canMarkCompleted = isFullyApproved && (kajurLevel === 3 || !kajurLevel);

  return (
    <div className="glass-card rounded-[3rem] p-1 shadow-2xl dark:shadow-none hover:shadow-primary/5 transition-all duration-500 group animate-slide-up">
      <div className="p-8 flex flex-col lg:flex-row gap-10 lg:items-center">
        {/* Requester Profile */}
        <div className="flex items-center gap-5 lg:w-1/4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-primary border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden group-hover:rotate-6 transition-transform duration-500">
              {booking.user.name ? (
                <span className="text-xl font-black">{booking.user.name[0]}</span>
              ) : (
                <UserIcon size={24} className="text-slate-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors italic">{booking.user.name || "Unknown Requester"}</h3>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Academician</p>
          </div>
        </div>

        {/* Request Information */}
        <div className="flex-1 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-10 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">Resource Allocation</span>
              <ChevronRight size={14} className="text-slate-300 dark:text-slate-700" />
              <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none italic tracking-tight">{booking.room.name}</h4>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                <CalendarDays size={16} className="text-primary" />
                {dateStr}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                <Clock size={16} className="text-primary" />
                {timeStr}
              </div>
              {booking.pic && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                  <UserIcon size={16} className="text-primary" />
                  PIC: <span className="text-slate-900 dark:text-white">{booking.pic}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 flex gap-3">
            <MessageSquare size={16} className="text-slate-300 dark:text-slate-700 shrink-0 mt-1" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2 leading-relaxed">
              "{booking.purpose}"
            </p>
          </div>

          {booking.documentUrl && (
            <div className="pt-2">
              <a 
                href={booking.documentUrl} 
                download="Lampiran_Surat.pdf"
                className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.15em] bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl transition-all"
              >
                <FileText size={14} />
                View Attachment (Surat)
              </a>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {!(booking.status === "REJECTED" || booking.status === "COMPLETED") ? (
          <div className="flex flex-col gap-4 lg:w-[280px] pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            {isCurrentTier || canMarkCompleted ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Catatan / Alasan</label>
                  <textarea 
                     placeholder="Tambahkan catatan (wajib diisi jika menolak)..."
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                     className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* Approval Phase (PENDING_1, PENDING_2, PENDING_3) */}
                  {isCurrentTier && (
                    <>
                      <button 
                        disabled={isPending}
                        onClick={() => handleAction("APPROVED")}
                        className="col-span-2 flex items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-green-100 dark:hover:bg-green-900/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group shadow-sm hover:shadow-green-500/20"
                      >
                        <div className="absolute inset-0 bg-green-500/10 w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                        <Stamp size={20} className="relative z-10 animate-bounce text-green-600 dark:text-green-400" />
                        <span className="relative z-10">Cap E-Seal Persetujuan</span>
                      </button>
                      <button 
                        disabled={isPending}
                        onClick={() => handleAction("REJECTED")}
                        className="col-span-2 flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50 text-xs"
                      >
                        <X size={14} />
                        Tolak Pengajuan
                      </button>
                    </>
                  )}

                  {/* Execution Phase (APPROVED / fully approved) */}
                  {canMarkCompleted && (
                    <>
                      <button 
                        disabled={isPending}
                        onClick={() => handleAction("COMPLETED")}
                        className="col-span-2 flex items-center justify-center gap-1 py-3 px-2 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-black text-[10px] uppercase tracking-widest hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all disabled:opacity-50 text-xs"
                      >
                        Selesai Kegiatan
                      </button>
                      <button 
                        disabled={isPending}
                        onClick={() => handleAction("REJECTED")}
                        className="col-span-2 flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50 text-xs"
                      >
                        <X size={14} />
                        Batalkan Peminjaman
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* If not their turn, show status information */
              <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
                <span className={clsx(
                  "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border text-center w-full",
                  booking.status === "PENDING_1" ? "bg-amber-50 text-amber-600 border-amber-100" :
                  booking.status === "PENDING_2" ? "bg-amber-50 text-amber-600 border-amber-100" :
                  booking.status === "PENDING_3" ? "bg-amber-50 text-amber-600 border-amber-100" :
                  "bg-green-50 text-green-600 border-green-100"
                )}>
                  {booking.status === "PENDING_1" ? "Menunggu Persetujuan BKKH" :
                   booking.status === "PENDING_2" ? "Menunggu Persetujuan Sarpas" :
                   booking.status === "PENDING_3" ? "Menunggu Persetujuan Pengelola Ruangan" :
                   "Disetujui Sepenuhnya"}
                </span>
                <p className="text-[10px] font-bold text-slate-400 text-center mt-1">
                  {booking.status === "PENDING_1" && "Menunggu konfirmasi BKKH."}
                  {booking.status === "PENDING_2" && "Menunggu konfirmasi Sarpas."}
                  {booking.status === "PENDING_3" && "Menunggu konfirmasi Pengelola Ruangan."}
                  {booking.status === "APPROVED" && "Menunggu acara selesai."}
                </p>
                {booking.status === "APPROVED" || (booking.status.startsWith("PENDING_") && parseInt(booking.status.split("_")[1]) > (kajurLevel ?? 0)) ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0 rotate-12">
                     <div className="border-4 border-green-600 rounded-full w-40 h-40 flex flex-col items-center justify-center text-green-600 font-black">
                       <Stamp size={48} className="mb-2" />
                       <span className="text-xl tracking-widest uppercase">E-SEAL</span>
                       <span className="text-xs uppercase tracking-widest">VALIDATED</span>
                     </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          /* Terminal State Display (No action buttons allowed) */
          <div className="flex flex-col justify-center items-center gap-2 lg:w-[280px] pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            <span className={clsx(
              "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border text-center w-full",
              booking.status === "COMPLETED" 
                ? "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400" 
                : "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400"
            )}>
              {booking.status === "COMPLETED" ? "Kegiatan Selesai" : "Peminjaman Ditolak"}
            </span>
            {booking.notes && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 w-full mt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catatan Pengelola</p>
                <p className="text-xs text-slate-500 italic">"{booking.notes}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
