import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RoomCalendar } from "@/components/dashboard/RoomCalendar";
import { Calendar } from "lucide-react";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch all bookings for the Calendar (to see room usage)
  const allBookings = await prisma.booking.findMany({
    include: { room: true, user: true },
    where: { status: { in: ["APPROVED", "PENDING", "PENDING_1", "PENDING_2", "PENDING_3"] } },
    orderBy: { startTime: "asc" }
  });

  const allSchedules = await (prisma as any).classSchedule.findMany({
    include: { room: true }
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in pb-12">
        <div className="flex items-center gap-4 px-2 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
              Kalender Jadwal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Pantau ketersediaan dan pemakaian seluruh ruangan kampus.</p>
          </div>
        </div>
        <RoomCalendar bookings={allBookings as any} schedules={allSchedules as any} />
      </div>
    </MainLayout>
  );
}
