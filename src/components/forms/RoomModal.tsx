"use client";

import React, { useTransition } from "react";
import { 
  X, 
  DoorOpen, 
  MapPin, 
  Users, 
  Layers,
  Loader2,
  Save
} from "lucide-react";
import { createRoom, updateRoom } from "@/actions/rooms";
import { toast } from "sonner";

interface Room {
  id?: string;
  name: string;
  location: string;
  capacity: number;
  type: string;
}

interface RoomModalProps {
  room?: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomModal({ room, isOpen, onClose }: RoomModalProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!room?.id;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (isEdit && room?.id) {
          await updateRoom(room.id, formData);
          toast.success("Room Updated Successfully");
        } else {
          await createRoom(formData);
          toast.success("New Room Created Successfully");
        }
        onClose();
      } catch (err: any) {
        toast.error("Operation Failed", { description: err.message });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-transparent dark:border-slate-800">
        {/* Header */}
        <div className="relative p-8 bg-primary text-white overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                {isEdit ? "Ubah Data Ruangan" : "Tambah Ruangan"}
              </h2>
              <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                Sistem Manajemen Aset
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <DoorOpen size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Name */}
            <div className="md:col-span-2 space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Nama Ruangan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <DoorOpen size={18} />
                </div>
                <input
                  name="name"
                  required
                  defaultValue={room?.name}
                  placeholder="e.g. Auditorium Utama"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Lokasi Ruangan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <MapPin size={18} />
                </div>
                <select
                  name="location"
                  required
                  defaultValue={room?.location || ""}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Pilih Gedung...</option>
                  <option value="Gedung A">Gedung A</option>
                  <option value="Gedung B">Gedung B</option>
                  <option value="Gedung C">Gedung C</option>
                  <option value="Gedung D">Gedung D</option>
                  <option value="Gedung E">Gedung E</option>
                  <option value="Gedung F">Gedung F</option>
                  <option value="Gedung G">Gedung G</option>
                  <option value="Gedung Rektorat">Gedung Rektorat</option>
                  <option value="Gedung PKM">Gedung PKM (Pusat Kegiatan Mahasiswa)</option>
                  <option value="Perpustakaan">Perpustakaan</option>
                </select>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Kapasitas (Orang)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Users size={18} />
                </div>
                <input
                  name="capacity"
                  type="number"
                  required
                  defaultValue={room?.capacity}
                  placeholder="50"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                />
              </div>
            </div>

            {/* Type */}
            <div className="md:col-span-2 space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Tipe Ruangan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Layers size={18} />
                </div>
                <select
                  name="type"
                  required
                  defaultValue={room?.type || "CLASSROOM"}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="CLASSROOM">Ruang Kelas</option>
                  <option value="LABORATORY">Laboratorium</option>
                  <option value="AUDITORIUM">Auditorium / Aula</option>
                  <option value="MEETING ROOM">Ruang Rapat</option>
                  <option value="MULTIPURPOSE">Ruang Serbaguna (Acara & Kelas)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-[2] btn-primary py-4 text-xs"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  {isEdit ? "Simpan Perubahan" : "Simpan Ruangan"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
