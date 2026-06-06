"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarClock,
  Plus,
  Trash2,
  Loader2,
  Search,
  BookOpen,
  User as UserIcon,
  Clock,
  MapPin,
  AlertCircle,
  Pencil,
} from "lucide-react";
import {
  getClassSchedules,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
} from "@/actions/schedule";
import { getRooms } from "@/actions/rooms";

const DAYS = [
  { id: 1, name: "Senin" },
  { id: 2, name: "Selasa" },
  { id: 3, name: "Rabu" },
  { id: 4, name: "Kamis" },
  { id: 5, name: "Jumat" },
  { id: 6, name: "Sabtu" },
  { id: 0, name: "Minggu" },
];

export default function ScheduleManagementPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dayFilter, setDayFilter] = useState("all");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    roomId: "",
    dayOfWeek: "1",
    startTime: "08:00",
    endTime: "10:00",
    courseName: "",
    lecturerName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [scheduleRes, roomsRes] = await Promise.all([
        getClassSchedules(),
        getRooms(),
      ]);

      if (scheduleRes.success) setSchedules(scheduleRes.schedules);
      if (roomsRes.success) setRooms(roomsRes.rooms ?? []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (!formData.roomId) {
      setError("Pilih ruangan terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("Waktu mulai harus lebih awal dari waktu selesai");
      setIsSubmitting(false);
      return;
    }

    let res;
    if (editingId) {
      res = await updateClassSchedule(editingId, {
        ...formData,
        dayOfWeek: parseInt(formData.dayOfWeek),
      });
    } else {
      res = await createClassSchedule({
        ...formData,
        dayOfWeek: parseInt(formData.dayOfWeek),
      });
    }

    if (res.success) {
      setSuccess(
        editingId
          ? "Jadwal perkuliahan berhasil diperbarui!"
          : "Jadwal perkuliahan berhasil ditambahkan!",
      );
      setShowForm(false);
      setEditingId(null);
      setFormData({
        roomId: "",
        dayOfWeek: "1",
        startTime: "08:00",
        endTime: "10:00",
        courseName: "",
        lecturerName: "",
      });
      fetchData();

      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(
        res.error ||
          (editingId ? "Gagal memperbarui jadwal" : "Gagal menambahkan jadwal"),
      );
    }

    setIsSubmitting(false);
  };

  const handleEdit = (schedule: any) => {
    setEditingId(schedule.id);
    setFormData({
      roomId: schedule.roomId,
      dayOfWeek: schedule.dayOfWeek.toString(),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      courseName: schedule.courseName,
      lecturerName: schedule.lecturerName,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;

    const res = await deleteClassSchedule(id);
    if (res.success) {
      fetchData();
    } else {
      alert("Gagal menghapus jadwal");
    }
  };

  const getDayName = (dayId: number) => {
    return DAYS.find((d) => d.id === dayId)?.name || "Unknown";
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch =
      s.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.room?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDay =
      dayFilter === "all" || s.dayOfWeek === parseInt(dayFilter);

    return matchesSearch && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarClock className="text-primary" />
            Jadwal Matkul (Perkuliahan)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Kelola jadwal perkuliahan tetap yang memblokir ruangan di kalender
            utama.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setFormData({
                roomId: "",
                dayOfWeek: "1",
                startTime: "08:00",
                endTime: "10:00",
                courseName: "",
                lecturerName: "",
              });
            }
            setShowForm(!showForm);
          }}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center gap-2"
        >
          {showForm ? (
            "Batal"
          ) : (
            <>
              <Plus size={18} /> Tambah Jadwal
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
          <AlertCircle size={18} /> {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b dark:border-slate-800 pb-2">
            {editingId ? "Edit Jadwal" : "Form Tambah Jadwal"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mata Kuliah
              </label>
              <div className="relative">
                <BookOpen
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Cth: Algoritma Pemrograman"
                  value={formData.courseName}
                  onChange={(e) =>
                    setFormData({ ...formData, courseName: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dosen Pengampu
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Nama Dosen"
                  value={formData.lecturerName}
                  onChange={(e) =>
                    setFormData({ ...formData, lecturerName: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pilih Ruangan
              </label>
              <select
                required
                value={formData.roomId}
                onChange={(e) =>
                  setFormData({ ...formData, roomId: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm dark:text-white dark:bg-slate-900"
              >
                <option value="">-- Pilih Ruangan --</option>
                {rooms
                  .filter(
                    (r) => r.type === "CLASSROOM" || r.type === "LABORATORY",
                  )
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hari
              </label>
              <select
                required
                value={formData.dayOfWeek}
                onChange={(e) =>
                  setFormData({ ...formData, dayOfWeek: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm dark:text-white dark:bg-slate-900"
              >
                {DAYS.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Waktu Mulai
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm dark:text-white dark:[color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Waktu Selesai
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm dark:text-white dark:[color-scheme:dark]"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t dark:border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : editingId ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Jadwal"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari matkul, dosen, atau ruangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm font-medium dark:text-white"
          />
        </div>
        <select
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-sm font-medium bg-white dark:bg-slate-900 dark:text-white"
        >
          <option value="all">Semua Hari</option>
          {DAYS.map((day) => (
            <option key={day.id} value={day.id}>
              {day.name}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <CalendarClock
            size={48}
            className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
          />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Tidak ada jadwal
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Belum ada jadwal perkuliahan yang ditambahkan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

              <div className="flex justify-between items-start mb-3">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-lg">
                  {getDayName(schedule.dayOfWeek)}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">
                {schedule.courseName}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                <UserIcon size={14} /> {schedule.lecturerName}
              </p>

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <MapPin size={16} className="text-slate-400" />
                  {schedule.room?.name || "Ruangan tidak diketahui"}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Clock size={16} className="text-slate-400" />
                  {schedule.startTime} - {schedule.endTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
