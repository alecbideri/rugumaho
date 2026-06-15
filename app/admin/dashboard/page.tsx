"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, Post } from "../../../lib/mockData";
import { FileText, FileCheck, FileEdit, Plus, ArrowRight, Eye } from "lucide-react";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPosts(getPosts());
    setMounted(false);
    setMounted(true);
  }, []);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;

  const stats = [
    { name: "Total Posts", value: totalPosts, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Published", value: publishedPosts, icon: FileCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Drafts", value: draftPosts, icon: FileEdit, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-400">Welcome to the Rugumaho Blog management hub.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs tracking-wider uppercase shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-400">{stat.name}</span>
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">{mounted ? stat.value : "-"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts Grid / Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Recent Activities</h2>
          <Link
            href="/admin/posts"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {mounted && posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No posts created yet. Get started by writing your first article!
          </div>
        ) : (
          <div className="space-y-4">
            {mounted && posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-900 hover:border-slate-800/80 rounded-xl transition-all duration-200"
              >
                <div className="min-w-0 pr-4">
                  <h3 className="font-bold text-white text-sm truncate">{post.title}</h3>
                  <div className="flex gap-3 text-[11px] text-slate-500 mt-1">
                    <span>{post.createdAt}</span>
                    <span>•</span>
                    <span className={`capitalize ${post.status === "published" ? "text-emerald-400" : "text-amber-400"}`}>
                      {post.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {post.status === "published" && (
                    <Link
                      href={`/posts/${post.slug}`}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="View Article"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/new?id=${post.id}`}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Edit Article"
                  >
                    <FileEdit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
