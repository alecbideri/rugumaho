"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower, Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setIsOpen(false);
      // Redirect to explore page with search query
      window.location.href = `/category/all?search=${encodeURIComponent(searchQuery)}`;
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
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search stories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-slate-50 border-none rounded-full text-xs focus:ring-2 focus:ring-primary/50 w-48 lg:w-64 text-slate-900 outline-none"
              />
            </form>
            
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
          
          {/* Mobile Search Form (shown when hidden on desktop) */}
          <form onSubmit={handleSearchSubmit} className="pt-2 sm:hidden border-t border-slate-50">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search stories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-xs focus:ring-2 focus:ring-primary/50 text-slate-900 outline-none"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
