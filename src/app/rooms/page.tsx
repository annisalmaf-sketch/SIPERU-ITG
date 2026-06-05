import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { prisma } from "@/lib/prisma";
import { RoomTable } from "@/components/dashboard/RoomTable";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <MainLayout>
      <RoomTable initialRooms={rooms} />
    </MainLayout>
  );
}
