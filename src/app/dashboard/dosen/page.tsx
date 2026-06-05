import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Plus, 
  CalendarDays, 
  CheckCircle2, 
  Hourglass, 
  Calendar
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

export default async function DosenDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "DOSEN") {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  
  // Fetch Stats for Dosen
  const totalBookings = await prisma.booking.count({ where: { userId } });
  const approvedBookings = await prisma.booking.count({ where: { userId, status: "APPROVED" } });
  const pendingBookings = await prisma.booking.count({ where: { userId, status: { in: ["PENDING", "PENDING_1", "PENDING_2", "PENDING_3"] } } });

  const stats = [
    { label: "My Bookings", value: totalBookings, sub: "All time", icon: CalendarDays, accent: "text-blue-600", bg: "bg-blue-50" },
    { label: "Approved", value: approvedBookings, sub: "Ready for use", icon: CheckCircle2, accent: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: pendingBookings, sub: "Awaiting review", icon: Hourglass, accent: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in pb-12">
        {/* Welcome Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
              Dashboard Dosen
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Selamat datang, {session.user.name}.</p>
          </div>
          <Link href="/booking">
            <button className="btn-primary group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Buat Peminjaman
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

      </div>
    </MainLayout>
  );
}
