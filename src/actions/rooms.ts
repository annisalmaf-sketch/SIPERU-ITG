"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createRoom(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const type = formData.get("type") as string;

  await prisma.room.create({
    data: { name, location, capacity, type, status: "AVAILABLE" },
  });

  revalidatePath("/rooms");
}

export async function updateRoom(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const type = formData.get("type") as string;

  await prisma.room.update({
    where: { id },
    data: { name, location, capacity, type },
  });

  revalidatePath("/rooms");
}

export async function deleteRoom(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  // Hapus semua riwayat peminjaman yang terkait dengan ruangan ini terlebih dahulu
  await prisma.booking.deleteMany({ where: { roomId: id } });
  
  // Baru kemudian hapus ruangannya
  await prisma.room.delete({ where: { id } });
  
  revalidatePath("/rooms");
}

export async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" }
    });
    return { success: true, rooms };
  } catch (error: any) {
    console.error("Get rooms error:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleRoomStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.room.update({
    where: { id },
    data: { status: status as any },
  });

  revalidatePath("/rooms");
}
