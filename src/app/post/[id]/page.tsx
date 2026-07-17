import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  // Query database for this specific post
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  const getReadingTime = (text: string) => {
    const words = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const time = Math.ceil(words / 200); // 200 words per minute average
    return time < 1 ? 1 : time;
  };

  const readingTime = getReadingTime(post.content);

  return (
    <article className="min-h-screen bg-white text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white mb-8 group transition-all focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to home
        </Link>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author / Publication Meta details */}
        <div className="flex items-center gap-3 border-y border-slate-100 dark:border-zinc-800 py-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-sm font-bold shadow-sm">
            {post.author.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {post.author.username}
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 mt-0.5">
              <span>
                Published on{" "}
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800/80 mb-8 bg-slate-50 dark:bg-zinc-900 aspect-[16/10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body HTML Content */}
        <div
          className="rich-text text-slate-800 dark:text-zinc-200 leading-relaxed text-base sm:text-lg space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
