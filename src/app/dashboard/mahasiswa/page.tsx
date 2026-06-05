import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Plus, 
  CalendarDays, 
  CheckCircle2, 
  Hourglass, 
  ArrowRight,
  History,
  TrendingUp,
  MapPin,
  Calendar
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

export default async function MahasiswaDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  
  // Fetch Real Stats
  const totalBookings = await prisma.booking.count({ where: { userId } });
  const approvedBookings = await prisma.booking.count({ where: { userId, status: "APPROVED" } });
  const pendingBookings = await prisma.booking.count({ where: { userId, status: { in: ["PENDING", "PENDING_1", "PENDING_2", "PENDING_3"] } } });

  const recentBookings = await prisma.booking.findMany({
    where: { userId },
    include: { room: true },
    orderBy: { startTime: "desc" },
    take: 5
  });

  const stats = [
    { label: "My Bookings", value: totalBookings, sub: "All time", icon: CalendarDays, accent: "text-blue-600", bg: "bg-blue-50" },
    { label: "Approved", value: approvedBookings, sub: "Ready for use", icon: CheckCircle2, accent: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: pendingBookings, sub: "Awaiting review", icon: Hourglass, accent: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in">
        {/* Welcome Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
              Hello, {session.user.name?.split(" ")[0]}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Your academic resource dashboard is ready.</p>
          </div>
          <Link href="/booking">
            <button className="btn-primary group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Book New Room
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label}
              className="glass-card rounded-[2.5rem] p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={clsx("p-4 rounded-2xl", stat.bg, stat.accent)}>
                  <stat.icon size={24} />
                </div>
                {idx === 0 && (
                  <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black tracking-widest text-slate-400">
                    UPDATED
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">{stat.value}</h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Activity */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Recent Activity
            </h2>
            <Link href="/history" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
              Full History
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none">
             {recentBookings.length === 0 ? (
               <div className="py-20 flex flex-col items-center justify-center text-center gap-4 opacity-30 italic">
                  <Calendar size={48} />
                  <p className="font-bold">No recent activity to show.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource</th>
                       <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule</th>
                       <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                       <th className="py-4 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Details</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {recentBookings.map((booking) => {
                       const start = new Date(booking.startTime);
                       const dateStr = start.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                       const isApproved = booking.status === "APPROVED";
                       const isPending = ["PENDING", "PENDING_1", "PENDING_2", "PENDING_3"].includes(booking.status);

                       return (
                         <tr key={booking.id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                           <td className="py-6 px-10">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                 <History size={20} />
                               </div>
                               <div>
                                 <p className="font-black text-slate-900">{booking.room.name}</p>
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                   <MapPin size={10} />
                                   {booking.room.location}
                                 </div>
                               </div>
                             </div>
                           </td>
                           <td className="py-6 px-10">
                             <div className="flex flex-col">
                               <span className="text-sm font-black text-slate-900">{dateStr}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">{start.getHours()}:00 - {start.getHours() + 2}:00</span>
                             </div>
                           </td>
                           <td className="py-6 px-10">
                              <div className={clsx(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                isApproved ? "bg-green-50 text-green-600 border-green-100" : 
                                isPending ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                "bg-red-50 text-red-600 border-red-100"
                              )}>
                                {booking.status === "PENDING_1" ? "MENUNGGU P.1" : 
                                 booking.status === "PENDING_2" ? "MENUNGGU P.2" : 
                                 booking.status === "PENDING_3" ? "MENUNGGU P.3" : 
                                 booking.status}
                              </div>
                           </td>
                           <td className="py-6 px-10 text-right">
                              <button className="p-2 rounded-xl text-slate-300 hover:text-primary hover:bg-white transition-all">
                                <ArrowRight size={20} />
                              </button>
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
