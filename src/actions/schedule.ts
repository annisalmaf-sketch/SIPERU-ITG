"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getClassSchedules() {
  try {
    const schedules = await (prisma as any).classSchedule.findMany({
      include: {
        room: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });
    return { success: true, schedules };
  } catch (error: any) {
    console.error("Get class schedules error:", error);
    return { success: false, error: error.message };
  }
}

export async function createClassSchedule(data: {
  roomId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  courseName: string;
  lecturerName: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "KAJUR" && role !== "ADMIN")) {
      return { success: false, error: "Unauthorized" };
    }

    const schedule = await (prisma as any).classSchedule.create({
      data: {
        roomId: data.roomId,
        dayOfWeek: Number(data.dayOfWeek),
        startTime: data.startTime,
        endTime: data.endTime,
        courseName: data.courseName,
        lecturerName: data.lecturerName,
      },
    });

    revalidatePath("/dashboard/kajur/schedule");
    revalidatePath("/calendar");
    return { success: true, schedule };
  } catch (error: any) {
    console.error("Create class schedule error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteClassSchedule(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "KAJUR" && role !== "ADMIN")) {
      return { success: false, error: "Unauthorized" };
    }

    await (prisma as any).classSchedule.delete({
      where: { id },
    });

    revalidatePath("/dashboard/kajur/schedule");
    revalidatePath("/calendar");
    return { success: true };
  } catch (error: any) {
    console.error("Delete class schedule error:", error);
    return { success: false, error: error.message };
  }
}
