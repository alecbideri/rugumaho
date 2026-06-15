"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, Post } from "../lib/mockData";
import { 
  Camera, 
  ArrowRight, 
  Mail, 
  Calendar, 
  X
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Email subscribe state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetched = getPosts().filter(p => p.status === "published");
    setAllPosts(fetched);
    setPosts(fetched);
    setMounted(true);
  }, []);

  // Filter posts based on category and search
  useEffect(() => {
    let filtered = allPosts;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (appliedSearch) {
      const query = appliedSearch.toLowerCase();
      filtered = filtered.filter(
        p => p.title.toLowerCase().includes(query) || 
             p.excerpt.toLowerCase().includes(query) ||
             p.content.toLowerCase().includes(query)
      );
    }

    setPosts(filtered);
  }, [selectedCategory, appliedSearch, allPosts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setAppliedSearch("");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Extract categories for filter
  const categories = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean))) as string[];

  // Define Featured Post (first post) and remaining posts for the grid
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 font-display transition-colors duration-200">
      {/* Subtle Grid Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[size:20px_20px] bg-dot-pattern"></div>
      
      <div className="relative z-10 flex h-full grow flex-col">
        <Navbar />

        {/* Main Content Area */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-[1200px] px-6 lg:px-8 flex flex-col gap-12 py-10">
            
            {/* Active filters summary */}
            {(selectedCategory || appliedSearch) && (
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm text-sm">
                <span className="font-semibold text-slate-500">Active Filters:</span>
                {selectedCategory && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                    Category: {selectedCategory}
                  </span>
                )}
                {appliedSearch && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                    Search: &ldquo;{appliedSearch}&rdquo;
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:underline cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </button>
              </div>
            )}

            {/* Hero Section */}
            {!selectedCategory && !appliedSearch && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Hero Image */}
                <Link 
                  href="/posts/the-hidden-gems-of-rwandas-countryside"
                  className="relative w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-xl shadow-lg group block cursor-pointer"
                >
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuANbxS57_IPytnQiJMyuZ3-JJ3KWHsdqwf3ZsUDwJIOgbglomTaZU27u7dkvqlIu8aqxPbnQctB_YoJ_OyWTtqScRYaxkQq8ktVCU4O7XjONODb4w2EYEBJ1zfdYc14ohKqAzhC2wwftEmYBL2Yb8UicXXORo0J1PONmAKiw84SQJj1lMZrF41P9tVU5GfCZqZfGVW9FRUBmq5i31vrCOcgAQNsdgm50481IL1sBsV4PdqmR2fFzh3BI-p2Ux-GfwybRsvm0pcF2cQ")` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Featured Living</span>
                  </div>
                </Link>

                {/* Hero Content */}
                <div className="flex flex-col gap-6 lg:pl-10 justify-center">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <span className="w-8 h-px bg-primary"></span>
                    Editor&apos;s Pick
                  </div>
                  <Link href="/posts/the-hidden-gems-of-rwandas-countryside" className="group">
                    <h1 className="text-slate-900 dark:text-white text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                      The Hidden Gems <br/>
                      of Rwanda&apos;s <span className="text-slate-400 dark:text-slate-500 italic">Countryside</span>
                    </h1>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-md">
                    Beyond the typical tourist trails lies a world of vibrant markets, ancient traditions, and a serenity that can only be found by slowing down.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link 
                      href="/posts/the-hidden-gems-of-rwandas-countryside"
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary hover:text-slate-900 dark:hover:bg-primary transition-all rounded-lg h-12 px-8 text-sm font-bold flex items-center gap-2 group cursor-pointer shadow-md"
                    >
                      Read Latest Journal
                      <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button 
                      onClick={() => {
                        const target = document.getElementById("stories-grid-anchor");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-primary hover:text-primary rounded-lg h-12 px-6 text-sm font-bold transition-all cursor-pointer"
                    >
                      View Archives
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative Divider */}
            {!selectedCategory && !appliedSearch && (
              <div className="w-full flex justify-center py-4 text-slate-300 dark:text-slate-700 text-xl font-bold tracking-widest">
                •••
              </div>
            )}

            {/* Featured Stories Section Label */}
            <div id="featured-stories-anchor" className="flex items-center gap-4 py-4">
              <h4 className="text-slate-900 dark:text-white text-xl font-serif font-bold">Featured Stories</h4>
              <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
              {selectedCategory || appliedSearch ? (
                <button onClick={clearFilters} className="text-xs font-bold text-primary uppercase tracking-wider hover:underline cursor-pointer">
                  Reset view
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>

            {mounted && posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400">No articles found matching your criteria.</p>
                <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 font-semibold text-xs text-white">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Main Featured Article (only shown when available) */}
                {mounted && featuredPost && (
                  <div className="flex flex-col md:flex-row gap-8 items-stretch rounded-xl bg-white dark:bg-slate-800 p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full md:w-1/2 aspect-video md:aspect-auto overflow-hidden rounded-lg relative group">
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 min-h-[260px] md:min-h-full" 
                        style={{ backgroundImage: `url("${featuredPost.coverImage || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634"}")` }}
                      ></div>
                    </div>
                    <div className="flex flex-col justify-center gap-4 w-full md:w-1/2">
                      <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredPost.createdAt} • {featuredPost.readTime}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight hover:text-primary transition-colors">
                        <Link href={`/posts/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {featuredPost.excerpt}
                      </p>
                      <div className="pt-2">
                        <Link 
                          href={`/posts/${featuredPost.slug}`}
                          className="text-slate-900 dark:text-white font-bold text-sm border-b-2 border-primary pb-0.5 hover:text-primary transition-colors inline-block"
                        >
                          Read Full Article
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid of Stories */}
                {mounted && gridPosts.length > 0 && (
                  <div id="stories-grid-anchor" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                    {gridPosts.map((post) => (
                      <Link 
                        key={post.id} 
                        href={`/posts/${post.slug}`}
                        className="flex flex-col gap-4 group cursor-pointer"
                      >
                        <div className="overflow-hidden rounded-xl aspect-[4/3] relative">
                          <div 
                            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                            style={{ backgroundImage: `url("${post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"}")` }}
                          ></div>
                          {post.category && (
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-800">
                              {post.category}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                            {post.createdAt} • {post.readTime}
                          </div>
                          <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Newsletter Section (Editorial Style, Positioned Close to the Footer) */}
            <section className="relative my-8 py-16 px-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-primary/20 shadow-[0_0_50px_rgba(43,205,238,0.12)] text-center overflow-hidden">
              {/* Glowing Background Blur Effects */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
                <div className="bg-primary/10 p-3 rounded-full text-primary mb-2 shadow-sm shadow-primary/5">
                  <Mail className="w-6 h-6 block" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                  Join the Inner Circle
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-lg">
                  Receive a weekly curation of our best stories, wellness tips, and exclusive lifestyle guides directly to your inbox. No spam, just inspiration.
                </p>

                {subscribed ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-sm font-semibold">
                    Thank you for subscribing! Check your inbox soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col sm:flex-row gap-3 mt-4">
                    <input 
                      required
                      type="email"
                      placeholder="Your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white placeholder:text-slate-400" 
                    />
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/25 cursor-pointer hover:-translate-y-0.5 duration-200 active:translate-y-0"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
                
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Join 15,000+ readers. Unsubscribe anytime.</p>
              </div>
            </section>

          </div>
        </div>

        <Footer />

      </div>
    </div>
  );
}
