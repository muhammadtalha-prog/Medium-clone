"use client";

import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Sync search input state if query parameter changes externally
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="hidden max-w-xs flex-1 sm:block md:max-w-sm mx-4"
    >
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.602z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-slate-300 dark:focus:border-zinc-700 focus:outline-none transition-all"
        />
      </div>
    </form>
  );
}

export default function Navbar() {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name ? name.slice(0, 2).toUpperCase() : "U";
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 dark:border-zinc-800/85 dark:bg-zinc-950/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Medium<span className="text-slate-400 dark:text-zinc-500">.</span>
          </span>
        </Link>

        {/* Search Input Bar (Hidden on Mobile, Wrapped in Suspense) */}
        <Suspense fallback={<div className="hidden max-w-xs flex-1 sm:block md:max-w-sm mx-4 h-9 bg-slate-50 dark:bg-zinc-900 rounded-full animate-pulse" />}>
          <NavbarSearch />
        </Suspense>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {session ? (
            <>
              {/* Write Page Link */}
              <Link
                href="/new-story"
                className="hidden items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white sm:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Write
              </Link>

              {/* Logged In Info & SignOut button */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-xs font-bold text-white dark:text-zinc-950 shadow-sm"
                  title={session.user?.name || ""}
                >
                  {getInitials(session.user?.name || "")}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg border border-slate-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn()}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white focus:outline-none"
              >
                Sign In
              </button>
              <button
                onClick={() => signIn()}
                className="rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow focus:outline-none"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
