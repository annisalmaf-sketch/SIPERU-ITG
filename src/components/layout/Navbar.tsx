"use client";

import React, { useState } from "react";
import { 
  Menu, 
  Bell, 
  User, 
  Search, 
  LogOut, 
  Settings as SettingsIcon,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { clsx } from "clsx";
import { getNotifications } from "@/actions/booking";
import { AlertCircle, AlertTriangle } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  React.useEffect(() => {
    if (session?.user) {
      getNotifications().then(data => setNotifications(data));
      const interval = setInterval(() => {
        getNotifications().then(data => setNotifications(data));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const hasNotifications = notifications.length > 0;

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/60 flex justify-between items-center w-full px-6 py-4 lg:pl-80 transition-all duration-300 print:hidden">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <Menu size={20} />
        </button>
        
        {/* Search Bar - Desktop Only */}
        <div className="hidden md:flex items-center gap-3 bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200/50 w-full max-w-md group focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
          <Search size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for rooms, bookings..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={clsx(
              "relative p-2.5 rounded-xl transition-all duration-300 group",
              showNotifications ? "bg-primary/10 text-primary" : "hover:bg-slate-100"
            )}
          >
            <Bell size={20} className={clsx(showNotifications ? "text-primary" : "text-slate-500 group-hover:text-primary")} />
            {hasNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 py-4 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
               <div className="px-6 pb-3 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Recent Alerts</span>
                  <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Clear all</span>
               </div>
               <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p className="text-xs text-slate-500">Belum ada notifikasi baru.</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.type === 'success' ? CheckCircle2 : n.type === 'warning' ? AlertTriangle : n.type === 'error' ? AlertCircle : Clock;
                      const color = n.type === 'success' ? 'text-green-500' : n.type === 'warning' ? 'text-amber-500' : n.type === 'error' ? 'text-red-500' : 'text-blue-500';
                      
                      return (
                        <Link href={n.link || "#"} key={n.id} onClick={() => setShowNotifications(false)}>
                          <div className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex gap-4">
                             <div className={clsx("mt-1", color)}>
                                <Icon size={18} />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                                <p className="text-[9px] text-slate-300 mt-1 font-bold">{n.time}</p>
                             </div>
                          </div>
                        </Link>
                      )
                    })
                  )}
               </div>
               <div className="px-6 pt-3 border-t border-slate-50 dark:border-slate-800 text-center">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">View All Notifications</button>
               </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* User Menu */}
        <div className="relative">
          <div 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className={clsx(
              "flex items-center gap-3 group cursor-pointer p-1 rounded-2xl transition-all",
              showUserMenu ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {session?.user?.name || "Loading..."}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {((session?.user as any)?.role === "KAJUR" ? "BAAK" : (session?.user as any)?.role) || "Guest"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light p-[2px] shadow-lg shadow-primary/20 transform group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                <User size={20} className="text-primary" />
              </div>
            </div>
          </div>

          {/* User Dropdown Popover */}
          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="p-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">{session?.user?.email}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Institutional ID: {session?.user?.email?.split('@')[0]}</p>
               </div>
               
               <Link 
                href="/settings"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-all font-bold text-xs"
               >
                  <SettingsIcon size={18} />
                  Settings
               </Link>
               
               <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold text-xs mt-1"
               >
                  <LogOut size={18} />
                  Sign Out
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
