"use client";

import React, { useState, useTransition } from "react";
import { 
  DoorOpen, 
  ChevronDown, 
  CalendarDays, 
  AlertCircle, 
  Clock, 
  User, 
  Send,
  Loader2,
  CheckCircle2,
  FileUp
} from "lucide-react";
import { createBooking } from "@/actions/booking";
import { clsx } from "clsx";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  capacity: number;
}

export function BookingForm({ rooms }: { rooms: Room[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await createBooking(formData);
        setSuccess(true);
        toast.success("Booking Request Submitted", {
          description: "Your request is now pending approval by the Kajur.",
        });
      } catch (err: any) {
        setError(err.message || "An error occurred while creating the booking.");
        toast.error("Booking Failed", {
          description: err.message,
        });
      }
    });
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-3xl p-12 text-center animate-scale-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Booking Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your request has been sent to the Head of Department for approval.</p>
        <button 
          onClick={() => window.location.href = "/history"}
          className="btn-primary"
        >
          View My History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl glass-card rounded-3xl overflow-hidden shadow-2xl border-none animate-slide-up">
      <form action={handleSubmit} className="p-8 md:p-10 flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Room Request Form</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Fill in the details below to reserve an academic facility.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border border-red-100 animate-in fade-in zoom-in duration-300">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Room Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Selected Room</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors duration-300">
              <DoorOpen size={20} />
            </div>
            <select 
              name="roomId"
              required
              defaultValue=""
              className="block w-full pl-12 pr-10 py-4 text-sm border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:bg-slate-900 appearance-none font-bold text-slate-700 dark:text-slate-200 transition-all duration-300 cursor-pointer"
            >
              <option disabled value="">Choose a room from the inventory...</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} {room.location ? `(${room.location})` : ''} — Capacity: {room.capacity} seats
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Reservation Date</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <CalendarDays size={18} />
              </div>
              <input 
                name="date"
                type="date" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:bg-slate-900 outline-none transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-700 dark:text-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Start Time</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Clock size={18} />
              </div>
              <input 
                name="startTime"
                type="time" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:bg-slate-900 outline-none transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-700 dark:text-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">End Time</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Clock size={18} />
              </div>
              <input 
                name="endTime"
                type="time" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:bg-slate-900 outline-none transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-700 dark:text-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Agenda & Purpose</label>
          <textarea 
            name="purpose"
            required
            className="block w-full p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:bg-slate-900 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all duration-300 resize-none min-h-[140px] placeholder:text-slate-400"
            placeholder="Please explain the nature of your event or meeting..."
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Point of Contact</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <User size={18} />
            </div>
            <input 
              name="pic"
              type="text"
              placeholder="PIC Name / Department"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:bg-slate-900 outline-none transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-slate-700 dark:text-slate-200 text-sm"
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Upload Surat Peminjaman (PDF/Image)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <FileUp size={18} />
            </div>
            <input 
              name="document"
              type="file"
              accept=".pdf,image/*"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:bg-slate-900 outline-none transition-all duration-300 bg-slate-50/30 dark:bg-slate-900/30 font-bold text-slate-500 dark:text-slate-400 text-sm cursor-pointer file:hidden"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium px-1">Optional: Attach the official department request letter if available.</p>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-4 bg-slate-50/80 dark:bg-slate-900/80 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            Cancel Request
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className={clsx(
              "btn-primary w-full sm:w-auto min-w-[200px]",
              isPending && "opacity-70 cursor-not-allowed"
            )}
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Reservation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
