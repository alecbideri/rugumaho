"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Mail, LogOut, BookOpen, X, Menu, Flower } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cleanPath = pathname?.replace(/\/$/, "") || "";

  useEffect(() => {
    // Check if auth cookie exists
    const checkAuth = () => {
      const isLoggedIn = document.cookie.includes("rugumaho_admin_auth=true");
      if (cleanPath === "/admin/login") {
        setAuthorized(true);
      } else if (!isLoggedIn) {
        router.push("/admin/login?key=ariane-secret-token");
      } else {
        setAuthorized(true);
      }
    };
    
    checkAuth();
  }, [router, cleanPath]);

  const handleSignOut = () => {
    // Expire cookie
    document.cookie = "rugumaho_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  if (
    cleanPath === "/admin/login" || 
    cleanPath.startsWith("/admin/posts/new") || 
    cleanPath.startsWith("/admin/newsletter/new")
  ) {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
        <div className="text-slate-400 text-sm font-semibold">Verifying authorization...</div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-display text-slate-900">
      
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        aria-label="Toggle navigation menu"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="p-8 flex items-center gap-3">
            <Flower className="text-primary w-8 h-8 shrink-0" />
            <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-800">Rugumaho</h1>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r-lg"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info and logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <img 
              className="w-10 h-10 rounded-full object-cover border border-slate-200" 
              alt="User avatar of Ariane" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAot0CfIGSP0ePMPx8RhsKrHib5Ilicb7ExC-mnkh9SeEky65sqhFLJw2BsSftAarX5sCXmNlRwApy3IIqmqvFiik_riZHC94s-Q7A7yhE2n0DwEEfIxcz5WdERXtI1Cxr9aNvx8sr3dq4NOo7rKiJ8TjndYuHFTtEx3jmSBRuajEpaBewgoVPwGKDomlJegbsdvg9sGbGDZrsIej_0M-tCZUjp302UFWtJXwt-2TVPGJhXxfROU9qQiBvoCCNaiLHDNUxx8qO0-l0"
            />
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">Ariane</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
