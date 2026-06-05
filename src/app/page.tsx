import React from "react";
import Link from "next/link";
import { 
  Building2, 
  ArrowRight, 
  CalendarDays, 
  ShieldCheck, 
  Zap, 
  Stamp, 
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { clsx } from "clsx";

export default function LandingPage() {
  const features = [
    {
      title: "Pemesanan Instan",
      desc: "Cek ketersediaan dan ajukan peminjaman ruangan dalam hitungan detik tanpa antre.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      title: "E-Seal Validation",
      desc: "Persetujuan digital yang aman dan transparan menggunakan teknologi stempel elektronik.",
      icon: Stamp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      title: "Integrasi Real-time",
      desc: "Jadwal dan status persetujuan yang ter-update secara langsung untuk semua peran.",
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Akses Terpusat",
      desc: "Satu portal terintegrasi untuk Mahasiswa, Dosen, BKKH, Sarpas, dan Pengelola Ruangan.",
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden font-manrope selection:bg-primary/30 selection:text-white">
      {/* Background Animated Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-blue-500/20 blur-[100px] mix-blend-screen animate-blob animation-delay-4000"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-50 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-primary-light/20 overflow-hidden p-1">
            <img src="/logo-itg.png" alt="ITG Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white block">SIPERU <span className="text-primary">ITG</span></span>
          </div>
        </div>
        
        <Link 
          href="/login" 
          className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md"
        >
          Masuk <ChevronRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-24 text-center max-w-5xl mx-auto mt-10 md:mt-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Sistem Versi 2.0 Telah Rilis
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary italic pr-2">Ruangan</span><br />
          Tanpa Hambatan.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '300ms' }}>
          Platform manajemen aset ruang akademik Institut Teknologi Garut yang modern, cepat, dan terintegrasi penuh untuk seluruh ekosistem kampus.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Link 
            href="/login" 
            className="group px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black tracking-wide transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            Mulai Gunakan Sistem
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black tracking-wide border border-white/10 transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto text-center backdrop-blur-sm"
          >
            Pelajari Fitur
          </a>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group animate-slide-up"
              style={{ animationDelay: `${500 + (idx * 100)}ms` }}
            >
              <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6", feature.bg, feature.color, feature.border, "border")}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Comprehensive Footer */}
      <footer className="relative z-10 bg-white border-t border-slate-200 mt-auto text-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            
            {/* Column 1: Brand & Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center p-1.5 shadow-lg shadow-primary/20">
                  <img src="/logo-itg.png" alt="ITG Logo" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">SIPERU <span className="text-primary">ITG</span></span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm font-medium">
                Komitmen Institut Teknologi Garut dalam memfasilitasi kegiatan akademik dan kemahasiswaan melalui layanan peminjaman ruangan yang terpadu dan terintegrasi.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-6 md:pl-8">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Navigasi</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Buat Peminjaman</Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Status Peminjaman</Link>
                </li>
                <li>
                  <a href="#features" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Panduan Sistem</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Kontak</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <Mail size={16} className="text-primary" />
                  <a href="mailto:baak@itg.ac.id" className="hover:text-primary transition-colors">baak@itg.ac.id</a>
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <Phone size={16} className="text-primary" />
                  <span>+62 811-2233-4455 (CS SIPERU)</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-bold text-slate-500">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Jl. Mayor Syamsu No. 1, Jayaraga,<br />Kec. Tarogong Kidul, Kabupaten Garut.</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Institut Teknologi Garut. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Globe size={14} />
              Academic Portal ITG
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
