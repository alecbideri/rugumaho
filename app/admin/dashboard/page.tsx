"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPosts, deletePost, Post, getBlogSettings, updateBlogSettings, BlogSettings, BlogComment, getPendingComments, approveComment, deleteComment, getSubscribers } from "../../../lib/mockData";
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
  const [settings, setSettings] = useState<BlogSettings>({ heroLayout: 'carousel' });
  const [pendingComments, setPendingComments] = useState<BlogComment[]>([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });
  const router = useRouter();

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setMounted(true);
    }).catch((err) => {
      console.error("Failed to load dashboard posts from Sanity:", err);
      setMounted(true);
    });

    getSubscribers().then((data) => {
      setSubscribersCount(data.length);
    }).catch((err) => {
      console.error("Failed to load subscribers from Sanity:", err);
    });
    
    getBlogSettings().then((data) => {
      setSettings(data);
    }).catch((err) => {
      console.error("Failed to load global layout settings:", err);
    });

    getPendingComments().then((commentsData) => {
      setPendingComments(commentsData);
    }).catch(err => {
      console.error("Failed to load pending comments:", err);
    });
    
    // Format date string dynamically on client
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));
  }, []);

  const handleSettingsChange = (newSettings: Partial<BlogSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    updateBlogSettings(updated).catch(err => {
      console.error("Failed to save global settings:", err);
    });
  };

  const handleDelete = (id: string, title: string) => {
    setModal({
      isOpen: true,
      title: "Delete Story?",
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone and will delete it from Sanity.`,
      confirmText: "Delete",
      onConfirm: () => {
        deletePost(id).then(() => {
          getPosts().then(data => setPosts(data));
        }).catch(err => {
          console.error("Error deleting post from Sanity:", err);
        });
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleApproveComment = async (id: string) => {
    try {
      await approveComment(id);
      setPendingComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to approve comment");
    }
  };

  const handleDeleteComment = async (id: string) => {
    setModal({
      isOpen: true,
      title: "Reject Comment?",
      message: "Are you sure you want to reject and delete this comment? It will be removed from your database.",
      confirmText: "Reject",
      onConfirm: async () => {
        try {
          await deleteComment(id);
          setPendingComments(prev => prev.filter(c => c.id !== id));
        } catch (err) {
          console.error(err);
          alert("Failed to delete comment");
        }
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
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

          {/* Total Views */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Views</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">
                {mounted ? posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString() : "-"}
              </h3>
              <span className="text-emerald-500 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded">
                Live Count
              </span>
            </div>
          </div>

          {/* Newsletter Subscribers */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Newsletter Subscribers</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">
                {mounted ? subscribersCount : "-"}
              </h3>
              <span className="text-emerald-500 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded">
                Active List
              </span>
            </div>
          </div>

          {/* Comments Pending */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Comments Pending</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">
                {mounted ? pendingComments.length : "-"}
              </h3>
              {pendingComments.length > 0 ? (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                  Action Needed
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                  All Clear
                </span>
              )}
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
                    {mounted && posts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">
                          No posts created yet. Click &ldquo;New Post&rdquo; to write your first story!
                        </td>
                      </tr>
                    ) : (
                      mounted && posts.slice(0, 3).map((post) => (
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
                          
                          {/* Real Views */}
                          <td className="px-6 py-4 text-slate-600">
                            {post.status === "published" ? (post.views || 0).toLocaleString() : "0"}
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
                      ))
                    )}
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
                href="/"
                target="_blank"
                className="flex items-center justify-between p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-400 hover:shadow-md transition-all group cursor-pointer w-full"
              >
                <div>
                  <h4 className="font-serif text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors">View Site</h4>
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
            
            {/* Hero Layout Settings Card */}
            {mounted && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-serif text-xl font-bold text-slate-800">Hero Layout Settings</h4>
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="p-6 space-y-6">
                  {/* Select Layout Type */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Display Format</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSettingsChange({ heroLayout: 'single' })}
                        className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                          settings.heroLayout === 'single'
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                        }`}
                      >
                        Single Post
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSettingsChange({ heroLayout: 'carousel' })}
                        className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                          settings.heroLayout === 'carousel'
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                        }`}
                      >
                        Carousel Slider
                      </button>
                    </div>
                  </div>

                  {/* Pick Single Story Dropdown Selector */}
                  {settings.heroLayout === 'single' && (
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Hero Post</label>
                      <select
                        value={settings.selectedHeroPostId || ""}
                        onChange={(e) => handleSettingsChange({ selectedHeroPostId: e.target.value })}
                        className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-primary py-2 px-3"
                      >
                        <option value="" disabled>-- Choose a story --</option>
                        {posts.filter(p => p.status === 'published').map((post) => (
                          <option key={post.id} value={post.id}>
                            {post.title} ({post.category || "Lifestyle"})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400 italic">
                        Select a published post to display as the single landing page hero.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comments Moderation Queue Card */}
            {mounted && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-serif text-xl font-bold text-slate-800">Pending Comments</h4>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    {pendingComments.length}
                  </span>
                </div>
                <div className="p-6">
                  {pendingComments.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      All caught up! No pending comments.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                      {pendingComments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-slate-905">{comment.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{comment.email}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                              Pending
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-3 leading-relaxed italic">
                            &ldquo;{comment.content}&rdquo;
                          </p>
                          <div className="text-[10px] text-slate-400 font-semibold truncate">
                            Story slug: <span className="underline">{comment.postSlug}</span>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleApproveComment(comment.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Newsletter Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                <h4 className="font-serif text-xl font-bold text-slate-800">Newsletter Overview</h4>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500">Subscribers</span>
                  <span className="text-slate-900 font-bold">{mounted ? subscribersCount : "-"}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[0%]" />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-medium">Open Rate</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">--</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-medium">Last Sent</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">--</p>
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

      {/* Custom Premium Modal Dialog */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-6 animate-scale-in text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {modal.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {modal.message}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-50 pt-4">
              <button
                type="button"
                onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={modal.onConfirm}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  modal.confirmText === 'Delete' || modal.confirmText === 'Reject'
                    ? "bg-red-500 hover:bg-red-650 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {modal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
