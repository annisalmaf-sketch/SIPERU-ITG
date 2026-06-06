import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  BarChart3, 
  PieChart, 
  Download, 
  Calendar, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  FileSpreadsheet,
  FileJson,
  Printer,
  FileText
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { clsx } from "clsx";

import { PrintButtons } from "@/components/reports/PrintButtons";

import Link from "next/link";

export default async function ReportsPage({ searchParams }: { searchParams: any }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  // Aggregate Data for Reports
  const resolvedParams = await searchParams;
  const filterStatus = resolvedParams?.filter;

  const allBookings = await prisma.booking.findMany({
    include: { room: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  const filteredBookings = filterStatus === "APPROVED" 
    ? allBookings.filter(b => b.status === "APPROVED")
    : allBookings;

  const total = allBookings.length;
  const approved = allBookings.filter(b => b.status === "APPROVED").length;
  const rejected = allBookings.filter(b => b.status === "REJECTED").length;
  
  const stats = [
    { label: "Total Reservations", value: total, trend: "+8.2%", up: true, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Approval Ratio", value: total > 0 ? `${Math.round((approved / total) * 100)}%` : "0%", trend: "+2.4%", up: true, icon: PieChart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rejection Rate", value: total > 0 ? `${Math.round((rejected / total) * 100)}%` : "0%", trend: "-1.1%", up: false, icon: ArrowDownRight, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in pb-10">
        {/* Formal Kop Surat (Only Visible on Print) */}
        <div className="hidden print:block text-center border-b-[3px] border-black pb-4 relative mt-8">
           <div className="absolute left-0 top-0">
             <img src="/logo-itg.png" className="w-20 h-20 grayscale" alt="ITG Logo" />
           </div>
           <h2 className="text-xl font-bold uppercase tracking-widest text-black">Yayasan Al-Musaddadiyah</h2>
           <h1 className="text-2xl font-black uppercase tracking-widest mt-1 text-black">Institut Teknologi Garut</h1>
           <p className="text-sm mt-2 text-black">Jl. Mayor Syamsu No. 1, Jayaraga, Tarogong Kidul, Garut</p>
           <p className="text-xs text-black">Website: www.itg.ac.id | Email: info@itg.ac.id</p>
        </div>

        <div className="hidden print:block text-center mt-6">
           <h3 className="text-lg font-bold uppercase underline text-black">Laporan Rekapitulasi Peminjaman Ruangan</h3>
           <p className="text-xs mt-1 text-black">Dicetak pada: {new Date().toLocaleDateString("id-ID")}</p>
        </div>

        {/* Header (Web Only) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
           <div className="space-y-1">
             <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">System Intelligence</h1>
             <p className="text-slate-500 dark:text-slate-400 font-medium">Deep analytics and institutional usage reporting.</p>
           </div>
           <PrintButtons data={filteredBookings} />
        </div>

        {/* Stats Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 print:hidden">
           {stats.map((stat, idx) => (
             <div key={stat.label} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="flex justify-between items-start">
                   <div className={clsx("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={24} />
                   </div>
                   <div className={clsx(
                     "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest",
                     stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                   )}>
                      {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.trend}
                   </div>
                </div>
                <div className="mt-8 space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">{stat.label}</p>
                   <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</h3>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <BarChart3 size={120} className="rotate-12" />
                </div>
             </div>
           ))}
        </section>

        {/* Detailed Audit Log */}
        <section className="space-y-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 print:hidden">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic">
                 <div className="w-2 h-8 bg-primary rounded-full"></div>
                 Institutional Audit Board
              </h2>
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <Link href="/reports?filter=all" className={clsx("px-4 py-2 rounded-xl text-xs font-bold transition-all border", filterStatus !== "APPROVED" ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white" : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 hover:text-primary")}>
                    Semua Data
                 </Link>
                 <Link href="/reports?filter=APPROVED" className={clsx("px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2", filterStatus === "APPROVED" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 hover:text-green-600")}>
                    <Filter size={14} /> Approved Saja
                 </Link>
              </div>
           </div>

           <div className="glass-card rounded-[3rem] print:rounded-none overflow-hidden border-none print:border print:border-black shadow-2xl print:shadow-none print:bg-transparent">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse print:text-black">
                    <thead>
                       <tr className="bg-slate-50/50 dark:bg-slate-900/50 print:bg-slate-200 border-b border-slate-100 dark:border-slate-800 print:border-black">
                          <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-black print:border-b print:border-black">Timestamp</th>
                          <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-black print:border-b print:border-black">Principal</th>
                          <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-black print:border-b print:border-black">Activity</th>
                          <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-black print:border-b print:border-black">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                       {filteredBookings.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="py-24 text-center italic text-slate-400 font-medium">No activity data found in history.</td>
                         </tr>
                       ) : (
                         filteredBookings.map((b) => {
                           const date = new Date(b.createdAt);
                           const formatted = date.toLocaleDateString("en-US", { 
                             day: "2-digit", 
                             month: "short", 
                             year: "numeric",
                             hour: "2-digit",
                             minute: "2-digit"
                           });

                           return (
                             <tr key={b.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors print:border-b print:border-slate-300">
                                <td className="py-6 px-10 print:py-3">
                                   <div className="flex items-center gap-3">
                                      <Calendar size={14} className="text-slate-300 print:hidden" />
                                      <span className="text-[10px] font-black text-slate-400 print:text-black uppercase tracking-widest">{formatted}</span>
                                   </div>
                                </td>
                                <td className="py-6 px-10 print:py-3">
                                   <div className="space-y-0.5">
                                      <p className="text-sm font-black text-slate-900 dark:text-white print:text-black">{b.user.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 print:text-black uppercase tracking-[0.2em]">{b.user.email}</p>
                                   </div>
                                </td>
                                <td className="py-6 px-10">
                                   <div className="flex justify-between items-start">
                                      <div>
                                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Reserved <span className="text-primary italic">{b.room.name}</span></p>
                                         <p className="text-[10px] font-medium text-slate-400 truncate max-w-xs">{b.purpose}</p>
                                      </div>
                                      {(b as any).documentUrl && (
                                        <a 
                                          href={(b as any).documentUrl} 
                                          download="Lampiran_Surat.pdf"
                                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                                          title="View Attachment"
                                        >
                                          <FileText size={14} />
                                        </a>
                                      )}
                                   </div>
                                </td>
                                <td className="py-6 px-10 flex items-center justify-between gap-4">
                                   <div className={clsx(
                                     "inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                     b.status === "APPROVED" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30" : 
                                     b.status === "PENDING" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-900/30" : 
                                     "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-900/30"
                                   )}>
                                      {b.status}
                                   </div>
                                   {b.status === "APPROVED" && (
                                     <a 
                                       href={`/history/print/${b.id}`} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 print:hidden"
                                       title="Cetak Surat Persetujuan (Barcode)"
                                     >
                                       <Printer size={16} />
                                     </a>
                                   )}
                                </td>
                             </tr>
                           )
                         })
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Formal Signature (Only Visible on Print) */}
           <div className="hidden print:flex justify-end mt-16 text-sm text-center pb-10">
              <div className="w-64 text-black">
                 <p>Garut, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                 <p>Mengetahui,</p>
                 <p className="font-bold mb-24 mt-1">Administrator Sistem ITG</p>
                 <p className="font-bold underline">Super Admin SIPERU</p>
                 <p className="text-[10px] mt-1">NIP. 19850101 201012 1 001</p>
              </div>
           </div>
        </section>
      </div>
    </MainLayout>
  );
}
