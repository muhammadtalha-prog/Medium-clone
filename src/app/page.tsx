import { prisma } from "@/lib/prisma";
import Feed from "./Feed";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search || "";

  // Fetch posts from Neon database with filter criteria if searching
  const posts = await prisma.post.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { keywords: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      author: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 w-full flex-1 flex flex-col">
      <Feed initialPosts={posts} searchQuery={search} />
    </div>
  );
}
