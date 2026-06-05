"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  ChevronRight,
  Mail,
  Fingerprint,
  Smartphone,
  Check,
  Loader2,
  Monitor,
  Moon,
  Sun,
  Layout,
  MessageSquare
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { updateUserProfile } from "@/actions/user";

type Tab = "profile" | "security" | "notifications" | "appearance";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");

  // Update name state when session loads
  React.useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // States for Security Toggles
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    smsAlerts: false,
    biometric: true
  });

  // States for Notification Toggles
  const [notifSettings, setNotifSettings] = useState({
    email: true,
    toasts: true,
    reminders: true
  });

  // State for Appearance
  const [theme, setThemeState] = useState("light");
  const [compact, setCompact] = useState(false);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    toast.info(`Theme changed to ${newTheme}`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        // Update the client-side session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: name
          }
        });

        toast.success("Settings Synchronized", {
          description: "Your global preferences have been updated in the database."
        });
      }
    } catch (err: any) {
      toast.error("Save Failed", {
        description: err.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSecurity = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.info(`${key.replace(/([A-Z])/g, ' $1').trim()} updated`);
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "profile" as Tab, name: "My Profile", icon: User },
    { id: "security" as Tab, name: "Security & Privacy", icon: Shield },
    { id: "notifications" as Tab, name: "Notifications", icon: Bell },
    { id: "appearance" as Tab, name: "Appearance", icon: Palette },
  ];

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className={clsx(
        "w-14 h-8 rounded-full relative cursor-pointer transition-all duration-500 border-2",
        active 
          ? "bg-primary border-primary shadow-lg shadow-primary/30" 
          : "bg-slate-100 border-slate-200"
      )}
    >
      <div className={clsx(
        "absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm",
        active ? "right-1" : "left-1"
      )}></div>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 animate-fade-in">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">System Configuration</h1>
          <p className="text-slate-500 font-medium text-sm">Personalize your academic portal experience and security protocols.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar Settings Categories */}
          <div className="lg:col-span-1 space-y-4">
             {tabs.map((item) => (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={clsx(
                   "w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 group",
                   activeTab === item.id 
                    ? "bg-primary text-white shadow-2xl shadow-primary/30 -translate-y-1" 
                    : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/20"
                 )}
               >
                 <div className="flex items-center gap-5">
                   <div className={clsx(
                     "p-3 rounded-2xl transition-all duration-500",
                     activeTab === item.id ? "bg-white/20 rotate-12" : "bg-slate-100 group-hover:rotate-12"
                   )}>
                     <item.icon size={20} />
                   </div>
                   <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
                 </div>
                 <ChevronRight size={16} className={clsx(
                   "transition-all duration-300",
                   activeTab === item.id ? "text-white opacity-100" : "text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                 )} />
               </button>
             ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2">
             <div className="glass-card rounded-[3rem] p-12 shadow-2xl border-none animate-slide-up min-h-[600px] flex flex-col">
                <div className="flex-1">
                {activeTab === "profile" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col md:flex-row items-center gap-10 border-b border-slate-50 pb-12">
                         <div className="relative group">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-inner border-2 border-dashed border-primary/20">
                               <User size={56} />
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                               <Palette size={16} />
                            </button>
                         </div>
                         <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{session?.user?.name || "Member Name"}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                               <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                 {((session?.user as any)?.role === "KAJUR" ? "BAAK" : (session?.user as any)?.role) || "Academic Staff"}
                               </span>
                               <span className="text-slate-300">•</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID: {session?.user?.email?.split('@')[0] || "ST-001"}</span>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                              </div>
                               <input
                                 name="name"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                                 placeholder="Enter your full name"
                                 className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] border border-slate-100 bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-700 text-sm transition-all"
                               />
                            </div>
                         </div>

                         <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Email</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                              </div>
                              <input
                                readOnly
                                defaultValue={session?.user?.email || ""}
                                className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 outline-none font-bold text-slate-700 text-sm"
                              />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === "security" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2">
                         <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Security Protocols</h3>
                         <p className="text-sm text-slate-400 font-medium">Configure multi-factor authentication and access logs.</p>
                      </div>

                      <div className="space-y-6">
                        {[
                          { id: "twoFactor" as const, title: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", icon: Shield },
                          { id: "smsAlerts" as const, title: "SMS Alerts", desc: "Receive alerts for suspicious login attempts", icon: Smartphone },
                          { id: "biometric" as const, title: "Biometric Integration", desc: "Use FaceID or Fingerprint for faster access", icon: Fingerprint },
                        ].map((item) => (
                          <div key={item.id} className="p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
                            <div className="p-4 rounded-2xl bg-white shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                               <item.icon size={24} />
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-black text-slate-900 italic">{item.title}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                            </div>
                            <Toggle 
                              active={securitySettings[item.id]} 
                              onClick={() => toggleSecurity(item.id)} 
                            />
                          </div>
                        ))}
                      </div>
                   </div>
                )}

                {activeTab === "notifications" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2">
                         <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Alert Preferences</h3>
                         <p className="text-sm text-slate-400 font-medium">Manage how you receive updates and reminders.</p>
                      </div>

                      <div className="space-y-6">
                        {[
                          { id: "email" as const, title: "Email Notifications", desc: "Receive booking confirmations via email", icon: Mail },
                          { id: "toasts" as const, title: "System Toasts", desc: "Show in-app popups for quick updates", icon: Bell },
                          { id: "reminders" as const, title: "Approval Reminders", desc: "Get notified when Kajur reviews your request", icon: MessageSquare },
                        ].map((item) => (
                          <div key={item.id} className="p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
                            <div className="p-4 rounded-2xl bg-white shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                               <item.icon size={24} />
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-black text-slate-900 italic">{item.title}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                            </div>
                            <Toggle 
                              active={notifSettings[item.id]} 
                              onClick={() => toggleNotif(item.id)} 
                            />
                          </div>
                        ))}
                      </div>
                   </div>
                )}

                {activeTab === "appearance" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2">
                         <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Interface Styling</h3>
                         <p className="text-sm text-slate-400 font-medium">Customize the look and feel of your portal.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                           { id: "light", name: "Light Mode", icon: Sun },
                           { id: "dark", name: "Dark Mode", icon: Moon },
                           { id: "system", name: "System", icon: Monitor },
                         ].map((mode) => (
                           <button 
                             key={mode.id}
                             onClick={() => setTheme(mode.id)}
                             className={clsx(
                               "p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-500",
                               theme === mode.id 
                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" 
                                : "border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 hover:border-primary/20"
                             )}
                           >
                              <div className={clsx(
                                "p-4 rounded-2xl transition-colors duration-500",
                                theme === mode.id ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-slate-400"
                              )}>
                                 <mode.icon size={28} />
                              </div>
                              <span className={clsx(
                                "text-xs font-black uppercase tracking-widest transition-colors duration-500",
                                theme === mode.id ? "text-primary" : "text-slate-400 dark:text-slate-500"
                              )}>{mode.name}</span>
                           </button>
                         ))}
                      </div>

                      <div className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 flex items-center justify-between group hover:bg-white transition-all duration-300">
                         <div className="flex items-center gap-5">
                            <div className="p-4 rounded-2xl bg-white shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                               <Layout size={24} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 italic">Compact Layout</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Show more information on screen</p>
                            </div>
                         </div>
                         <Toggle active={compact} onClick={() => setCompact(!compact)} />
                      </div>
                   </div>
                )}
                </div>

                <div className="pt-12 flex justify-end gap-4 border-t border-slate-50 mt-auto">
                   <button className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                      Discard Changes
                   </button>
                   <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="btn-primary min-w-[200px] py-4 text-[10px]"
                   >
                      {isSaving ? (
                         <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Check size={18} />
                          Commit System Sync
                        </>
                      )}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
