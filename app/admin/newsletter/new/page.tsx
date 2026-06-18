"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  CheckCircle,
  Share2,
  Globe,
  Heart,
  Send,
  Calendar,
  X,
  FileText,
  Flower
} from "lucide-react";

export default function ComposeNewsletterPage() {
  const router = useRouter();

  // State bindings
  const [subject, setSubject] = useState("");
  const [heroImage, setHeroImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCCeeos0o_Q-UAyfR8pJcg75W35T3bUuOT3GfcX5DeEDh0oryz1ze-FP6r5UQcDrg6-0v0DyaxggRVbu7YkXZAow4cJnTAbiKLEdptcwtsSmNxyPrbMYPJrgvSAMJMdAOJysPeKof-CKQ8mPLK8Vbeiup7DJpWdiHCsjCsYozesDO2OS6EAp0oc1XJJ6paxzJUyqFGv3z7wsg0zTIspdIc0EClpoUz0FyKiZDKLvrUtyu6tZ4cXWKR86yOosLEjJ-b2et994oTRZ2U");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "templates" | "settings">("write");
  const [savedTime, setSavedTime] = useState("");
  const [showToast, setShowToast] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // Set initial saved time and load initial content
  useEffect(() => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setSavedTime(time);
    
    // Set initial text inside contenteditable div
    const initialText = `<p>This is where your content will appear. Your subscribers will see a beautifully formatted email that reflects the care you put into your writing.</p><p>The Serif headings provide a classic, editorial feel while the clean layout keeps the focus on your message.</p>`;
    setContent(initialText);
    if (editorRef.current) {
      editorRef.current.innerHTML = initialText;
    }
  }, []);

  // Update save timestamp dynamically as they type
  useEffect(() => {
    if (subject || content) {
      const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      setSavedTime(time);
    }
  }, [subject, content]);

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const formatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLinkButton = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      formatText("createLink", url);
    }
  };

  const handleImageButton = () => {
    const url = prompt("Enter image URL to insert in body:");
    if (url) {
      formatText("insertImage", url);
    }
  };

  const handleCodeButton = () => {
    formatText("insertHTML", `<code class="bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono text-sm">code</code>`);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditHeroImage = () => {
    const url = prompt("Enter hero image URL for the email header:", heroImage);
    if (url) {
      setHeroImage(url);
    }
  };

  const handleSaveDraft = () => {
    triggerToast("Draft saved successfully!");
  };

  const handleSendTestEmail = () => {
    triggerToast("Test email sent to admin inbox!");
  };

  const handleSchedule = () => {
    const date = prompt("Enter date to schedule (e.g. October 30, 2026):");
    if (date) {
      triggerToast(`Newsletter scheduled successfully for ${date}!`);
    }
  };

  const handleSendNow = () => {
    if (!subject.trim()) {
      alert("Please enter a subject line before sending.");
      return;
    }

    const currentMonthYear = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    
    // Create new campaign
    const newCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      title: subject,
      sentDate: currentMonthYear,
      recipients: 12450, // mock count
      openRate: "0.0%",
      clickRate: "0.0%"
    };

    // Load existing campaigns, append new one, and write to localStorage
    const INITIAL_CAMPAIGNS = [
      { id: "1", title: "The Future of Sustainable Design", sentDate: "Oct 24, 2023", recipients: 11200, openRate: "72.4%", clickRate: "12.1%" },
      { id: "2", title: "Summer Product Update: V2 is here", sentDate: "Sep 15, 2023", recipients: 10840, openRate: "64.2%", clickRate: "8.5%" }
    ];
    
    let currentCampaigns = INITIAL_CAMPAIGNS;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rugumaho_campaigns");
      if (saved) {
        try {
          currentCampaigns = JSON.parse(saved);
        } catch(e) {
          currentCampaigns = INITIAL_CAMPAIGNS;
        }
      }
    }

    const updatedCampaigns = [newCampaign, ...currentCampaigns];
    if (typeof window !== "undefined") {
      localStorage.setItem("rugumaho_campaigns", JSON.stringify(updatedCampaigns));
    }

    triggerToast("Newsletter sent successfully!");
    setTimeout(() => {
      router.push("/admin/newsletter");
    }, 1500);
  };

  const currentMonthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Toast Alert banner */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-semibold">{showToast}</span>
        </div>
      )}

      {/* Embedded local styles for the email editor content block */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dot-grid {
          background-image: radial-gradient(circle, rgba(43, 205, 238, 0.22) 1.6px, transparent 1.6px);
          background-size: 20px 20px;
        }
        .serif-heading {
          font-family: var(--font-playfair), Lora, serif;
        }
        .wysiwyg-newsletter-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-playfair), Lora, serif;
        }
        .wysiwyg-newsletter-content p {
          margin-bottom: 1rem;
        }
        .wysiwyg-newsletter-content img {
          border-radius: 0.5rem;
          margin: 1.25rem 0;
          width: 100%;
          object-fit: cover;
        }
        .wysiwyg-newsletter-content ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 1rem;
        }
        .wysiwyg-newsletter-content blockquote {
          border-left: 3px solid #2bcdee;
          padding-left: 0.75rem;
          font-style: italic;
          color: #64748b;
          margin: 1rem 0;
        }
      ` }} />

      {/* Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-3 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/admin/newsletter" className="text-primary hover:opacity-85 transition-opacity flex items-center">
            <Flower className="w-8 h-8" />
          </Link>
          <h2 className="text-xl font-bold tracking-tight">Rugumaho</h2>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link className="hover:text-primary transition-colors" href="/admin/dashboard">Dashboard</Link>
            <Link className="hover:text-primary transition-colors" href="/admin/newsletter">Audience</Link>
            <Link className="text-primary" href="#">Analytics</Link>
          </nav>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <button 
            onClick={handleSaveDraft}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Save Draft
          </button>
          <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAot0CfIGSP0ePMPx8RhsKrHib5Ilicb7ExC-mnkh9SeEky65sqhFLJw2BsSftAarX5sCXmNlRwApy3IIqmqvFiik_riZHC94s-Q7A7yhE2n0DwEEfIxcz5WdERXtI1Cxr9aNvx8sr3dq4NOo7rKiJ8TjndYuHFTtEx3jmSBRuajEpaBewgoVPwGKDomlJegbsdvg9sGbGDZrsIej_0M-tCZUjp302UFWtJXwt-2TVPGJhXxfROU9qQiBvoCCNaiLHDNUxx8qO0-l0"
            />
          </div>
        </div>
      </header>

      {/* Main Content Split Layout */}
      <main className="flex flex-1 overflow-hidden min-h-0">
        
        {/* Left Panel: Editor */}
        <section className="w-1/2 border-r border-slate-100 dark:border-slate-800 flex flex-col overflow-y-auto bg-white dark:bg-slate-950">
          <div className="p-8 max-w-2xl mx-auto w-full space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Compose Newsletter</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Draft your message for the Rugumaho community</p>
            </div>
            
            {/* Editor Tabs */}
            <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab("write")}
                className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === "write" ? "border-primary text-slate-900 dark:text-white" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                Write
              </button>
              <button 
                onClick={() => setActiveTab("templates")}
                className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === "templates" ? "border-primary text-slate-900 dark:text-white" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                Templates
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === "settings" ? "border-primary text-slate-900 dark:text-white" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                Settings
              </button>
            </div>

            {activeTab === "write" && (
              <>
                {/* Subject Line Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject Line</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400 py-3 px-4" 
                    placeholder="Enter a compelling subject..." 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Rich Text Editor */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[400px]">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <button 
                      onClick={() => formatText("bold")}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded transition-all cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={() => formatText("italic")}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded transition-all cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={() => formatText("insertUnorderedList")}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded transition-all cursor-pointer"
                      title="Bullet List"
                    >
                      <List className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={handleLinkButton}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded transition-all cursor-pointer"
                      title="Add Link"
                    >
                      <LinkIcon className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={handleImageButton}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded transition-all cursor-pointer"
                      title="Add Image"
                    >
                      <ImageIcon className="w-[18px] h-[18px]" />
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <button 
                      onClick={handleCodeButton}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded transition-all cursor-pointer"
                      title="Insert Code Tag"
                    >
                      <Code className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                  
                  {/* Content editable body */}
                  <div 
                    ref={editorRef}
                    className="flex-1 p-6 border-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed placeholder:text-slate-300 min-h-[350px] focus:outline-none overflow-y-auto" 
                    contentEditable="true"
                    onInput={handleEditorInput}
                  />
                </div>
              </>
            )}

            {activeTab === "templates" && (
              <div className="space-y-4 py-4">
                <p className="text-slate-500 text-sm font-semibold">Select a curated theme template:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => {
                      setSubject("The Weekly Muse: Exploring Design");
                      triggerToast("Applied Editorial template!");
                    }}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:border-primary/60 transition-all text-center space-y-2"
                  >
                    <FileText className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-wider">Editorial Theme</p>
                  </div>
                  <div 
                    onClick={() => {
                      setSubject("Rugumaho Studio Update - What's Next");
                      triggerToast("Applied Minimalist template!");
                    }}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:border-primary/60 transition-all text-center space-y-2"
                  >
                    <Mail className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-wider">Minimal Theme</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Campaign Cover Image URL</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-slate-900 dark:text-white bg-transparent py-2.5 px-3.5 text-sm" 
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Audience Group</p>
                  <select className="w-full bg-transparent border-slate-200 dark:border-slate-800 rounded-lg text-sm p-3 focus:ring-0 dark:text-white">
                    <option>All Active Subscribers (12,450 recipients)</option>
                    <option>Weekly Digest Segment (8,410 recipients)</option>
                    <option>VIP Supporters (540 recipients)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Preview */}
        <section className="w-1/2 bg-slate-50 dark:bg-slate-900/50 dot-grid flex items-start justify-center p-12 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-[600px] shadow-2xl rounded-lg overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800/50">
            <div className="bg-primary h-1.5 w-full"></div>
            
            {/* Email Header */}
            <div className="p-10 border-b border-slate-50 dark:border-slate-800/40 text-center">
              <div className="text-primary mb-6 flex justify-center">
                <Flower className="w-10 h-10 animate-spin-slow" />
              </div>
              <h1 className="serif-heading text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {subject || "The Weekly Muse"}
              </h1>
              <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mt-2">
                Issue #42 • {currentMonthYear}
              </p>
            </div>
            
            {/* Email Hero Image */}
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative group overflow-hidden border-b border-slate-100 dark:border-slate-800">
              {heroImage ? (
                <>
                  <img 
                    alt="Hero banner mockup" 
                    className="w-full h-full object-cover" 
                    src={heroImage} 
                  />
                  <button 
                    onClick={handleEditHeroImage}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                  >
                    Change Image
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEditHeroImage}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Add Hero Image</span>
                </button>
              )}
            </div>
            
            {/* Email Body Content */}
            <div className="p-10 space-y-6">
              <h2 className="serif-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
                Hello, Rugumaho community.
              </h2>
              <div 
                className="wysiwyg-newsletter-content text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-serif"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <div className="py-8">
                <button 
                  type="button"
                  onClick={() => alert("Action: Read the full story button clicked.")}
                  className="bg-primary text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer"
                >
                  Read the full story
                </button>
              </div>
            </div>
            
            {/* Email Footer */}
            <div className="p-10 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center space-y-4">
              <div className="flex justify-center gap-6 text-slate-400">
                <Share2 className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <Globe className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <Heart className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              </div>
              <p className="text-slate-400 text-xs">
                You're receiving this because you're part of Rugumaho.<br/>
                Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          <span>Draft automatically saved {savedTime ? `at ${savedTime}` : "just now"}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSendTestEmail}
            className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Send Test Email
          </button>
          <button 
            onClick={handleSchedule}
            className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button 
            onClick={handleSendNow}
            className="px-8 py-2.5 rounded-lg bg-primary text-slate-900 font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Now
          </button>
        </div>
      </footer>
    </div>
  );
}
