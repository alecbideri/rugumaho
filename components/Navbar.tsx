"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower, Search, Menu, X } from "lucide-react";
import { getPosts, Post } from "../lib/mockData";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Fetch published posts for search indexing
  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data.filter(p => p.status === "published"));
    }).catch(err => {
      console.error("Navbar search load failed:", err);
    });
  }, []);

  // Update search results on input change
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const filtered = posts.filter(post => {
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchCategory = post.category ? post.category.toLowerCase().includes(query) : false;
      const matchTags = post.tags ? post.tags.some(tag => tag.toLowerCase().includes(query)) : false;
      return matchTitle || matchCategory || matchTags;
    });

    setSearchResults(filtered);
  }, [searchQuery, posts]);

  // Click away listener to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = desktopSearchRef.current?.contains(target);
      const insideMobile = mobileSearchRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      // Redirect directly to the top result on enter
      window.location.href = `/posts/${searchResults[0].slug}`;
      setShowDropdown(false);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative w-full">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Flower className="text-primary w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">Rugumaho</h1>
            </Link>
          </div>
          
          {/* Center: Centered Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${
                pathname === "/" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/category/all" 
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/category/") 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Explore
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors ${
                pathname === "/about" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors ${
                pathname === "/contact" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Right: Desktop Actions and Mobile Hamburger Menu button */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Desktop Search Container */}
            <div ref={desktopSearchRef} className="relative hidden sm:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search stories..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="pl-10 pr-4 py-1.5 bg-slate-50 border-none rounded-full text-xs focus:ring-2 focus:ring-primary/50 w-48 lg:w-64 text-slate-900 outline-none"
                />
              </form>

              {/* Desktop Dropdown Box */}
              {showDropdown && searchQuery.trim() && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2 divide-y divide-slate-50">
                      {searchResults.map((post) => (
                        <Link
                          key={post.id}
                          href={`/posts/${post.slug}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg transition-colors group text-left"
                        >
                          {post.coverImage && (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-12 h-12 object-cover rounded-lg bg-slate-100 shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-primary mb-0.5">
                              {post.category}
                            </span>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                              {post.title}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-450 font-medium">
                      No matching stories found.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile Hamburger toggle button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg md:hidden text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md shadow-lg py-4 px-4 space-y-3">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === "/" 
                ? "bg-primary/10 text-primary" 
                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/category/all" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname.startsWith("/category/") 
                ? "bg-primary/10 text-primary" 
                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            Explore
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === "/about" 
                ? "bg-primary/10 text-primary" 
                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === "/contact" 
                ? "bg-primary/10 text-primary" 
                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            Contact
          </Link>
          
          {/* Mobile Search Container (shown when hidden on desktop) */}
          <div ref={mobileSearchRef} className="pt-2 sm:hidden border-t border-slate-50">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search stories..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-xs focus:ring-2 focus:ring-primary/50 text-slate-900 outline-none"
              />
            </form>
            
            {/* Mobile Dropdown Box */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute left-4 right-4 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-50">
                    {searchResults.map((post) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery("");
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg transition-colors group text-left"
                      >
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-primary mb-0.5">
                            {post.category}
                          </span>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                            {post.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-450 font-medium">
                    No matching stories found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
