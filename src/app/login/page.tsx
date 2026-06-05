"use client";

import React, { useState } from "react";
import { 
  Fingerprint, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  LogIn
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau kata sandi tidak valid.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-950 via-blue-700 to-white min-h-screen flex items-center justify-center p-4 font-manrope">
      <main className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md p-2 mb-4 border border-slate-100 dark:border-slate-800">
            <img src="/logo-itg.png" alt="ITG Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">SIPERU ITG</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Silakan masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5" suppressHydrationWarning autoComplete="off">
          
          {/* Email Input */}
          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Fingerprint size={16} />
              </div>
              <input
                name="identifier"
                type="email"
                required
                autoComplete="off"
                placeholder="Masukan username anda disini"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Masukan password anda disini"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm text-slate-700 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 dark:border-red-800">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Masuk
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
