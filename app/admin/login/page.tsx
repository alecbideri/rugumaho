"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import NotFound from "@/app/not-found";
import Logo from "@/components/Logo";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check the secret token query parameter
  const key = searchParams.get("key");
  const isAuthorizedToView = key === "ariane-secret-token";

  useEffect(() => {
    // If authorized and cookie already exists, redirect directly
    if (isAuthorizedToView) {
      const isLoggedIn = document.cookie.includes("rugumaho_admin_auth=true");
      if (isLoggedIn) {
        router.push("/admin/dashboard");
      }
    }
  }, [router, isAuthorizedToView]);

  if (!isAuthorizedToView) {
    // Return the custom 404 page content if the secret key parameter is missing/incorrect
    return <NotFound />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate network delay
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      if (
        (normalizedEmail === "arianebloger@gmail.com" ||
          normalizedEmail === "arianebloger") &&
        password === "Ariane200@."
      ) {
        // Set mock cookie
        document.cookie = "rugumaho_admin_auth=true; path=/; max-age=86400"; // 24 hours
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center px-4 relative bg-[#f6f8f8]"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(43, 205, 238, 0.22) 1.6px, transparent 1.6px)",
        backgroundSize: "32px 32px"
      }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(43,205,238,0.12)] border border-slate-100/80 relative z-10">
        
        {/* Brand Logo with optional writing animation */}
        <div className="flex justify-center mb-6">
          <Logo className="h-10 w-auto" animate={loading} />
        </div>

        {/* Header Title */}
        <div className="text-center mb-8">
          <h2 className="text-[28px] font-serif font-semibold text-slate-900 tracking-tight leading-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-2">
            Please enter your admin credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-xs text-red-500 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email input field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="text"
              required
              placeholder="admin@rugumaho.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 pr-12 py-3 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password links */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-500 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/admin/login#"
              onClick={(e) => e.preventDefault()}
              className="text-primary hover:opacity-85 font-bold transition-opacity"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:opacity-90 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Google sign-in button removed for security handover */}

      </div>

      {/* Back link */}
      <div className="mt-6 text-center z-10">
        <Link
          href="/"
          className="text-slate-400 hover:text-slate-600 text-xs font-bold tracking-wide transition-colors inline-flex items-center gap-1.5"
        >
          Back to rugumaho.com &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8f8]">
        <div className="text-slate-400 text-sm font-semibold">Loading portal...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

