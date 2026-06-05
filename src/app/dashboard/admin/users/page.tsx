import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions/user";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const users = await getUsers();

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic flex items-center gap-3">
              <Users className="text-primary" size={32} />
              User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Kelola akun pengguna, peran, dan akses sistem SIPERU ITG.</p>
          </div>
        </div>

        {/* User Table Component */}
        <UserManagementTable initialUsers={users} />
      </div>
    </MainLayout>
  );
}
