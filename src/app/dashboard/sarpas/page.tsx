import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Signature, 
  CheckCircle2, 
  ListFilter,
  Zap,
  TrendingUp,
  Inbox
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { KajurWorkspace } from "@/components/dashboard/KajurWorkspace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { clsx } from "clsx";
import { PendingNotificationBanner } from "@/components/dashboard/PendingNotificationBanner";

export default async function SarpasDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "SARPAS" && (session.user as any).role !== "ADMIN")) {
    redirect("/login");
  }

  const allBookings = await prisma.booking.findMany({
    include: { room: true, user: true },
    orderBy: { startTime: "asc" }
  });

  const kajurLevel = 2;
  const targetPendingStatus = "PENDING_2";
  const pendingCount = allBookings.filter(b => b.status === targetPendingStatus).length;

  const stats = [
    { 
      label: "Needs Review", 
      value: pendingCount.toString(), 
      sub: "Immediate Action (Tier 2)", 
      icon: Signature, 
      color: "bg-primary", 
      accent: "text-primary",
      gradient: "from-blue-600 to-indigo-700" 
    },
    { 
      label: "Approved Today", 
      value: "8", 
      sub: "+2% from yesterday", 
      icon: CheckCircle2, 
      color: "bg-green-500", 
      accent: "text-green-500",
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      label: "Response Time", 
      value: "1.5h", 
      sub: "Standard: < 2.0h", 
      icon: Zap, 
      color: "bg-amber-500", 
      accent: "text-amber-500",
      gradient: "from-amber-500 to-orange-600"
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-12 animate-fade-in pb-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Persetujuan Sarpas</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Tinjau dan validasi permintaan peminjaman ruangan tahap 2.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Auto-Refresh: ON</div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping mr-2"></div>
          </div>
        </div>

        <PendingNotificationBanner count={pendingCount} role="Sarpas" />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label}
              className={clsx(
                "group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-slide-up",
                idx === 0 ? "bg-slate-900 dark:bg-primary text-white" : "glass-card"
              )}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                <div className="flex justify-between items-start">
                  <div className={clsx(
                    "p-3 rounded-2xl transition-transform duration-500 group-hover:rotate-12",
                    idx === 0 ? "bg-white/10" : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    <stat.icon size={24} className={idx === 0 ? "text-white" : stat.accent} />
                  </div>
                  {idx === 1 && (
                    <div className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                      <TrendingUp size={12} />
                      LIVE
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    idx === 0 ? "text-white/60" : "text-slate-400"
                  )}>
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black tracking-tighter italic">{stat.value}</span>
                    <span className={clsx(
                      "text-xs font-bold opacity-80",
                      idx === 0 ? "text-white/80" : "text-slate-500"
                    )}>
                      {stat.sub}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={clsx(
                "absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:scale-150",
                idx === 0 ? "bg-white/20" : idx === 1 ? "bg-green-400" : "bg-amber-400"
              )}></div>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <KajurWorkspace bookings={allBookings} kajurLevel={kajurLevel} />
        </section>
      </div>
    </MainLayout>
  );
}
