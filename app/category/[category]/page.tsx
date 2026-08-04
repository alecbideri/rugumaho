"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getPosts, Post } from "../../../lib/mockData";
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Mail,
  ChevronDown,
  Search
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ImageWithPlaceholder from "../../../components/ImageWithPlaceholder";

// Custom brand icons since Lucide deprecated them
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

// Category configurations for tags, taglines, and cover banners
interface CategoryConfig {
  tagline: string;
  coverImage: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  all: {
    tagline: "Exploring the world's quiet corners, active fitness, motherhood, and premium lifestyles.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
  },
  motherhood: {
    tagline: "Nurturing the next generation with grace, patience, and love.",
    coverImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80"
  },
  travel: {
    tagline: "Exploring the world's quiet corners with heart and purpose.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE6cKnPXAXm3hlYgs7rJjklsuMTk0ej6Bhgnma02i0k_GRA8aKtZ4qhRepGMWw3PpUh67KJ_ndXkBed1pyE4xZFqXvNpT1Pz4w-9Q3jfSgBoIzBWJ09fvkWySmwwwIYbuzEmBYNG2gsWJX4rfA0E4EoA2eDYfzNt4SPTkbdQboBlNchaAKegJATn7Fi0kq1ofK73URZyUQOVRy0fQgaYyZ01-7HDKk_MgUCmVXORA8-XzzRU4mCZin6cx8XDdTwt-VuMLV6CiINdk"
  },
  fitness: {
    tagline: "Strength, endurance, and physical health for a vibrant lifestyle.",
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80"
  },
  lifestyle: {
    tagline: "Curated inspiration for sustainable daily practices and ethical choices.",
    coverImage: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80"
  }
};

const DEFAULT_CONFIG: CategoryConfig = {
  tagline: "Curated stories, thoughts, and reflections.",
  coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawCategory = resolvedParams.category;
  const categoryName = rawCategory.toLowerCase() === "all" ? "Explore" : rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();

  const [posts, setPosts] = useState<Post[]>([]);
  const [allCategoryPosts, setAllCategoryPosts] = useState<Post[]>([]);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [localSearchInput, setLocalSearchInput] = useState("");
  const [globalCategories, setGlobalCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const postsPerPage = 6;

  // Load category posts on mount
  useEffect(() => {
    getPosts().then((fetched) => {
      const all = fetched.filter(p => p.status === "published");
      
      // Filter by category
      let categoryFiltered = rawCategory.toLowerCase() === "all"
        ? all
        : all.filter(p => p.category?.toLowerCase() === rawCategory.toLowerCase());
        
      // Filter by search query if present in URL
      let searchVal = "";
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const search = params.get("search");
        if (search) {
          searchVal = search;
          const query = search.toLowerCase();
          categoryFiltered = categoryFiltered.filter(
            p => p.title.toLowerCase().includes(query) || 
                 p.excerpt.toLowerCase().includes(query) ||
                 p.content.toLowerCase().includes(query)
          );
        }
      }
      
      setActiveSearch(searchVal);
      setLocalSearchInput(searchVal);
      setAllCategoryPosts(categoryFiltered);
      setPosts(categoryFiltered);
      
      // Extract unique categories for header dropdown
      const cats = Array.from(new Set(all.map(p => p.category).filter(Boolean))) as string[];
      setGlobalCategories(cats);
    }).catch(err => {
      console.error("Error loading category posts from Sanity:", err);
    });
  }, [rawCategory]);

  const handleClearSearch = () => {
    setActiveSearch("");
    setLocalSearchInput("");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("search");
      window.history.pushState({}, "", url.toString());
    }
    // Reload posts without search query
    getPosts().then((fetched) => {
      const all = fetched.filter(p => p.status === "published");
      let categoryFiltered = rawCategory.toLowerCase() === "all"
        ? all
        : all.filter(p => p.category?.toLowerCase() === rawCategory.toLowerCase());
      setAllCategoryPosts(categoryFiltered);
      setPosts(categoryFiltered);
    });
  };

  const handleLocalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchInput.trim()) {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("search", localSearchInput.trim());
        window.history.pushState({}, "", url.toString());
      }
      
      // Reload posts with new search query
      getPosts().then((fetched) => {
        const all = fetched.filter(p => p.status === "published");
        let categoryFiltered = rawCategory.toLowerCase() === "all"
          ? all
          : all.filter(p => p.category?.toLowerCase() === rawCategory.toLowerCase());
        
        const query = localSearchInput.trim().toLowerCase();
        categoryFiltered = categoryFiltered.filter(
          p => p.title.toLowerCase().includes(query) || 
               p.excerpt.toLowerCase().includes(query) ||
               p.content.toLowerCase().includes(query)
        );
        
        setActiveSearch(localSearchInput.trim());
        setAllCategoryPosts(categoryFiltered);
        setPosts(categoryFiltered);
      });
    }
  };

  // Handle filtering and sorting
  useEffect(() => {
    let filtered = [...allCategoryPosts];

    // Filter by subcategory tag (e.g. Guides, Personal, Tips)
    if (activeTag !== "All") {
      filtered = filtered.filter(p => p.tags?.includes(activeTag));
    }

    // Sort posts
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setPosts(filtered);
    setCurrentPage(1); // reset to page 1 on filter/sort change
  }, [activeTag, sortBy, allCategoryPosts]);

  const config = CATEGORY_CONFIGS[rawCategory.toLowerCase()] || DEFAULT_CONFIG;

  // Pagination calculation
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Popular posts list (just takes first 5 posts in the category as popular for layout styling)
  const popularPosts = allCategoryPosts.slice(0, 5);

  return (
    <div className="dot-grid min-h-screen bg-white font-display text-slate-900 transition-colors duration-200">
      
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-2xl group">
          <ImageWithPlaceholder
            src={config.coverImage}
            alt={categoryName}
            containerClassName="absolute inset-0"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-990 via-slate-950/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-16 text-left">
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <h2 className="font-serif text-5xl md:text-7xl text-white font-bold leading-none tracking-tight">
              {categoryName}
            </h2>
            <p className="text-white/90 text-lg md:text-xl font-light tracking-wide max-w-lg mt-3">
              {config.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href="/category/all"
            className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              rawCategory.toLowerCase() === "all"
                ? "bg-primary text-white dark:text-slate-900 border-primary shadow-sm"
                : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary bg-white"
            }`}
          >
            All
          </Link>
          {[
            { name: "Motherhood", path: "motherhood" },
            { name: "Travel", path: "travel" },
            { name: "Fitness", path: "fitness" },
            { name: "Lifestyle", path: "lifestyle" }
          ].map((cat) => {
            const isActive = rawCategory.toLowerCase() === cat.path;
            return (
              <Link
                key={cat.path}
                href={`/category/${cat.path}`}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? "bg-primary text-white dark:text-slate-900 border-primary shadow-sm"
                    : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary bg-white"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}

          {/* Sorting controls */}
          <div className="ml-auto flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
              className="bg-transparent border-none text-slate-700 font-bold focus:outline-none cursor-pointer focus:ring-0 text-xs py-0"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Header Banner */}
      {activeSearch && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 text-left">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Showing results for &ldquo;{activeSearch}&rdquo;
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Found {posts.length} matching {posts.length === 1 ? 'story' : 'stories'} in {categoryName}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <form onSubmit={handleLocalSearchSubmit} className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Refine search..."
                  value={localSearchInput}
                  onChange={(e) => setLocalSearchInput(e.target.value)}
                  className="w-full md:w-[220px] bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none font-semibold text-slate-700"
                />
              </form>
              <button
                onClick={handleClearSearch}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-primary hover:text-white dark:hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap"
              >
                Clear Search
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Posts Grid Container */}
          <div className="flex-1">
            {currentPosts.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-4">
                <div className="mx-auto size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">No stories found</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    We couldn't find any stories matching &ldquo;{activeSearch || activeTag}&rdquo; in this category. Try refining your keywords or clearing filters.
                  </p>
                </div>
                {(activeSearch || activeTag !== "All") && (
                  <button
                    onClick={() => {
                      setActiveTag("All");
                      handleClearSearch();
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-primary text-white hover:text-slate-900 transition-all cursor-pointer shadow-sm"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <article 
                    key={post.id} 
                    className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <ImageWithPlaceholder
                          src={post.coverImage || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634"} 
                          alt={post.title}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                        {post.tags && post.tags[0] && (
                          <span className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full text-slate-800 border border-slate-100 shadow-sm">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>
                      
                      {/* Card Body */}
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors">
                          <Link href={`/posts/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-light leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.createdAt}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-primary text-white dark:text-slate-900"
                          : "hover:bg-slate-50 text-slate-500 font-medium"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:w-80 space-y-12">
            <div className="sticky top-24 space-y-12">
              
              {/* Popular in Category */}
              {popularPosts.length > 0 && (
                <div>
                  <h4 className="font-serif text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Popular in {categoryName}
                  </h4>
                  <ul className="space-y-6">
                    {popularPosts.map((post, idx) => (
                      <li key={post.id} className="flex gap-4 group cursor-pointer">
                        <span className="font-serif text-3xl font-bold text-slate-200 group-hover:text-primary transition-colors">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="pt-1">
                          <h5 className="font-serif text-sm font-bold leading-snug text-slate-800 group-hover:text-primary transition-colors">
                            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                          </h5>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 mb-12">
                <h4 className="font-serif text-xl mb-2 italic text-slate-800">Inner Circle</h4>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Weekly {rawCategory} insights and personal essays delivered to your inbox.
                </p>
                {subscribed ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-semibold text-center">
                    Subscribed!
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input 
                      required
                      type="email"
                      placeholder="Email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary px-4 py-2.5 outline-none text-slate-900 placeholder-slate-400" 
                    />
                    <button 
                      type="submit"
                      className="w-full bg-primary text-white dark:text-slate-950 text-sm font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>

              {/* Social Connections Widget (SVGs styled exactly like the figma template) */}
              <div>
                <h4 className="font-serif text-xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-3">
                  Catch up with me on socials
                </h4>
                <div className="flex gap-4 items-center px-2">
                  {/* Instagram Link */}
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="size-11 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 hover:text-white dark:hover:text-slate-900 hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 dark:hover:border-white transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>

                  {/* YouTube Link */}
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="size-11 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 hover:text-white dark:hover:text-slate-900 hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 dark:hover:border-white transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      <Footer />

    </div>
  );
}
