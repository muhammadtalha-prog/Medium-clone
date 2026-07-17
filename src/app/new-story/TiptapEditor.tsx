"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[300px] max-w-none text-slate-800 dark:text-zinc-100 prose dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-zinc-950/20">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/50 px-4 py-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 ${
            editor.isActive("bold")
              ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-bold"
              : "text-slate-600 dark:text-zinc-400"
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 ${
            editor.isActive("italic")
              ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 italic font-bold"
              : "text-slate-600 dark:text-zinc-400"
          }`}
          title="Italic"
        >
          I
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-bold"
              : "text-slate-600 dark:text-zinc-400 font-semibold"
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-bold"
              : "text-slate-600 dark:text-zinc-400 font-semibold"
          }`}
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 ${
            editor.isActive("bulletList")
              ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-bold"
              : "text-slate-600 dark:text-zinc-400"
          }`}
          title="Bullet List"
        >
          • List
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 bg-white dark:bg-zinc-900/60 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
