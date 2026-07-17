import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewStoryForm from "./NewStoryForm";

export default async function NewStoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/new-story");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 p-8">
        <div className="mb-6 pb-6 border-b border-slate-100 dark:border-zinc-800/80">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Draft a New Story
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1.5 text-sm">
            Publish your latest literature and reach thousands of readers.
          </p>
        </div>
        <NewStoryForm />
      </div>
    </div>
  );
}
