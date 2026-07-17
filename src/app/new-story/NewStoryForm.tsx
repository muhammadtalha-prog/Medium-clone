"use client";

import { useState } from "react";
import TiptapEditor from "./TiptapEditor";

export default function NewStoryForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setCoverImage(data.url);
    } catch (err: any) {
      setError(err.message || "Something went wrong uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for your story.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Please write some content for your story.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          cover_image: coverImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish story");
      }

      setSuccess("Your story has been published successfully!");
      setTitle("");
      setContent("");
      setCoverImage("");

      // Redirect home after brief delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save the story.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-950/20 dark:text-green-400 border border-green-100 dark:border-green-900/50">
          {success}
        </div>
      )}

      {/* Title Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
          Story Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your literature..."
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
          Cover Image (Optional)
        </label>
        
        {coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full max-h-[300px] object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-zinc-950/20 hover:bg-slate-100/50 dark:border-zinc-800 dark:hover:bg-zinc-900/20 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-slate-500 dark:text-zinc-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  PNG, JPG or WEBP (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}

        {uploading && (
          <div className="mt-2 text-xs text-slate-600 dark:text-zinc-400 flex items-center gap-2">
            <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent text-slate-600 rounded-full" />
            Uploading image...
          </div>
        )}
      </div>

      {/* Content Editor Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
          Story Content
        </label>
        <TiptapEditor value={content} onChange={setContent} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-all"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-slate-100 shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Publishing..." : "Publish Story"}
        </button>
      </div>
    </form>
  );
}
