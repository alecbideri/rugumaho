import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* 404 Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-20 max-w-7xl mx-auto w-full text-center">
        {/* Large "404" label */}
        <h1 className="text-[120px] sm:text-[180px] font-serif font-semibold text-primary leading-none tracking-tight">
          404
        </h1>
        
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
          Page Not Found
        </h2>
        
        {/* Subtitle description */}
        <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed">
          The story you're looking for seems to have wandered off.
        </p>
        
        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-primary hover:opacity-90 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/10 flex items-center justify-center"
          >
            Back to Home
          </Link>
          <Link
            href="/category/all"
            className="w-full sm:w-auto px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center shadow-sm"
          >
            Browse the Journal
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
