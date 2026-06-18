"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Flower } from "lucide-react";
import NotFound from "@/app/not-found";

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
        (normalizedEmail === "admin" ||
          normalizedEmail === "admin@rugumaho.com") &&
        password === "password"
      ) {
        // Set mock cookie
        document.cookie = "rugumaho_admin_auth=true; path=/; max-age=86400"; // 24 hours
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password. (Hint: Click Google button to autofill)");
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
        
        {/* Flower Brand Icon */}
        <div className="flex justify-center mb-6">
          <Flower className="w-10 h-10 text-primary" />
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

        {/* Divider */}
        <div className="flex items-center gap-4 py-6">
          <div className="h-[1px] flex-1 bg-slate-100"></div>
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
            OR CONTINUE WITH
          </span>
          <div className="h-[1px] flex-1 bg-slate-100"></div>
        </div>

        {/* Google OAuth Button (with Autofill support for easy testing) */}
        <button
          type="button"
          onClick={() => {
            setEmail("admin@rugumaho.com");
            setPassword("password");
          }}
          className="w-full py-3 bg-white border border-slate-200/80 hover:bg-slate-50 active:scale-[0.99] rounded-xl text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
          title="Click to autofill credentials"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

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

