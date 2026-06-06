import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  Users,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  FileCheck,
  Settings,
  BadgeCheck,
  XCircle,
  Clock
} from "lucide-react";

export default async function PrintTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { 
      room: true,
      user: true 
    }
  });

  if (!booking || booking.status !== "APPROVED") {
    notFound();
  }

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const dateStr = start.toLocaleDateString("id-ID", { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')} WIB`;

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/history/print/${booking.id}`;

  const isBkkhVerified = ["PENDING_2", "PENDING_3", "APPROVED"].includes(booking.status);
  const isSarpasVerified = ["PENDING_3", "APPROVED"].includes(booking.status);
  const isKajurVerified = booking.status === "APPROVED";
  const isRejected = booking.status === "REJECTED";

  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <div className="max-w-4xl mx-auto p-12 bg-white">
        {/* Kop Surat */}
        <div className="flex items-center justify-between border-b-[3px] border-black pb-6 mb-1 border-double">
          <div className="flex items-center justify-center w-24 h-24">
            <img src="/logo-itg.png" alt="ITG Logo" className="w-20 h-20 object-contain grayscale" />
          </div>
          <div className="text-center flex-1 px-4 space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-wide">Institut Teknologi Garut</h1>
            <h2 className="text-lg font-bold">Biro Administrasi Akademik & Kemahasiswaan</h2>
            <p className="text-sm">Jl. Mayor Syamsu No. 1, Jayaraga, Tarogong Kidul, Kabupaten Garut, Jawa Barat 44151</p>
            <p className="text-sm">Website: www.itg.ac.id | Email: info@itg.ac.id</p>
          </div>
          <div className="w-24 h-24"></div> {/* Spacer to balance logo */}
        </div>
        <div className="border-b border-black mb-8"></div>
        
        {/* Nomor & Tanggal */}
        <div className="flex justify-between mb-10 text-sm">
          <div>
            <table className="w-full">
              <tbody>
                <tr><td className="w-20 py-0.5">Nomor</td><td>: {booking.id.toUpperCase().substring(0, 8)}/ITG/PR/{start.getFullYear()}</td></tr>
                <tr><td className="py-0.5">Lampiran</td><td>: -</td></tr>
                <tr><td className="py-0.5">Perihal</td><td>: <strong>Persetujuan Peminjaman Ruangan</strong></td></tr>
              </tbody>
            </table>
          </div>
          <div className="text-right">
            <p>Garut, {todayStr}</p>
          </div>
        </div>

        {/* Isi Surat */}
        <div className="space-y-4 text-justify leading-relaxed text-sm">
          <p>Kepada Yth.,</p>
          <p className="font-bold">{booking.user.name}</p>
          <p>di Tempat</p>
          
          <br />
          <p>Dengan hormat,</p>
          <p>
            Menindaklanjuti permohonan peminjaman ruangan yang Saudara/i ajukan melalui Sistem Informasi Peminjaman Ruangan (SIPERU) Institut Teknologi Garut, bersama surat ini kami sampaikan bahwa permohonan tersebut <strong>DISETUJUI</strong> dengan rincian kegiatan sebagai berikut:
          </p>
          
          <table className="w-full my-6 ml-8">
            <tbody>
              <tr><td className="w-48 py-1.5">Nama Peminjam</td><td className="w-4">:</td><td className="font-bold">{booking.user.name}</td></tr>
              <tr><td className="py-1.5">NIM / NIDN</td><td>:</td><td>{booking.user.email.split('@')[0]}</td></tr>
              <tr><td className="py-1.5">Ruangan</td><td>:</td><td className="font-bold">{booking.room.name} ({booking.room.location})</td></tr>
              <tr><td className="py-1.5">Tanggal Pelaksanaan</td><td>:</td><td>{dateStr}</td></tr>
              <tr><td className="py-1.5">Waktu</td><td>:</td><td>{timeStr}</td></tr>
              <tr><td className="py-1.5">Keperluan / Agenda</td><td>:</td><td>{booking.purpose}</td></tr>
              <tr><td className="py-1.5">Point of Contact</td><td>:</td><td>{booking.pic || booking.user.name}</td></tr>
            </tbody>
          </table>

        </div>

        {/* Penutup, Tanda Tangan & QR Code (Unbreakable Block) */}
        <div className="break-inside-avoid print:pt-20">
          <div className="space-y-4 text-justify leading-relaxed text-sm">
            <p>
              Demikian surat persetujuan ini diterbitkan untuk dapat dipergunakan sebagaimana mestinya. Peminjam diwajibkan untuk menjaga kebersihan dan keutuhan fasilitas ruangan yang digunakan. Harap menunjukkan surat ini kepada petugas keamanan atau pengelola gedung sebelum menggunakan ruangan.
            </p>
            <p>
              Atas perhatian dan kerja samanya, kami ucapkan terima kasih.
            </p>
          </div>

          {/* Tanda Tangan */}
          <div className="mt-12 w-full">
            <table className="w-full text-sm text-center border-collapse">
              <tbody>
                <tr>
                  <td className="w-1/3 align-top pb-2">
                    <p>Mengetahui,</p>
                    <p className="font-bold">Bagian BKKH ITG</p>
                  </td>
                  <td className="w-1/3 align-top pb-2">
                    <p>Mengetahui,</p>
                    <p className="font-bold">Bagian SARPAS ITG</p>
                  </td>
                  <td className="w-1/3 align-top pb-2">
                    <p>Menyetujui,</p>
                    <p className="font-bold">Pengelola Ruangan (BAAK)</p>
                  </td>
                </tr>
                <tr>
                  <td className="h-20 align-middle relative">
                    <div className="flex items-center justify-center">
                      {/* Digital Stamp BKKH */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-[40%] -rotate-12 border-[2px] border-indigo-600/40 rounded-full w-20 h-20 flex flex-col items-center justify-center pointer-events-none p-1 z-0">
                          <div className="border border-indigo-600/40 rounded-full w-full h-full flex flex-col items-center justify-center">
                            <span className="text-[5px] font-black uppercase text-indigo-700/60 tracking-widest">Institut Teknologi</span>
                            <span className="text-[9px] font-black uppercase text-indigo-700/60">GARUT</span>
                            <span className="text-[5px] font-bold uppercase text-indigo-700/60 border-t border-indigo-600/40 pt-0.5 mt-0.5 w-3/4 text-center">BKKH</span>
                          </div>
                      </div>
                      <span className="text-xl italic text-blue-800/80 -rotate-6 select-none font-serif tracking-widest relative z-10">
                          Encep J.H.
                      </span>
                    </div>
                  </td>
                  <td className="h-20 align-middle relative">
                    <div className="flex items-center justify-center">
                      {/* Digital Stamp SARPAS */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[50%] rotate-6 border-[2px] border-indigo-600/40 rounded-full w-20 h-20 flex flex-col items-center justify-center pointer-events-none p-1 z-0">
                          <div className="border border-indigo-600/40 rounded-full w-full h-full flex flex-col items-center justify-center">
                            <span className="text-[5px] font-black uppercase text-indigo-700/60 tracking-widest">Institut Teknologi</span>
                            <span className="text-[9px] font-black uppercase text-indigo-700/60">GARUT</span>
                            <span className="text-[5px] font-bold uppercase text-indigo-700/60 border-t border-indigo-600/40 pt-0.5 mt-0.5 w-3/4 text-center">SARPAS</span>
                          </div>
                      </div>
                      <span className="text-2xl italic text-blue-800/80 -rotate-12 select-none font-serif tracking-tighter relative z-10">
                          Ganjar J.J.
                      </span>
                    </div>
                  </td>
                  <td className="h-20 align-middle relative">
                    <div className="flex items-center justify-center">
                      {/* Digital Stamp BAAK */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[45%] -rotate-3 border-[2px] border-indigo-600/40 rounded-full w-20 h-20 flex flex-col items-center justify-center pointer-events-none p-1 z-0">
                          <div className="border border-indigo-600/40 rounded-full w-full h-full flex flex-col items-center justify-center">
                            <span className="text-[5px] font-black uppercase text-indigo-700/60 tracking-widest">Institut Teknologi</span>
                            <span className="text-[9px] font-black uppercase text-indigo-700/60">GARUT</span>
                            <span className="text-[5px] font-bold uppercase text-indigo-700/60 border-t border-indigo-600/40 pt-0.5 mt-0.5 w-3/4 text-center">BAAK</span>
                          </div>
                      </div>
                      <span className="text-xl italic text-blue-800/80 rotate-3 select-none font-serif tracking-wider relative z-10">
                          Yanti Y.
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-bottom pt-4">
                    <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
                    <p className="text-[10px]">NIP. -</p>
                  </td>
                  <td className="align-bottom pt-4">
                    <p className="font-bold underline">Ganjar Jojon Johari, S.T., M.T.</p>
                    <p className="text-[10px]">NIP. -</p>
                  </td>
                  <td className="align-bottom pt-4">
                    <p className="font-bold underline">Ir. Yanti Yulianti, M.M.</p>
                    <p className="text-[10px]">NIP. -</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* QR Code Verifikasi */}
          <div className="mt-12 flex items-center gap-5 border-t-2 border-b-2 border-slate-900 py-4 px-6 bg-slate-50/50 print:bg-transparent">
             <div className="p-1.5 border-2 border-slate-900 bg-white">
               <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=55x55&data=${encodeURIComponent(verificationUrl)}`} 
                  alt="QR Code Verification"
                  className="w-[55px] h-[55px] grayscale"
               />
             </div>
             <div className="flex-1">
               <p className="text-sm font-black uppercase tracking-widest text-slate-900">Dokumen Digital Sah & Terverifikasi</p>
               <p className="text-[11px] text-slate-700 leading-relaxed mt-1">
                 Surat persetujuan peminjaman ruangan ini digenerate secara otomatis oleh Sistem Informasi Peminjaman Ruangan (SIPERU) ITG. 
                 Scan QR Code di samping untuk memverifikasi keaslian dokumen secara langsung melalui sistem.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Auto-print Script */}
      <script dangerouslySetInnerHTML={{ __html: "window.print();" }} />
    </div>
  );
}
