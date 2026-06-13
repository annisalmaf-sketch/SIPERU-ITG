"use client";

import React, { useState } from "react";
import { User, Plus, Edit2, Trash2, Search, X, Loader2, Shield } from "lucide-react";
import { createUser, updateUserDetails, deleteUser } from "@/actions/user";
import { clsx } from "clsx";

export function UserManagementTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MAHASISWA",
    status: "AKTIF"
  });

  const roles = ["MAHASISWA", "DOSEN", "BKKH", "SARPAS", "KAJUR", "ADMIN"];
  const statuses = ["AKTIF", "CUTI"];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Leave blank for edit unless they want to change it
        role: user.role,
        status: user.status || "AKTIF"
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "MAHASISWA", status: "AKTIF" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        // Edit mode
        const res = await updateUserDetails(editingUser.id, formData);
        if (res.success) {
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
          setIsModalOpen(false);
        } else {
          alert(res.error || "Gagal memperbarui pengguna");
        }
      } else {
        // Create mode
        if (!formData.password) {
          alert("Kata sandi wajib diisi untuk pengguna baru.");
          setLoading(false);
          return;
        }
        const res = await createUser(formData);
        if (res.success) {
          setUsers([res.user, ...users]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Gagal membuat pengguna");
        }
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"? Semua data peminjaman terkait juga akan terhapus.`)) {
      try {
        const res = await deleteUser(id);
        if (res.success) {
          setUsers(users.filter(u => u.id !== id));
        } else {
          alert(res.error || "Gagal menghapus pengguna");
        }
      } catch (error) {
        alert("Terjadi kesalahan saat menghapus pengguna.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Cari nama, email, atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white outline-none"
          />
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/30"
        >
          <Plus size={18} />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-black text-slate-400 uppercase tracking-widest">
                <th className="p-5 pl-8">Pengguna</th>
                <th className="p-5">Role / Jabatan</th>
                <th className="p-5">Terdaftar Pada</th>
                <th className="p-5 text-right pr-8">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500 font-bold">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs font-medium text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase",
                        user.role === 'ADMIN' ? "bg-red-50 text-red-600 dark:bg-red-900/20" :
                        ['BKKH','SARPAS','KAJUR'].includes(user.role) ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" :
                        user.role === 'DOSEN' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" :
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      )}>
                        {user.role === 'ADMIN' && <Shield size={10} />}
                        {user.role}
                      </span>
                      {user.status === 'CUTI' ? (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20">
                          CUTI
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20">
                          AKTIF
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          suppressHydrationWarning
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit Pengguna"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          suppressHydrationWarning
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 dark:text-white"
                  placeholder="Misal: Budi Santoso"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email (Akun Login)</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 dark:text-white"
                  placeholder="email@itg.ac.id"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi (Passphrase)</label>
                <input 
                  type="password" 
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 dark:text-white"
                  placeholder={editingUser ? "Kosongkan jika tidak ingin diubah" : "Minimal 6 karakter"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan / Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Akademik</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
