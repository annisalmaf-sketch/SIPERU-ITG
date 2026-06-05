"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarPlus, 
  History, 
  DoorOpen, 
  FileCheck, 
  Settings,
  Building2,
  LogOut,
  ChevronRight,
  TrendingUp,
  Calendar,
  Users,
  CalendarClock
} from "lucide-react";
import { clsx } from "clsx";
import { useSession, signOut } from "next-auth/react";
import { getPendingCounts } from "@/actions/booking";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  
  const [pendingCounts, setPendingCounts] = useState({ bkkh: 0, sarpas: 0, kajur: 0 });

  useEffect(() => {
    if (role === "BKKH" || role === "SARPAS" || role === "KAJUR" || role === "ADMIN") {
      getPendingCounts().then(counts => setPendingCounts(counts));
      
      // Optionally poll every 30 seconds
      const interval = setInterval(() => {
        getPendingCounts().then(counts => setPendingCounts(counts));
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [role]);

  const getDashboardHref = () => {
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "BKKH") return "/dashboard/bkkh";
    if (role === "SARPAS") return "/dashboard/sarpas";
    if (role === "KAJUR") return "/dashboard/kajur";
    if (role === "DOSEN") return "/dashboard/dosen";
    return "/dashboard/mahasiswa";
  };

  const navItems = [
    { name: "Dashboard", href: getDashboardHref(), icon: LayoutDashboard },
    { name: "Kalender Jadwal", href: "/calendar", icon: Calendar, show: true },
    { name: "Book Room", href: "/booking", icon: CalendarPlus, show: role === "MAHASISWA" || role === "DOSEN" },
    { name: "My History", href: "/history", icon: History, show: role === "MAHASISWA" || role === "DOSEN" },
    { name: "Room Management", href: "/rooms", icon: DoorOpen, show: role === "ADMIN" },
    { name: "User Management", href: "/dashboard/admin/users", icon: Users, show: role === "ADMIN" },
    { name: "System Reports", href: "/reports", icon: TrendingUp, show: role === "ADMIN" },
    { name: "Persetujuan BKKH", href: "/dashboard/bkkh", icon: FileCheck, show: role === "BKKH" || role === "ADMIN", badge: role === "BKKH" || role === "ADMIN" ? pendingCounts.bkkh : 0 },
    { name: "Persetujuan Sarpas", href: "/dashboard/sarpas", icon: FileCheck, show: role === "SARPAS" || role === "ADMIN", badge: role === "SARPAS" || role === "ADMIN" ? pendingCounts.sarpas : 0 },
    { name: "Pengelola Ruangan", href: "/dashboard/kajur", icon: FileCheck, show: role === "KAJUR" || role === "ADMIN", badge: role === "KAJUR" || role === "ADMIN" ? pendingCounts.kajur : 0 },
    { name: "Jadwal Matkul", href: "/dashboard/kajur/schedule", icon: CalendarClock, show: role === "KAJUR" || role === "ADMIN" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col transition-all duration-300 print:hidden">
      {/* Brand Header */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 p-1 border border-primary-light/20 overflow-hidden shrink-0">
          <img src="/logo-itg.png" alt="ITG Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block">SIPERU <span className="text-primary">ITG</span></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        <div className="px-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</div>
        {navItems.filter(item => item.show !== false).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "sidebar-link group relative",
                isActive && "sidebar-link-active"
              )}
            >
              <Icon className={clsx(
                "w-5 h-5 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-slate-400 group-hover:text-primary group-hover:scale-110"
              )} />
              <span className="flex-1">{item.name}</span>
              {(item.badge as number) > 0 && (
                <div className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-sm">
                  {item.badge}
                </div>
              )}
              {isActive ? (
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-2" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link
          href="/settings"
          className={clsx(
            "sidebar-link mb-2 group",
            pathname === "/settings" && "sidebar-link-active"
          )}
        >
          <Settings className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-semibold group active:scale-95"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
}
