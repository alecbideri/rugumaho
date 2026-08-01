import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo */}
        <div className="flex items-center">
          <Logo className="h-6 w-auto" />
        </div>
        
        {/* Center links */}
        <div className="flex gap-8 text-sm text-slate-500">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" href="/about">About</Link>
          <Link className="hover:text-primary transition-colors" href="/contact">Contact</Link>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
          &copy; {new Date().getFullYear()} Rugumaho. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
