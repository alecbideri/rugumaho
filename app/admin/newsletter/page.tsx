"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  ArrowUp, 
  Users, 
  Eye, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  X,
  CheckCircle,
  FileText,
  Trash2,
  Mail
} from "lucide-react";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscribedDate: string;
  status: "Active" | "Unsubscribed";
}

interface Campaign {
  id: string;
  title: string;
  sentDate: string;
  recipients: number;
  openRate: string;
  clickRate: string;
}

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: "1", name: "Alex Rivera", email: "alex.r@example.com", subscribedDate: "Oct 12, 2023", status: "Active" },
  { id: "2", name: "Sam Chen", email: "schen@domain.org", subscribedDate: "Sep 28, 2023", status: "Active" },
  { id: "3", name: "Jordan Smith", email: "jsmith@web.com", subscribedDate: "Aug 15, 2023", status: "Unsubscribed" },
  { id: "4", name: "Emily Watson", email: "emily.w@example.com", subscribedDate: "Jul 22, 2023", status: "Active" },
  { id: "5", name: "Michael Chang", email: "m.chang@agency.net", subscribedDate: "Jul 05, 2023", status: "Active" },
  { id: "6", name: "Sofia Martinez", email: "sofia.m@global.com", subscribedDate: "Jun 18, 2023", status: "Active" },
  { id: "7", name: "David K.", email: "david.k@techcorp.io", subscribedDate: "May 30, 2023", status: "Unsubscribed" },
  { id: "8", name: "Amara Okoro", email: "amara@creative.co", subscribedDate: "May 12, 2023", status: "Active" },
  { id: "9", name: "Liam Wilson", email: "liam.w@services.org", subscribedDate: "Apr 25, 2023", status: "Active" },
  { id: "10", name: "Elena Rostova", email: "elena.r@press.ru", subscribedDate: "Apr 01, 2023", status: "Active" },
  { id: "11", name: "Tyler Durden", email: "tyler@paperstreet.com", subscribedDate: "Mar 15, 2023", status: "Active" },
  { id: "12", name: "Selena Gomez", email: "selena@music.com", subscribedDate: "Feb 28, 2023", status: "Active" }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: "1", title: "The Future of Sustainable Design", sentDate: "Oct 24, 2023", recipients: 11200, openRate: "72.4%", clickRate: "12.1%" },
  { id: "2", title: "Summer Product Update: V2 is here", sentDate: "Sep 15, 2023", recipients: 10840, openRate: "64.2%", clickRate: "8.5%" }
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // Search & Pagination States
  const [globalSearch, setGlobalSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Active dropdown settings
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Load campaigns from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rugumaho_campaigns");
    if (!saved) {
      localStorage.setItem("rugumaho_campaigns", JSON.stringify(INITIAL_CAMPAIGNS));
      setCampaigns(INITIAL_CAMPAIGNS);
    } else {
      try {
        setCampaigns(JSON.parse(saved));
      } catch (e) {
        setCampaigns(INITIAL_CAMPAIGNS);
      }
    }
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [subSearch, globalSearch]);

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Filter subscribers based on local input or global search
  const filteredSubscribers = subscribers.filter(s => {
    const query = (subSearch || globalSearch).toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const displayedSubscribers = filteredSubscribers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const activeSubscribersCount = subscribers.filter(s => s.status === "Active").length;
  // Calculate display count matching the HTML metric
  const displayTotalSubscribers = 12438 + activeSubscribersCount;



  const toggleSubscriberStatus = (id: string) => {
    setSubscribers(subscribers.map(s => 
      s.id === id ? { ...s, status: s.status === "Active" ? "Unsubscribed" : "Active" } : s
    ));
    setActiveDropdown(null);
    triggerToast("Subscriber status toggled!");
  };

  const deleteSubscriber = (id: string) => {
    if (confirm("Are you sure you want to remove this subscriber?")) {
      setSubscribers(subscribers.filter(s => s.id !== id));
      setActiveDropdown(null);
      triggerToast("Subscriber removed!");
    }
  };

  const lastCampaign = campaigns[0] || {
    title: "No Campaigns Sent",
    sentDate: "N/A",
    recipients: 0
  };

  return (
    <div className="font-display bg-slate-50/50 dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Toast message alert */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-semibold">{showToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-serif text-3xl font-bold">Newsletter</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
              placeholder="Global search..." 
              type="text"
            />
          </div>
          <Link 
            href="/admin/newsletter/new"
            className="bg-primary hover:bg-primary/90 text-slate-900 font-bold px-6 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Compose New
          </Link>
        </div>
      </header>

      {/* Body Content */}
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Subscribers */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Subscribers</p>
                <h3 className="text-3xl font-bold mt-1">
                  {displayTotalSubscribers.toLocaleString()}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +12% this month
                </div>
              </div>
              <div className="w-24 h-12">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  <path d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20" fill="none" stroke="#2bcdee" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Average Open Rate */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Average Open Rate</p>
              <h3 className="text-3xl font-bold mt-1">68.4%</h3>
              <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                <ArrowUp className="w-4 h-4" />
                +2.1% improvement
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "68.4%" }}></div>
            </div>
          </div>

          {/* Last Sent Campaign */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Last Sent</p>
            <h3 className="text-xl font-bold mt-1 truncate dark:text-white" title={lastCampaign.title}>
              {lastCampaign.title}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {lastCampaign.sentDate === "N/A" ? "No recent campaigns" : `Sent on ${lastCampaign.sentDate}`}
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {lastCampaign.recipients ? (lastCampaign.recipients / 1000).toFixed(1) + "k" : "0"}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {lastCampaign.recipients ? (lastCampaign.recipients * 0.68 / 1000).toFixed(1) + "k" : "0"}
              </div>
            </div>
          </div>
        </div>

        {/* Subscriber List Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <h4 className="font-bold text-lg">Active Subscribers</h4>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="pl-10 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-48 focus:w-64 transition-all focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100" 
                  placeholder="Search subscribers..." 
                  type="text"
                />
              </div>
              <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Subscribed Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                {displayedSubscribers.length > 0 ? (
                  displayedSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{sub.name}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{sub.email}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{sub.subscribedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          sub.status === "Active" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === sub.id ? null : sub.id)}
                          className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Options */}
                        {activeDropdown === sub.id && (
                          <>
                            <div 
                              onClick={() => setActiveDropdown(null)}
                              className="fixed inset-0 z-20"
                            />
                            <div className="absolute right-6 top-10 w-44 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                              <button
                                onClick={() => toggleSubscriberStatus(sub.id)}
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                Toggle Subscription
                              </button>
                              <button
                                onClick={() => deleteSubscriber(sub.id)}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove Subscriber
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">
                      No subscribers found matching query
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
              <p>
                Showing {Math.min(filteredSubscribers.length, (page - 1) * itemsPerPage + 1)}-
                {Math.min(filteredSubscribers.length, page * itemsPerPage)} of {filteredSubscribers.length} subscribers
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pNum = index + 1;
                  return (
                    <button 
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded font-bold transition-all cursor-pointer ${
                        page === pNum 
                          ? "bg-primary text-slate-900" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Past Newsletters Feed Section */}
        <section className="space-y-4">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">Past Newsletters</h4>
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((camp) => (
              <div 
                key={camp.id} 
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white leading-snug">{camp.title}</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Sent {camp.sentDate} • {camp.recipients.toLocaleString()} Recipients
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Open Rate</p>
                    <p className="text-lg font-bold text-primary mt-0.5">{camp.openRate}</p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Click Rate</p>
                    <p className="text-lg font-bold text-primary mt-0.5">{camp.clickRate}</p>
                  </div>
                  <button 
                    onClick={() => alert(`Report for "${camp.title}":\n\nTotal Recipients: ${camp.recipients}\nOpen Rate: ${camp.openRate}\nClick Rate: ${camp.clickRate}`)}
                    className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
