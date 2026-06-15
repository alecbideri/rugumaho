"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPosts, addPost, updatePost, Post } from "../../../../lib/mockData";
import { ArrowLeft, Save, Sparkles, AlertCircle } from "lucide-react";

function PostEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Rugumaho");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [readTime, setReadTime] = useState("5 min read");
  const [category, setCategory] = useState<'Motherhood' | 'Travel' | 'Fitness' | 'Lifestyle'>("Lifestyle");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editId) {
      const posts = getPosts();
      const existing = posts.find((p) => p.id === editId);
      if (existing) {
        setTitle(existing.title);
        setSlug(existing.slug);
        setExcerpt(existing.excerpt);
        setContent(existing.content);
        setAuthor(existing.author);
        setStatus(existing.status);
        setReadTime(existing.readTime);
        setCategory(existing.category || "Lifestyle");
        setIsEditing(true);
      }
    }
  }, [editId]);

  // Auto-generate slug from title
  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars
      .replace(/[\s_]+/g, "-") // replace spaces and underscores with dashes
      .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
    setSlug(generated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !slug || !content || !excerpt) {
      setError("Please fill out all required fields.");
      return;
    }

    const posts = getPosts();
    // Validate slug uniqueness (exclude current post if editing)
    const slugConflict = posts.some(
      (p) => p.slug === slug && (!isEditing || p.id !== editId)
    );
    if (slugConflict) {
      setError("Slug must be unique. Another post is already using this slug.");
      return;
    }

    if (isEditing && editId) {
      const original = posts.find((p) => p.id === editId);
      if (original) {
        updatePost({
          ...original,
          title,
          slug,
          excerpt,
          content,
          author,
          status,
          readTime,
          category,
        });
      }
    } else {
      addPost({
        title,
        slug,
        excerpt,
        content,
        author,
        status,
        readTime,
        category,
      });
    }

    router.push("/admin/posts");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">
            {isEditing ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-sm text-slate-400">
            {isEditing ? "Modify your post details and save changes." : "Write and customize your new article."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-sm text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Title *</label>
              <input
                type="text"
                required
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-sm font-bold"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Slug *</label>
                <button
                  type="button"
                  onClick={generateSlug}
                  disabled={!title}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:hover:text-indigo-400 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-generate
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">/posts/</span>
                <input
                  type="text"
                  required
                  placeholder="getting-started-with-nextjs"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full pl-16 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Excerpt (Short Summary) *</label>
              <textarea
                required
                rows={3}
                placeholder="A brief summary of what this article is about to display in previews..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-sm resize-none"
              />
            </div>

            {/* Content Body */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Content (Markdown supported) *</label>
              <textarea
                required
                rows={12}
                placeholder="Write your article body content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings Section */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-900 pb-3">Publishing Settings</h3>
            
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Motherhood' | 'Travel' | 'Fitness' | 'Lifestyle')}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              >
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Fitness">Fitness</option>
                <option value="Motherhood">Motherhood</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Author</label>
              <input
                type="text"
                required
                placeholder="Rugumaho"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Estimated Read Time</label>
              <input
                type="text"
                required
                placeholder="5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isEditing ? "Save Changes" : "Publish Article"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateEditPostPage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading editor...</div>}>
      <PostEditor />
    </Suspense>
  );
}
