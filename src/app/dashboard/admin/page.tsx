import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Download, 
  Plus, 
  CalendarDays, 
  TrendingUp, 
  Hourglass, 
  DoorOpen, 
  Activity,
  ArrowRight,
  Video,
  Users,
  Beaker,
  X,
  Check,
  Search,
  Building2,
  FileText,
  Printer
} from "lucide-react";
import { clsx } from "clsx";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch Real Stats from DB
  const [totalBookings, pendingReviews, totalRooms, activeRooms] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: { in: ["PENDING_1", "PENDING_2", "PENDING_3", "PENDING"] } } }),
    prisma.room.count(),
    prisma.room.count({ where: { status: "AVAILABLE" } })
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    include: { room: true, user: true },
    orderBy: { createdAt: "desc" },
    // Ensure documentUrl is included if needed
  });

  const approvedBookings = await prisma.booking.findMany({
    where: { status: "APPROVED", endTime: { gte: new Date() } },
    include: { room: true, user: true },
    orderBy: { startTime: "asc" }
  });

  const stats = [
    { label: "Total Bookings", value: totalBookings, trend: "+12%", sub: "Growth Rate", icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Reviews", value: pendingReviews, trend: null, sub: "Urgent Action", icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Room Capacity", value: `${activeRooms}/${totalRooms}`, trend: null, sub: "Available Now", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Live Utilization", value: totalRooms > 0 ? `${Math.round(((totalRooms - activeRooms) / totalRooms) * 100)}%` : "0%", trend: null, sub: "Usage Ratio", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">System Command Center</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Global operational metrics and institutional resource oversight.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm">
              <Download size={18} />
              Export Metrics
            </button>
            <Link href="/rooms">
              <button className="btn-primary group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Manage Rooms
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label}
              className="glass-card rounded-[2rem] p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={clsx("p-4 rounded-2xl", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-green-600 font-black text-[10px] bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                    <TrendingUp size={12} />
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Table Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Recent Activity Logs
            </h3>
            <Link href="/reports" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
              View Full History
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
               <div className="relative flex-1 max-w-md group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input type="text" placeholder="Search operational logs..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm text-slate-700 dark:text-slate-200" />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Principal</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center italic text-slate-400 font-medium">No recent operations logged.</td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => {
                      const start = new Date(booking.startTime);
                      const dateStr = start.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                      
                      return (
                        <tr key={booking.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-6 px-10">
                            <div>
                              <p className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{booking.user.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID: {booking.user.email?.split('@')[0]}</p>
                            </div>
                          </td>
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Building2 size={18} />
                              </div>
                              <span className="text-sm font-black text-slate-700 dark:text-slate-300">{booking.room.name}</span>
                              {booking.documentUrl && (
                                <a 
                                  href={booking.documentUrl} 
                                  download="Lampiran_Surat.pdf"
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                                  title="View Attachment"
                                >
                                  <FileText size={14} />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-6 px-10">
                            <p className="text-sm font-black text-slate-900 dark:text-white">{dateStr}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{start.getHours()}:00 - {(start.getHours() + 2) % 24}:00</p>
                          </td>
                          <td className="py-6 px-10">
                             <div className={clsx(
                               "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                               booking.status === "APPROVED" ? "bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-900/30" : 
                               booking.status === "PENDING" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-900/30" : 
                               "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-900/30"
                             )}>
                               {booking.status}
                             </div>
                          </td>
                          <td className="py-6 px-10 text-right">
                            <Link href={`/reports?search=${booking.id}`} className="p-2 inline-block rounded-xl text-slate-300 dark:text-slate-600 hover:text-primary hover:bg-white dark:hover:bg-slate-800 transition-all">
                              <ArrowRight size={20} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Schedule Workspace */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6 px-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic">Jadwal Ruangan Terbooking</h2>
          </div>

          <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Ruangan</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Peminjam</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Jadwal</th>
                    <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {approvedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center italic text-slate-400 font-medium">Belum ada jadwal ruangan yang disetujui.</td>
                    </tr>
                  ) : (
                    approvedBookings.map((booking) => {
                      const start = new Date(booking.startTime);
                      const end = new Date(booking.endTime);
                      const dateStr = start.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
                      const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                      
                      return (
                        <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-10 font-bold text-slate-900 dark:text-white">{booking.room.name}</td>
                          <td className="py-4 px-10">
                            <p className="font-bold text-slate-700 dark:text-slate-300">{booking.user.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{booking.purpose}</p>
                          </td>
                          <td className="py-4 px-10">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{dateStr}</p>
                            <p className="text-xs font-medium text-slate-500">{timeStr}</p>
                          </td>
                          <td className="py-4 px-10 flex items-center justify-between gap-4">
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                              Disetujui
                            </span>
                            <a 
                              href={`/history/print/${booking.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                              title="Cetak Bukti Peminjaman (Barcode)"
                            >
                              <Printer size={16} />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
