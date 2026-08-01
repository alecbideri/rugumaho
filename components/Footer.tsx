"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-auto relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo */}
        <div className="flex items-center">
          <Logo className="h-6 w-auto" />
        </div>
        
        {/* Center links */}
        <div className="flex gap-8 text-sm text-slate-500 items-center">
          <button 
            onClick={() => setShowModal(true)} 
            className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 text-sm text-slate-500 font-sans outline-none"
          >
            Privacy Policy
          </button>
          <Link className="hover:text-primary transition-colors" href="/about">About</Link>
          <Link className="hover:text-primary transition-colors" href="/contact">Contact</Link>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
          &copy; {new Date().getFullYear()} Rugumaho. All rights reserved.
        </div>
      </div>

      {/* Privacy Policy Modal Popup Overlay */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-8 relative space-y-6 max-h-[85vh] overflow-y-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h3>
              <p className="text-xs text-slate-400 mt-1">Last updated: August 2026</p>
            </div>
            <div className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed space-y-4 font-light text-left">
              <p>
                At <strong>Rugumaho</strong>, accessible from <a href="https://rugumaho.com" className="text-primary hover:underline font-semibold">rugumaho.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Rugumaho and how we use it.
              </p>
              <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base mt-4">1. Information We Collect</h4>
              <p>
                If you subscribe to our newsletter list, we collect your name and email address to deliver our weekly muse campaigns. If you leave a comment on our posts, we collect the name, email address, and comment content you input.
              </p>
              <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base mt-4">2. How We Use Your Information</h4>
              <p>
                We use the information we collect to maintain our blog, send newsletter updates (via Resend), moderate reader discussions, and prevent spam. We never share or sell your personal details to third parties.
              </p>
              <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base mt-4">3. Cookies</h4>
              <p>
                Rugumaho uses standard cookies to manage administrator sessions and verify subscription states to optimize your reader experience.
              </p>
              <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base mt-4">4. Your Data Rights</h4>
              <p>
                You have the right to request the deletion of your comment history or opt out of our email subscription list at any time using the "Unsubscribe" links provided in our campaigns or by contacting us at <a href="mailto:help@rugumaho.com" className="text-primary hover:underline font-semibold">help@rugumaho.com</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
