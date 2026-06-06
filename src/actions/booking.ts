"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function createBooking(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    throw new Error("Session invalid. Please logout and login again.");
  }

  const roomId = formData.get("roomId") as string;
  const dateStr = formData.get("date") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;
  const purpose = formData.get("purpose") as string;
  const pic = formData.get("pic") as string;
  const documentFile = formData.get("document") as File;

  if (!roomId || !dateStr || !startTimeStr || !endTimeStr || !purpose) {
    throw new Error("All fields are required");
  }

  // Combine date and time
  const startDateTime = new Date(`${dateStr}T${startTimeStr}`);
  const endDateTime = new Date(`${dateStr}T${endTimeStr}`);

  if (startDateTime >= endDateTime) {
    throw new Error(`End time (${endTimeStr}) must be after start time (${startTimeStr})`);
  }

  // Overlap check
  const overlap = await prisma.booking.findFirst({
    where: {
      roomId,
      status: "APPROVED",
      OR: [
        {
          startTime: { lt: endDateTime },
          endTime: { gt: startDateTime },
        },
      ],
    },
  });

  if (overlap) {
    throw new Error("Room is already booked for this time slot");
  }

  // Check against ClassSchedule
  const dayOfWeek = startDateTime.getDay();
  const timeStringStart = `${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`;
  const timeStringEnd = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;

  const classOverlap = await (prisma as any).classSchedule.findFirst({
    where: {
      roomId,
      dayOfWeek,
      startTime: { lt: timeStringEnd },
      endTime: { gt: timeStringStart },
    }
  });

  if (classOverlap) {
    throw new Error(`Ruangan terpakai untuk Jadwal Perkuliahan: ${classOverlap.courseName} (${classOverlap.startTime} - ${classOverlap.endTime})`);
  }

  let documentUrl = null;

  if (documentFile && documentFile.size > 0) {
    const bytes = await documentFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to Base64 to bypass Vercel's read-only file system limitation
    const base64String = buffer.toString("base64");
    const mimeType = documentFile.type || "application/pdf";
    documentUrl = `data:${mimeType};base64,${base64String}`;
  }

  await prisma.booking.create({
    data: {
      userId: (session.user as any).id,
      roomId,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose,
      pic,
      documentUrl,
      status: "PENDING_1",
    },
  });

  revalidatePath("/history");
  return { success: true };
}

export async function updateBookingStatus(bookingId: string, status: "APPROVED" | "REJECTED" | "PROCESSED" | "COMPLETED", notes?: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !["ADMIN", "KAJUR", "BKKH", "SARPAS"].includes((session.user as any).role)) {
      return { success: false, error: \`Unauthorized (Debug): \${JSON.stringify(session)}\` };
    }

    const role = (session.user as any).role;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    let nextStatus: any = status;

    // Custom Multi-Tier Workflow Logic for "APPROVED" action
    if (status === "APPROVED") {
      if (role === "BKKH") {
        nextStatus = "PENDING_2"; // Approved by Level 1 -> Go to Level 2
      } else if (role === "SARPAS") {
        nextStatus = "PENDING_3"; // Approved by Level 2 -> Go to Level 3
      } else if (role === "KAJUR") {
        nextStatus = "APPROVED"; // Approved by Level 3 -> Fully APPROVED
      } else if (role === "ADMIN") {
        nextStatus = "APPROVED"; // Admin override
      }
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: nextStatus, notes },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/kajur");
    revalidatePath("/dashboard/bkkh");
    revalidatePath("/dashboard/sarpas");
    revalidatePath("/history");
    
    return { success: true };
  } catch (error: any) {
    console.error("Booking Status Update Error:", error);
    return { success: false, error: error.message || "Internal server error." };
  }
}

export async function getPendingCounts() {
  const session = await getServerSession(authOptions);
  if (!session) return { bkkh: 0, sarpas: 0, kajur: 0 };
  
  const counts = await prisma.booking.groupBy({
    by: ['status'],
    _count: true,
    where: {
      status: { in: ['PENDING_1', 'PENDING_2', 'PENDING_3'] }
    }
  });

  return {
    bkkh: counts.find(c => c.status === 'PENDING_1')?._count || 0,
    sarpas: counts.find(c => c.status === 'PENDING_2')?._count || 0,
    kajur: counts.find(c => c.status === 'PENDING_3')?._count || 0,
  };
}

export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return [];

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  
  let alerts: any[] = [];
  
  try {
    if (role === "BKKH" || role === "ADMIN") {
      const count = await prisma.booking.count({ where: { status: "PENDING_1" } });
      if (count > 0) alerts.push({ id: 'bkkh', title: "Menunggu Persetujuan", desc: `Ada ${count} pengajuan yang menunggu persetujuan BKKH.`, time: "Just now", type: "warning", link: "/dashboard/bkkh" });
    }
    
    if (role === "SARPAS" || role === "ADMIN") {
      const count = await prisma.booking.count({ where: { status: "PENDING_2" } });
      if (count > 0) alerts.push({ id: 'sarpas', title: "Menunggu Persetujuan", desc: `Ada ${count} pengajuan yang menunggu persetujuan Sarpas.`, time: "Just now", type: "warning", link: "/dashboard/sarpas" });
    }

    if (role === "KAJUR" || role === "ADMIN") {
      const count = await prisma.booking.count({ where: { status: "PENDING_3" } });
      if (count > 0) alerts.push({ id: 'kajur', title: "Menunggu Persetujuan", desc: `Ada ${count} pengajuan yang menunggu persetujuan Pengelola Ruangan.`, time: "Just now", type: "warning", link: "/dashboard/kajur" });
    }

    // For Mahasiswa & Dosen, get their recent booking updates
    if (role === "MAHASISWA" || role === "DOSEN") {
      const recentBookings = await prisma.booking.findMany({
        where: { userId: userId, status: { not: "PENDING_1" } },
        orderBy: { updatedAt: "desc" },
        take: 3,
        include: { room: true }
      });
      
      recentBookings.forEach((b: any) => {
        let title = "Status Pengajuan";
        let desc = `Pengajuan ruang ${b.room.name} sedang diproses (${b.status}).`;
        let type = "info";
        
        if (b.status === "APPROVED") {
          title = "Peminjaman Disetujui!";
          desc = `Hore! Peminjaman ruang ${b.room.name} Anda telah disetujui sepenuhnya.`;
          type = "success";
        } else if (b.status === "REJECTED") {
          title = "Peminjaman Ditolak";
          desc = `Maaf, peminjaman ruang ${b.room.name} Anda ditolak.`;
          type = "error";
        }
        
        alerts.push({ id: b.id, title, desc, time: b.updatedAt.toLocaleDateString(), type, link: "/history" });
      });
    }

    return alerts;
  } catch (error) {
    console.error("Error fetching notifications", error);
    return [];
  }
}
