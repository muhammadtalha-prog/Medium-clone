import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white text-slate-950 dark:bg-black dark:text-slate-50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-slate-50/50 dark:bg-zinc-900/40 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-955 dark:text-orange-500">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-zinc-300">
            Sign in to your Literature Community account.
          </p>
        </div>
        <Suspense fallback={<div className="animate-pulse h-48 bg-slate-100 dark:bg-zinc-800 rounded-xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
