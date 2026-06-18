"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPosts, deletePost, Post } from "../../../lib/mockData";
import { 
  Plus, 
  ArrowRight, 
  Eye, 
  Bell, 
  Trash2, 
  FileEdit, 
  ExternalLink, 
  Send, 
  Zap, 
  TrendingUp,
  Gauge,
  ArrowUp
} from "lucide-react";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    setPosts(getPosts());
    setMounted(true);
    
    // Format date string dynamically on client
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePost(id);
      setPosts(getPosts());
    }
  };

  // Helper for category badge classes matching user mockup
  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case "Lifestyle":
        return "bg-primary/10 text-primary";
      case "Travel":
        return "bg-amber-100 text-amber-700";
      case "Fitness":
        return "bg-emerald-100 text-emerald-700";
      case "Motherhood":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-slate-200 text-slate-600";
    }
  };

  const totalPostsCount = posts.length;

  return (
    <div className="font-display">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-slate-900 tracking-tight">Welcome back, Ariane</h2>
          <p className="text-slate-500 text-sm mt-1">{currentDate || "Loading dashboard..."}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative cursor-pointer" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <Link 
            href="/admin/posts/new"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Posts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Posts</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">{mounted ? totalPostsCount : "-"}</h3>
              <div className="h-8 w-24 bg-primary/10 rounded overflow-hidden flex items-end">
                <div className="w-full h-full bg-gradient-to-t from-primary/30 to-transparent flex items-end px-1 gap-0.5">
                  <div className="w-1/6 h-[40%] bg-primary/40 rounded-t-sm"></div>
                  <div className="w-1/6 h-[60%] bg-primary/40 rounded-t-sm"></div>
                  <div className="w-1/6 h-[30%] bg-primary/40 rounded-t-sm"></div>
                  <div className="w-1/6 h-[80%] bg-primary/40 rounded-t-sm"></div>
                  <div className="w-1/6 h-[50%] bg-primary/40 rounded-t-sm"></div>
                  <div className="w-1/6 h-[90%] bg-primary/40 rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* This Week's Views */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">This Week's Views</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">12,450</h3>
              <span className="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded">
                <ArrowUp className="w-4 h-4 mr-0.5" />
                15.2%
              </span>
            </div>
          </div>

          {/* Newsletter Subscribers */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Newsletter Subscribers</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">3,240</h3>
              <span className="text-primary text-sm font-bold flex items-center bg-primary/5 px-2 py-1 rounded">
                <TrendingUp className="w-4 h-4 mr-0.5" />
                5.7%
              </span>
            </div>
          </div>

          {/* Comments Pending */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Comments Pending</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">12</h3>
              <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">ACTION NEEDED</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Recent Posts & Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Table & Quick Actions Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Table Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-serif text-xl font-bold text-slate-800">Recent Posts</h4>
                <Link className="text-primary text-sm font-semibold hover:underline" href="#">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Views</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                    {mounted && posts.slice(0, 3).map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                        {/* Title and Date */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{post.title}</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{post.createdAt}</p>
                        </td>
                        
                        {/* Category badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getCategoryBadgeClass(post.category)}`}>
                            {post.category || "Lifestyle"}
                          </span>
                        </td>
                        
                        {/* Status badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            post.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        
                        {/* Mock Views */}
                        <td className="px-6 py-4 text-slate-600">
                          {post.status === "published" ? "1,240" : "0"}
                        </td>
                        
                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 text-slate-400">
                            {post.status === "published" && (
                              <Link 
                                href={`/posts/${post.slug}`}
                                target="_blank"
                                className="hover:text-primary transition-colors p-1"
                                title="View public post"
                              >
                                <Eye className="w-4.5 h-4.5" />
                              </Link>
                            )}
                            <Link 
                              href={`/admin/posts/new?id=${post.id}`}
                              className="hover:text-primary transition-colors p-1 cursor-pointer"
                              title="Edit post"
                            >
                              <FileEdit className="w-4.5 h-4.5" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(post.id, post.title)}
                              className="hover:text-red-500 transition-colors p-1 cursor-pointer"
                              title="Delete post"
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
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Write New Post */}
              <Link 
                href="/admin/posts/new"
                className="flex items-center justify-between p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all group text-left cursor-pointer w-full"
              >
                <div>
                  <h4 className="font-serif text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors">Write New Post</h4>
                  <p className="text-slate-500 text-sm mt-1">Start a fresh story today</p>
                </div>
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <Plus className="w-6 h-6" />
                </div>
              </Link>
              
              {/* View Site */}
              <Link 
                href="#"
                className="flex items-center justify-between p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-400 hover:shadow-md transition-all group cursor-pointer"
              >
                <div>
                  <h4 className="font-serif text-2xl font-bold text-slate-800">View Site</h4>
                  <p className="text-slate-500 text-sm mt-1">Check the public version</p>
                </div>
                <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column (Newsletter Overview & Insights) */}
          <div className="space-y-8">
            
            {/* Newsletter Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                <h4 className="font-serif text-xl font-bold text-slate-800">Newsletter Overview</h4>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500">Subscribers</span>
                  <span className="text-slate-900 font-bold">3,240</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[65%]" />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-medium">Open Rate</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">42.8%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-medium">Last Sent</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">3d ago</p>
                  </div>
                </div>
                <Link 
                  href="/admin/newsletter"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Compose Newsletter
                </Link>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h5 className="text-sm font-bold text-slate-800 mb-4">Quick Insights</h5>
              <div className="space-y-4">
                
                {/* SEO optimal */}
                <div className="flex gap-4">
                  <div className="size-8 bg-emerald-50 text-emerald-600 rounded flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">SEO is optimal</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">All recent posts have focus keywords</p>
                  </div>
                </div>
                
                {/* Site Performance */}
                <div className="flex gap-4">
                  <div className="size-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Site Performance</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Average page load: 1.2s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
