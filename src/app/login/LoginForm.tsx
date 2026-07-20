"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid username or password. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      {error && (
        <div className="p-3 text-xs font-semibold text-red-800 rounded-lg bg-red-50 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-850 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-black text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-850 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-black text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-sm font-semibold"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-750 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-500 transition-all shadow-md focus:outline-none disabled:opacity-50 tracking-wider uppercase active:scale-95"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      <div className="text-center text-xs text-slate-700 dark:text-zinc-300 pt-2 font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-slate-950 hover:text-red-600 dark:text-orange-500 dark:hover:text-orange-400 hover:underline focus:outline-none"
        >
          Create one
        </Link>
      </div>
    </form>
  );
}
