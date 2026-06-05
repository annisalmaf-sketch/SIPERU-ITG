"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar as CalendarIcon, CheckCircle2, Hourglass } from "lucide-react";
import { clsx } from "clsx";

interface Booking {
  id: string;
  roomId: string;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  room: {
    name: string;
    location: string;
  };
  user: {
    name: string;
  };
}

interface Schedule {
  id: string;
  roomId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  courseName: string;
  lecturerName: string;
  room: {
    name: string;
    location: string;
  };
}

export function RoomCalendar({ bookings, schedules = [] }: { bookings: Booking[], schedules?: Schedule[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Filter bookings for the selected date
  const selectedDateBookings = bookings.filter((b) => {
    const bDate = new Date(b.startTime);
    return (
      bDate.getDate() === selectedDate.getDate() &&
      bDate.getMonth() === selectedDate.getMonth() &&
      bDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const selectedDateSchedules = schedules.filter(s => s.dayOfWeek === selectedDate.getDay());
  
  const totalEvents = selectedDateBookings.length + selectedDateSchedules.length;

  return (
    <div className="glass-card rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-xl">
      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon size={24} className="text-primary" />
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="h-10 md:h-12"></div>;
            
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();
            
            // Check if this date has bookings
            const dayBookings = bookings.filter((b) => {
              const bDate = new Date(b.startTime);
              return bDate.toDateString() === date.toDateString();
            });
            const daySchedules = schedules.filter(s => s.dayOfWeek === date.getDay());
            
            const totalDayEvents = dayBookings.length + daySchedules.length;

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  "h-10 md:h-12 rounded-xl flex flex-col items-center justify-center relative transition-all duration-300",
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/30 font-bold scale-110 z-10"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                  isToday && !isSelected && "border-2 border-primary/50 text-primary font-bold"
                )}
              >
                <span>{date.getDate()}</span>
                {totalDayEvents > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {daySchedules.length > 0 && (
                      <div className={clsx("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-red-500")} title="Jadwal Matkul" />
                    )}
                    {dayBookings.slice(0, Math.max(0, 3 - (daySchedules.length > 0 ? 1 : 0))).map((b, i) => (
                      <div 
                        key={i} 
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          b.status === "APPROVED" ? (isSelected ? "bg-white" : "bg-green-500") : 
                          (isSelected ? "bg-white/70" : "bg-amber-400")
                        )}
                      />
                    ))}
                    {totalDayEvents > 3 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Details */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
          <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          <span className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-primary shadow-sm border border-slate-100 dark:border-slate-700">{totalEvents} Agenda</span>
        </h4>

        {totalEvents === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 italic">
            <CalendarIcon size={32} className="mb-2 opacity-20" />
            <p>Tidak ada ruangan yang dipakai</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {/* Matkul Schedules first */}
            {selectedDateSchedules.map((schedule) => (
              <div key={`sched-${schedule.id}`} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-y-slate-100 border-r-slate-100 dark:border-y-slate-700 dark:border-r-slate-700 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-bl-xl text-[10px] font-black uppercase tracking-wider">
                  Jadwal Matkul
                </div>
                <div className="flex justify-between items-start mb-2 pr-20">
                  <h5 className="font-black text-slate-900 dark:text-white">{schedule.room.name}</h5>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {schedule.courseName}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock size={14} className="text-red-500" />
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <MapPin size={14} className="text-slate-400" />
                    {schedule.room.location}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700 text-xs italic text-slate-400">
                    Dosen Pengampu: <span className="font-semibold text-slate-700 dark:text-slate-300">{schedule.lecturerName}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Ad-hoc Bookings */}
            {selectedDateBookings.map((booking) => {
              const start = new Date(booking.startTime);
              const end = new Date(booking.endTime);
              const isApproved = booking.status === "APPROVED";

              return (
                <div key={`book-${booking.id}`} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-black text-slate-900 dark:text-white">{booking.room.name}</h5>
                    <div className={clsx(
                      "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1",
                      isApproved ? "bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    )}>
                      {isApproved ? <CheckCircle2 size={10} /> : <Hourglass size={10} />}
                      {isApproved ? "Approved" : "Pending"}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock size={14} className="text-primary" />
                      {start.getHours().toString().padStart(2, '0')}:00 - {end.getHours().toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <MapPin size={14} className="text-slate-400" />
                      {booking.room.location}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700 text-xs italic text-slate-400">
                      Booked by: <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.user.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
