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

  // Dynamic keyword categorization
  const getPostCategory = (post: Post) => {
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
        {/* Feed Header & Filters */}
        <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all focus:outline-none ${
                    activeCategory === category
                      ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {searchQuery && (
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-4">
              Showing search results for &quot;
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                {searchQuery}
              </span>
              &quot;
            </p>
          )}
        </div>

        {/* Stories list rendering */}
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="py-6 flex flex-col-reverse sm:flex-row gap-6 items-start justify-between"
              >
                <div className="flex-1 space-y-2.5">
                  {/* Author / Date Meta */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[9px] font-bold">
                      {post.author.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      {post.author.username}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-600">•</span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500">
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <Link href={`/post/${post.id}`} className="block group">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {getSnippet(post.content)}
                    </p>
                  </Link>

                  {/* Meta category label & reading time */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                      {getPostCategory(post)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500">
                      {getReadingTime(post.content)} min read
                    </span>
                  </div>
                </div>

                {/* Cover Image rendering */}
                {post.cover_image && (
                  <Link
                    href={`/post/${post.id}`}
                    className="shrink-0 w-full sm:w-[130px] aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900"
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
          <div className="text-center py-16 bg-slate-50/50 dark:bg-zinc-950/20 border border-dashed border-slate-200 dark:border-zinc-850 rounded-2xl">
            <svg
              className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4"
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
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
              There are no publications matching this query.
            </p>
            <Link
              href="/new-story"
              className="inline-block mt-4 rounded-lg bg-slate-900 dark:bg-white text-xs font-bold text-white dark:text-zinc-950 px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow"
            >
              Write a Story
            </Link>
          </div>
        )}
      </div>

      {/* Sidebar dynamic interest panel */}
      <div className="hidden lg:block w-[260px] shrink-0 border-l border-slate-100 dark:border-zinc-800/80 pl-8 space-y-8">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Reading Interests
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
            Select a theme to personalize your homepage feed to match your specific reading interests.
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:outline-none ${
                  activeCategory === category
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                    : "border-slate-200 text-slate-600 dark:border-zinc-800 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/80">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Stack Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Built using a secure 100% free stack with Next.js App Router, Prisma, Neon PostgreSQL, NextAuth.js, and Cloudinary.
          </p>
        </div>
      </div>
    </div>
  );
}
