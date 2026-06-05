"use client";

import React, { useState, useTransition } from "react";
import { 
  Plus, 
  Search, 
  DoorOpen, 
  Computer, 
  Armchair, 
  Users, 
  Edit, 
  Trash2,
  MapPin,
  Circle,
  Layers,
} from "lucide-react";
import { clsx } from "clsx";
import { RoomModal } from "../forms/RoomModal";
import { deleteRoom, toggleRoomStatus } from "@/actions/rooms";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  location: string | null;
  capacity: number;
  type: string;
  status: string;
}

interface RoomTableProps {
  initialRooms: Room[];
}

export function RoomTable({ initialRooms }: RoomTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredRooms = initialRooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room asset?")) return;
    
    startTransition(async () => {
      try {
        await deleteRoom(id);
        toast.success("Room deleted successfully");
      } catch (err: any) {
        toast.error("Delete failed", { description: err.message });
      }
    });
  };

  const handleStatusToggle = async (room: Room) => {
    const nextStatus = room.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    
    startTransition(async () => {
      try {
        await toggleRoomStatus(room.id, nextStatus);
        toast.success(`Status updated to ${nextStatus}`);
      } catch (err: any) {
        toast.error("Status update failed");
      }
    });
  };

  const getIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'laboratory': return Computer;
      case 'meeting room': return Armchair;
      case 'auditorium': return DoorOpen;
      case 'multipurpose': return Layers;
      default: return DoorOpen;
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Resource Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage and provision institutional physical spaces.</p>
        </div>
        <button onClick={handleAdd} className="btn-primary group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Provision New Asset
        </button>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none">
        {/* Toolbar */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col lg:flex-row gap-6 justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-full lg:w-[450px] group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, building, or type..." 
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Circle size={8} className="text-slate-400 fill-current" />
                   </div>
                ))}
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {filteredRooms.length} Active Resources
             </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Class</th>
                <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Limit</th>
                <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Availability</th>
                <th className="py-5 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredRooms.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-20 italic dark:text-white">
                         <DoorOpen size={64} />
                         <p className="font-black uppercase tracking-widest text-sm">No matching assets found</p>
                       </div>
                    </td>
                 </tr>
              ) : (
                filteredRooms.map((room) => {
                  const Icon = getIcon(room.type);
                  const isAvailable = room.status === "AVAILABLE";
                  
                  return (
                    <tr key={room.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-300">
                      <td className="py-7 px-10">
                        <div className="flex items-center gap-5">
                          <div className={clsx(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110 shadow-sm border border-slate-100 dark:border-slate-800",
                            isAvailable ? "bg-white dark:bg-slate-800 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                          )}>
                            <Icon size={28} />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors leading-tight italic tracking-tight">{room.name}</p>
                            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                              <MapPin size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{room.location || "UNASSIGNED"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-7 px-10">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          {room.type}
                        </span>
                      </td>
                      <td className="py-7 px-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                            <Users size={16} className="text-slate-400" />
                          </div>
                          <span className="text-sm font-black text-slate-700 dark:text-slate-300 italic">{room.capacity} PAX</span>
                        </div>
                      </td>
                      <td className="py-7 px-10">
                        <button 
                          onClick={() => handleStatusToggle(room)}
                          disabled={isPending}
                          className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm border",
                            isAvailable 
                              ? "bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-900/30 hover:bg-green-100" 
                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-900/30 hover:bg-amber-100"
                          )}
                        >
                          <Circle size={8} className={clsx("fill-current", isAvailable ? "animate-pulse" : "")} />
                          {room.status}
                        </button>
                      </td>
                      <td className="py-7 px-10 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEdit(room)}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(room.id)}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RoomModal 
        isOpen={isModalOpen}
        room={selectedRoom}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
