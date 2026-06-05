import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 print:bg-white">
      <Sidebar />
      <Navbar />
      <main className="lg:pl-72 pt-6 px-4 md:px-8 max-w-7xl mx-auto w-full pb-20 animate-fade-in print:p-0 print:m-0 print:w-full print:max-w-none print:lg:pl-0">
        {children}
      </main>
    </div>
  );
}
