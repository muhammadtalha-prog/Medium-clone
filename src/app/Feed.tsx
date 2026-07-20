"use client";

import { useState } from "react";
import Link from "next/link";

interface Author {
  username: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  category: string;
  keywords: string;
  created_at: string | Date;
  author: Author;
}

interface FeedProps {
  initialPosts: Post[];
  searchQuery: string;
}

const CATEGORIES = ["All", "Technology", "Design", "Writing", "Self Improvement"];

export default function Feed({ initialPosts, searchQuery }: FeedProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamic keyword categorization fallback
  const getPostCategory = (post: Post) => {
    if (post.category) return post.category;

    const text = (post.title + " " + post.content).toLowerCase();

    if (
      text.includes("code") ||
      text.includes("programmer") ||
      text.includes("software") ||
      text.includes("developer") ||
      text.includes("tech") ||
      text.includes("api") ||
      text.includes("react") ||
      text.includes("nextjs") ||
      text.includes("prisma") ||
      text.includes("database")
    ) {
      return "Technology";
    }

    if (
      text.includes("design") ||
      text.includes("ui") ||
      text.includes("ux") ||
      text.includes("layout") ||
      text.includes("aesthetic") ||
      text.includes("styling")
    ) {
      return "Design";
    }

    if (
      text.includes("productivity") ||
      text.includes("habit") ||
      text.includes("mindset") ||
      text.includes("focus") ||
      text.includes("learn") ||
      text.includes("life")
    ) {
      return "Self Improvement";
    }

    return "Writing";
  };

  // Filter posts based on category selection
  const filteredPosts = initialPosts.filter((post) => {
    if (activeCategory === "All") return true;
    return getPostCategory(post) === activeCategory;
  });

  const getReadingTime = (text: string) => {
    const words = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const time = Math.ceil(words / 200); // Average 200 WPM
    return time < 1 ? 1 : time;
  };

  const getSnippet = (htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]*>/g, ""); // Strip HTML tags
    return text.slice(0, 140) + (text.length > 140 ? "..." : "");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 w-full flex-1">
      {/* Main Feed Content */}
      <div className="flex-1 space-y-6">
        {/* Welcoming Hero Banner */}
        {!searchQuery && (
          <div className="mb-6 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-950 dark:from-zinc-900 dark:via-zinc-950 dark:to-black text-white relative overflow-hidden shadow-xl border border-slate-800 dark:border-zinc-800/80">
            <div className="relative z-10 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-white/15 text-white mb-4 backdrop-blur-sm tracking-wider uppercase border border-white/10">
                Literature Community
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                Where stories shape ideas and connect readers.
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                Welcome to a professional space built for authors, thinkers, and avid readers. Publish your insights, share literature, and explore publications tailored specifically to your reading interests.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href="/new-story"
                  className="px-4 py-2 rounded-lg text-xs font-black bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Start Writing
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("stories-start");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95"
                >
                  Explore Feed
                </button>
              </div>
            </div>
            {/* Decorative backgrounds */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-48 h-48 rounded-full bg-white/[0.02] blur-2xl pointer-events-none" />
          </div>
        )}

        <div id="stories-start" />

        {/* Feed Header & Filters */}
        <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap transition-all focus:outline-none ${
                    activeCategory === category
                      ? "bg-red-600 text-white dark:bg-orange-600 dark:text-white shadow-sm"
                      : "text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {searchQuery && (
            <p className="text-sm text-slate-700 dark:text-zinc-300 mt-4">
              Showing search results for &quot;
              <span className="font-bold text-slate-900 dark:text-white">
                {searchQuery}
              </span>
              &quot;
            </p>
          )}
        </div>

        {/* Stories list rendering */}
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-zinc-800/80">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="py-6 flex flex-col-reverse sm:flex-row gap-6 items-start justify-between"
              >
                <div className="flex-1 space-y-2.5">
                  {/* Author / Date Meta */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white dark:bg-orange-600 dark:text-white flex items-center justify-center text-[9px] font-black">
                      {post.author.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-200">
                      {post.author.username}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-600">•</span>
                    <span className="text-xs font-semibold text-slate-650 dark:text-zinc-400">
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <Link href={`/post/${post.id}`} className="block group">
                    <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-orange-500 group-hover:text-red-650 dark:group-hover:text-orange-400 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-800 dark:text-zinc-200 mt-1 leading-relaxed font-medium">
                      {getSnippet(post.content)}
                    </p>
                  </Link>

                  {/* Meta category label & reading time */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100/50 dark:border-blue-900/20">
                      {getPostCategory(post)}
                    </span>
                    <span className="text-xs font-semibold text-slate-650 dark:text-zinc-400">
                      {getReadingTime(post.content)} min read
                    </span>
                  </div>

                  {/* Keywords / Tags List */}
                  {post.keywords && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.keywords.split(",").filter(Boolean).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-850 text-[10px] font-semibold text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover Image rendering */}
                {post.cover_image && (
                  <Link
                    href={`/post/${post.id}`}
                    className="shrink-0 w-full sm:w-[130px] aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                    />
                  </Link>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50/50 dark:bg-zinc-950/20 border border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl">
            <svg
              className="w-12 h-12 text-slate-400 dark:text-zinc-650 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">No stories found</h3>
            <p className="text-sm text-slate-650 dark:text-zinc-450 mt-1 max-w-xs mx-auto">
              There are no publications matching this query.
            </p>
            <Link
              href="/new-story"
              className="inline-block mt-4 rounded-lg bg-red-600 hover:bg-red-750 dark:bg-orange-600 dark:hover:bg-orange-500 text-xs font-bold text-white px-4 py-2 transition-all shadow active:scale-95"
            >
              Write a Story
            </Link>
          </div>
        )}
      </div>

      {/* Sidebar dynamic interest panel */}
      <div className="hidden lg:block w-[260px] shrink-0 border-l border-slate-200 dark:border-zinc-800/80 pl-8 space-y-8">
        <div>
          <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-3">
            Reading Interests
          </h3>
          <p className="text-xs text-slate-755 dark:text-zinc-350 leading-relaxed mb-4 font-semibold">
            Select a theme to personalize your homepage feed to match your specific reading interests.
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all focus:outline-none ${
                  activeCategory === category
                    ? "bg-red-600 border-red-600 text-white dark:bg-orange-600 dark:border-orange-650 dark:text-white"
                    : "border-slate-300 text-slate-800 dark:border-zinc-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800/80">
          <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-3">
            About Us
          </h3>
          <p className="text-xs text-slate-755 dark:text-zinc-300 leading-relaxed font-semibold">
            The <strong>Literature Community</strong> is a dedicated publication hub for readers and writers. We aim to protect independent thoughts, foster creative writing, and build a space where literature shapes culture and connects people across fields.
          </p>
        </div>
      </div>
    </div>
  );
}
