"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { name },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function getUsers() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createUser(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  
  const { name, email, password, role } = data;
  
  // Hash password
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "MAHASISWA"
      }
    });
    revalidatePath("/dashboard/admin/users");
    return { success: true, user };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Email sudah terdaftar." };
    }
    return { success: false, error: "Gagal membuat pengguna." };
  }
}

export async function updateUserDetails(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  
  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role
  };
  
  if (data.password) {
    const bcrypt = await import("bcryptjs");
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    revalidatePath("/dashboard/admin/users");
    return { success: true, user };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Email sudah terdaftar." };
    }
    return { success: false, error: "Gagal memperbarui pengguna." };
  }
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  
  if (id === (session.user as any).id) {
    return { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." };
  }
  
  try {
    // Delete bookings associated with user to prevent constraint violations
    await prisma.booking.deleteMany({
      where: { userId: id }
    });
    
    await prisma.user.delete({
      where: { id }
    });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus pengguna. Mungkin karena relasi data lain yang masih terikat." };
  }
}
