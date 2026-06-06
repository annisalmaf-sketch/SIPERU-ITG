export const dynamic = "force-dynamic";
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/forms/BookingForm";

export default async function BookingPage() {
  const rooms = await prisma.room.findMany({
    where: { status: "AVAILABLE" },
    select: { id: true, name: true, capacity: true, location: true }
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-12">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">New Booking Request</h1>
          <p className="text-on-surface-variant">Fill out the details below to reserve an academic or meeting space.</p>
        </div>

        {/* Form Component */}
        <BookingForm rooms={rooms} />

        {/* Helpful Info Card */}
        <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/10 max-w-4xl">
          <Info size={24} className="text-primary mt-1 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Booking Guidelines</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Bookings must be submitted at least 24 hours in advance. For weekend use or high-capacity rooms, approval from the Head of Department (Kajur) is required. Ensure you have the necessary permissions for extra equipment.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
