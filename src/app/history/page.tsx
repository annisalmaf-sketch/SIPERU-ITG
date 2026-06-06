import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  CheckCircle2, 
  Clock, 
  School, 
  Printer, 
  Hourglass, 
  XCircle, 
  FileText,
  Calendar,
  ChevronRight
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { clsx } from "clsx";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { room: true },
    orderBy: { startTime: "desc" },
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking History</h1>
            <p className="text-slate-500 font-medium">Manage your past reservations and download official attendance evidence.</p>
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {bookings.length === 0 ? (
             <div className="col-span-2 py-20 glass-card rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 opacity-50">
                <Calendar size={48} className="text-slate-300" />
                <p className="font-bold text-slate-500">No bookings found. Start by reserving a room!</p>
             </div>
          ) : (
            bookings.map((item) => {
              const start = new Date(item.startTime);
              const end = new Date(item.endTime);
              const dateStr = start.toLocaleDateString("en-US", { day: "numeric", month: "short" });
              const yearStr = start.getFullYear().toString();
              const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

              const isApproved = item.status === "APPROVED";
              const isPending = ["PENDING", "PENDING_1", "PENDING_2", "PENDING_3"].includes(item.status);
              const isProcessed = item.status === "PROCESSED";
              const isCompleted = item.status === "COMPLETED";
              const isRejected = item.status === "REJECTED";

              return (
                <div key={item.id} className={clsx(
                  "glass-card rounded-[2rem] overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1",
                  isRejected && "opacity-80"
                )}>
                  {/* Status Banner */}
                  <div className={clsx(
                    "h-1.5 w-full",
                    isApproved ? "bg-green-500" : 
                    isPending ? "bg-amber-500" :
                    isProcessed ? "bg-blue-500" :
                    isCompleted ? "bg-purple-500" : "bg-red-500"
                  )}></div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-4">
                        <div className={clsx(
                          "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          isApproved ? "bg-green-50 text-green-600 border-green-100" : 
                          isPending ? "bg-amber-50 text-amber-600 border-amber-100" : 
                          isProcessed ? "bg-blue-50 text-blue-600 border-blue-100" :
                          isCompleted ? "bg-purple-50 text-purple-600 border-purple-100" :
                          "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {isApproved && <CheckCircle2 size={14} />}
                          {isPending && <Hourglass size={14} className="animate-spin-slow" />}
                          {isRejected && <XCircle size={14} />}
                          {item.status === "PROCESSED" ? "DIPROSES" : 
                           item.status === "COMPLETED" ? "SELESAI" : 
                           item.status === "APPROVED" ? "DISETUJUI" :
                           item.status === "REJECTED" ? "DITOLAK" : 
                           item.status === "PENDING_1" ? "MENUNGGU PERSETUJUAN BKKH" :
                           item.status === "PENDING_2" ? "MENUNGGU PERSETUJUAN SARPAS" :
                           item.status === "PENDING_3" ? "MENUNGGU PERSETUJUAN PENGELOLA RUANGAN" : "MENUNGGU"}
                        </div>
                        <h3 className={clsx(
                          "text-2xl font-black text-slate-900 group-hover:text-primary transition-colors",
                          isRejected && "line-through opacity-40"
                        )}>
                          {item.room.name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Serial: {item.id.slice(-8)}</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center min-w-[80px] shadow-inner">
                        <span className="text-2xl font-black text-slate-900 leading-none">{dateStr}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{yearStr}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <Clock size={16} className="text-primary" />
                          {timeStr}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Facility Type</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <School size={16} className="text-primary" />
                          {item.room.type}
                        </div>
                      </div>
                    </div>
                    {item.pic && (
                      <div className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Point of Contact</p>
                        <p className="text-sm font-bold text-slate-700">{item.pic}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col gap-1 max-w-[60%]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</p>
                        <p className="text-sm font-bold text-slate-600 italic truncate group-hover:text-slate-900 transition-colors">
                          "{item.purpose}"
                        </p>
                        {item.notes && (
                          <div className="mt-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catatan Pengelola</p>
                            <p className="text-xs font-medium text-slate-600 italic">"{item.notes}"</p>
                          </div>
                        )}
                        {item.documentUrl && (
                          <a 
                            href={item.documentUrl} 
                            download="Lampiran_Surat.pdf"
                            className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                          >
                            <FileText size={12} />
                            View Surat
                          </a>
                        )}
                      </div>
                      
                      {isApproved ? (
                        <a 
                          href={`/history/print/${item.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary py-2 px-5 text-sm group/btn flex items-center justify-center gap-2"
                        >
                          <Printer size={18} className="group-hover/btn:scale-110 transition-transform" />
                          Cetak / Eksport PDF
                        </a>
                      ) : (
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-all group/btn">
                          View Log
                          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
