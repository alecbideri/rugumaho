"use client";

import Logo from "@/components/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f6f8f8] dark:bg-slate-950 transition-colors duration-200">
      <div className="space-y-4 text-center">
        {/* Animated vector logo */}
        <Logo className="h-16 w-auto" animate={true} />
        {/* Mini loading status indicator */}
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
          Opening Journal...
        </p>
      </div>
    </div>
  );
}
