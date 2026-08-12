"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeByEmailServer } from "../../lib/sanityActions";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Mail } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
      handleUnsubscribe(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (targetEmail: string) => {
    if (!targetEmail) return;
    setStatus("loading");
    try {
      const res = await unsubscribeByEmailServer(targetEmail);
      if (res.success) {
        setStatus("success");
        setMessage(`The email address ${targetEmail} has been successfully unsubscribed from the Rugumaho mailing list.`);
      } else {
        setStatus("error");
        setMessage(res.error || "Failed to unsubscribe. Please check the address and try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      handleUnsubscribe(email.trim());
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl text-center">
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-6">RUGUMAHO</h1>
      
      {status === "loading" && (
        <div className="py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Processing your unsubscribe request...</p>
        </div>
      )}

      {status === "success" && (
        <div className="py-6 space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unsubscribed successfully</h2>
          <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed">{message}</p>
          <div className="pt-4">
            <Link href="/" className="inline-flex h-11 items-center justify-center px-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-primary dark:hover:bg-primary transition-all cursor-pointer">
              Return to Homepage
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="py-6 space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed">{message}</p>
          <div className="pt-4 flex flex-col gap-2">
            <button 
              onClick={() => setStatus("idle")} 
              className="inline-flex h-11 items-center justify-center px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition-all cursor-pointer"
            >
              Try a different email
            </button>
            <Link href="/" className="text-sm font-semibold text-primary hover:underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      )}

      {status === "idle" && (
        <form onSubmit={onSubmit} className="space-y-6 text-left">
          <p className="text-slate-650 dark:text-slate-350 text-sm text-center leading-relaxed">
            Please enter your email address below to unsubscribe from our weekly journal updates.
          </p>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </span>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-primary text-white font-bold h-12 rounded-lg text-sm transition-all cursor-pointer"
          >
            Confirm Unsubscribe
          </button>
        </form>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="dot-grid min-h-screen bg-[#f6f8f8] flex flex-col justify-center items-center p-6">
      <Suspense fallback={
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Loading page...</p>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
