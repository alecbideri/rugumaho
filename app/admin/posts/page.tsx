"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, deletePost, Post } from "../../../lib/mockData";
import { FileEdit, Trash2, Eye, Plus, Calendar, Clock, User } from "lucide-react";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPosts(getPosts());
    setMounted(true);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the post: "${title}"?`)) {
      deletePost(id);
      setPosts(getPosts());
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Posts</h1>
          <p className="text-sm text-slate-400">View, edit, publish, and delete your blog posts.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs tracking-wider uppercase shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </Link>
      </div>

      {/* Posts Table container */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {mounted && posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No posts created yet. Create a new article to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 hidden md:table-cell">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {mounted && posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Title */}
                    <td className="px-6 py-4 font-bold text-white max-w-xs sm:max-w-md">
                      <div className="truncate">{post.title}</div>
                      <div className="text-xs text-slate-500 font-medium truncate mt-0.5 max-w-[200px] md:max-w-[300px]">
                        /{post.slug}
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 text-slate-300 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{post.author}</span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold capitalize border ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/10"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-400 hidden sm:table-cell">
                      <div className="flex flex-col text-[11px] gap-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" /> {post.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {post.readTime}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {post.status === "published" && (
                          <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="View Public Post"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/new?id=${post.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit Post"
                        >
                          <FileEdit className="w-4.5 h-4.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
