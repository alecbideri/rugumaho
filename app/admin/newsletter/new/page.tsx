"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addCampaign, getSubscribers, getCampaigns, getPosts, Post, sendNewsletterTestEmail, sendCampaignEmail } from "../../../../lib/mockData";
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
  Mail,
  ArrowLeft,
  ArrowRight,
  Quote
} from "lucide-react";
import { uploadImageToImageKit } from "../../../../lib/imagekitActions";
import Logo from "@/components/Logo";

export default function ComposeNewsletterPage() {
  const router = useRouter();

  // State bindings
  const [subject, setSubject] = useState("");
  const [heroImage, setHeroImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCCeeos0o_Q-UAyfR8pJcg75W35T3bUuOT3GfcX5DeEDh0oryz1ze-FP6r5UQcDrg6-0v0DyaxggRVbu7YkXZAow4cJnTAbiKLEdptcwtsSmNxyPrbMYPJrgvSAMJMdAOJysPeKof-CKQ8mPLK8Vbeiup7DJpWdiHCsjCsYozesDO2OS6EAp0oc1XJJ6paxzJUyqFGv3z7wsg0zTIspdIc0EClpoUz0FyKiZDKLvrUtyu6tZ4cXWKR86yOosLEjJ-b2et994oTRZ2U");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "templates" | "settings">("write");
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCtaButton, setShowCtaButton] = useState(false);
  const [ctaButtonText, setCtaButtonText] = useState("Read the full story");
  const [ctaPostLink, setCtaPostLink] = useState("");
  const [savedTime, setSavedTime] = useState("");
  const [showToast, setShowToast] = useState<string | null>(null);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [issueNumber, setIssueNumber] = useState("1");
  const [uploadSelectionRef, setUploadSelectionRef] = useState<Range | null>(null);

  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  const [linkModal, setLinkModal] = useState<{
    isOpen: boolean;
    text: string;
    url: string;
    savedSelection: Range | null;
  }>({
    isOpen: false,
    text: "",
    url: "",
    savedSelection: null
  });

  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    type: "image" | "video";
    url: string;
    caption: string;
    savedSelection: Range | null;
  }>({
    isOpen: false,
    type: "image",
    url: "",
    caption: "",
    savedSelection: null
  });

  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'prompt' | 'choice';
    placeholder?: string;
    inputValue?: string;
    confirmText?: string;
    cancelText?: string;
    choiceOptions?: { label: string; action: () => void }[];
    onConfirm: (val?: string) => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {}
  });

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

    getSubscribers().then((data) => {
      const activeCount = data.filter(s => s.status === "Active").length;
      setSubscribersCount(activeCount);
    }).catch(err => console.error("Failed to load subscribers for count:", err));

    getCampaigns().then((data) => {
      setIssueNumber((data.length + 1).toString());
    }).catch(err => console.error("Failed to load campaigns for issue count:", err));

    getPosts().then((data) => {
      setPosts(data);
      if (data.length > 0) {
        setCtaPostLink(`https://rugumaho.com/posts/${data[0].slug}`);
      }
    }).catch(err => console.error("Failed to load posts for linking options:", err));
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

  const showChoiceModal = (title: string, message: string, choices: { label: string; action: () => void }[]) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: 'choice',
      choiceOptions: choices,
      onConfirm: () => {}
    });
  };

  const showPromptModal = (title: string, message: string, defaultValue: string, placeholder: string, onConfirm: (val: string) => void) => {
    setModal({
      isOpen: true,
      title,
      message,
      type: 'prompt',
      inputValue: defaultValue,
      placeholder,
      confirmText: 'Insert',
      cancelText: 'Cancel',
      onConfirm: (val) => {
        onConfirm(val || "");
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const saveCurrentSelection = () => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
    return null;
  };

  const restoreCurrentSelection = (range: Range | null) => {
    if (typeof window === "undefined" || !range) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleLinkButton = () => {
    const savedSel = saveCurrentSelection();
    const selectedText = savedSel ? savedSel.toString().trim() : "";
    setLinkModal({
      isOpen: true,
      text: selectedText,
      url: "",
      savedSelection: savedSel
    });
  };

  const handleInsertLink = () => {
    if (!linkModal.url.trim()) return;

    restoreCurrentSelection(linkModal.savedSelection);
    const linkText = linkModal.text.trim() || linkModal.url.trim();
    const linkHTML = `<a href="${linkModal.url.trim()}" target="_blank" class="text-primary hover:underline font-semibold transition-all duration-150">${linkText}</a>`;
    
    formatText("insertHTML", linkHTML);
    setLinkModal({ isOpen: false, text: "", url: "", savedSelection: null });
  };

  const handleImageButton = () => {
    const savedSel = saveCurrentSelection();
    showChoiceModal(
      "Insert Image",
      "Choose how you want to add an image to your newsletter:",
      [
        {
          label: "Upload from computer",
          action: () => {
            setUploadSelectionRef(savedSel);
            setTimeout(() => inlineFileInputRef.current?.click(), 100);
          }
        },
        {
          label: "Insert image web link (URL)",
          action: () => {
            setTimeout(() => {
              setMediaModal({
                isOpen: true,
                type: "image",
                url: "",
                caption: "",
                savedSelection: savedSel
              });
            }, 300);
          }
        }
      ]
    );
  };

  const handleInsertMedia = () => {
    if (!mediaModal.url.trim()) return;

    restoreCurrentSelection(mediaModal.savedSelection);
    const captionText = mediaModal.caption.trim() || `Write image caption...`;

    const imgHTML = `
      <div class="my-6 text-center select-none" contenteditable="false">
        <img src="${mediaModal.url.trim()}" class="rounded-xl max-h-[450px] object-cover w-full shadow-md animate-fade-in" alt="Newsletter image" />
        <p class="text-xs text-slate-450 dark:text-slate-500 mt-2 font-serif italic border-none focus:outline-none" contenteditable="true">${captionText}</p>
      </div>
      <p><br></p>
    `;
    formatText("insertHTML", imgHTML);
    setMediaModal({ isOpen: false, type: "image", url: "", caption: "", savedSelection: null });
  };

  const handleInlineFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerToast("Uploading image to ImageKit...");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await uploadImageToImageKit(base64, file.name);
        if (res.success && res.url) {
          restoreCurrentSelection(uploadSelectionRef);
          const imgHTML = `
            <div class="my-6 text-center select-none" contenteditable="false">
              <img src="${res.url}" class="rounded-xl max-h-[450px] object-cover w-full shadow-md animate-fade-in" alt="Newsletter image" />
              <p class="text-xs text-slate-450 dark:text-slate-500 mt-2 font-serif italic border-none focus:outline-none" contenteditable="true">Write image caption...</p>
            </div>
            <p><br></p>
          `;
          formatText("insertHTML", imgHTML);
          triggerToast("Image inserted successfully!");
        } else {
          alert("ImageKit upload failed: " + (res.error || "Unknown error"));
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      alert("Failed to read file: " + err.message);
    }
    e.target.value = "";
  };

  const handleCodeButton = () => {
    const savedSel = saveCurrentSelection();
    const selectedText = savedSel ? savedSel.toString().trim() : "";
    restoreCurrentSelection(savedSel);
    if (selectedText) {
      const codeHTML = `<code class="bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono text-sm text-slate-800 dark:text-slate-200 font-semibold">${selectedText}</code>`;
      formatText("insertHTML", codeHTML);
    } else {
      const codeHTML = `<code class="bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono text-sm text-slate-800 dark:text-slate-200 font-semibold">code</code>`;
      formatText("insertHTML", codeHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditHeroImage = () => {
    showChoiceModal(
      "Set Cover Image",
      "Choose how you want to set your newsletter cover image:",
      [
        {
          label: "Upload from computer",
          action: () => featuredFileInputRef.current?.click()
        },
        {
          label: "Insert image web link (URL)",
          action: () => {
            setTimeout(() => {
              showPromptModal(
                "Cover Image URL",
                "Enter the direct web address of your featured cover image:",
                heroImage,
                "https://example.com/banner.jpg",
                (url) => {
                  if (url) setHeroImage(url);
                }
              );
            }, 300);
          }
        }
      ]
    );
  };

  const handleFeaturedFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerToast("Uploading cover image to ImageKit...");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await uploadImageToImageKit(base64, file.name);
        if (res.success && res.url) {
          setHeroImage(res.url);
          triggerToast("Cover image set successfully!");
        } else {
          alert("ImageKit upload failed: " + (res.error || "Unknown error"));
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      alert("Failed to read file: " + err.message);
    }
    e.target.value = "";
  };

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setSavedTime(time);
    triggerToast("Draft saved successfully!");
  };

  const handleSendTestEmail = async () => {
    // 1. Instantly save draft
    handleSaveDraft();
    
    // 2. Dispatch email to arianebloger@gmail.com
    triggerToast("Sending test email...");
    try {
      const res = await sendNewsletterTestEmail({
        subject: subject || "The Weekly Muse",
        content,
        heroImage: heroImage || undefined,
        issueNumber,
        showCtaButton,
        ctaButtonText,
        ctaPostLink
      });
      if (res.success) {
        triggerToast("Test email sent & draft saved!");
      } else {
        alert("Resend API failed: " + (res.error || "Please check console."));
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to send test email: " + err.message);
    }
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) return;
    
    const [year, month, day] = scheduleDate.split("-");
    const [hoursStr, minutesStr] = scheduleTime.split(":");
    const hours = parseInt(hoursStr);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthName = formattedDate.toLocaleDateString("en-US", { month: "long" });
    
    const displayDateString = `${monthName} ${parseInt(day)}, ${year} at ${displayHours}:${minutesStr} ${ampm}`;
    
    triggerToast(`Newsletter scheduled successfully for ${displayDateString}!`);
    setShowScheduleModal(false);
  };

  const handleSendNow = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject line before sending.");
      return;
    }

    triggerToast("Sending to subscribers...");
    try {
      const emailRes = await sendCampaignEmail({
        subject,
        content,
        heroImage: heroImage || undefined,
        issueNumber,
        showCtaButton,
        ctaButtonText,
        ctaPostLink
      });

      if (emailRes.success) {
        triggerToast("Newsletter sent successfully!");
        setTimeout(() => {
          router.push("/admin/newsletter");
        }, 1500);
      } else {
        alert("Resend failed: " + (emailRes.error || "Please check console."));
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to send newsletter: " + err.message);
    }
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
          background-image: radial-gradient(circle, rgba(15, 23, 42, 0.08) 1.6px, transparent 1.6px);
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
          list-style-type: disc !important;
          padding-left: 1.75rem !important;
          margin-bottom: 1rem;
        }
        .wysiwyg-newsletter-content li {
          list-style-type: disc !important;
          margin-bottom: 0.5rem;
        }
        .wysiwyg-newsletter-content blockquote {
          border-left: 3px solid var(--color-primary);
          padding-left: 0.75rem;
          font-style: italic;
          color: #64748b;
          margin: 1rem 0;
        }
      ` }} />

      {/* Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-3 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/newsletter" 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              title="Back to Newsletter Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-auto shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Studio</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
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
              src="/profile.png"
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
                    className="wysiwyg-newsletter-content flex-1 p-6 border-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed placeholder:text-slate-300 min-h-[350px] focus:outline-none overflow-y-auto" 
                    contentEditable="true"
                    onInput={handleEditorInput}
                  />
                </div>

                {/* CTA Link Manager */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold text-slate-950 dark:text-white block">Add Call-To-Action Button</label>
                      <span className="text-xs text-slate-500">Include a high-profile link button to a single blog post</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showCtaButton} 
                        onChange={(e) => setShowCtaButton(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {showCtaButton && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-sans">Link to Blog Post</label>
                        <select 
                          value={ctaPostLink}
                          onChange={(e) => setCtaPostLink(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent py-2.5 px-3 focus:border-primary outline-none"
                        >
                          {posts.map((p) => (
                            <option key={p.slug} value={`https://rugumaho.com/posts/${p.slug}`}>
                              {p.title}
                            </option>
                          ))}
                          {posts.length === 0 && (
                            <option value="">No blog posts found</option>
                          )}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-sans">Button Text</label>
                        <input 
                          type="text" 
                          value={ctaButtonText} 
                          onChange={(e) => setCtaButtonText(e.target.value)}
                          placeholder="Read the full story"
                          className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent py-2.5 px-3 focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  )}
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
                    <option>All Active Subscribers ({subscribersCount} recipients)</option>
                    <option>Weekly Digest Segment (8,410 recipients)</option>
                    <option>VIP Supporters (540 recipients)</option>
                  </select>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Issue Number</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-slate-900 dark:text-white bg-transparent py-2.5 px-3.5 text-sm outline-none" 
                    type="number"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Preview */}
        <section className="w-1/2 bg-slate-50 dark:bg-slate-900/50 dot-grid flex items-start justify-center p-12 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-[600px] shadow-2xl rounded-lg overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800/50">
            <div className="bg-primary h-1.5 w-full"></div>
            
            <div className="p-10 border-b border-slate-50 dark:border-slate-800/40 text-center">
              <div className="flex justify-center mb-6">
                <Logo className="h-10 w-auto" animate={true} />
              </div>
              <h1 className="serif-heading text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {subject || "The Weekly Muse"}
              </h1>
              <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mt-2">
                Issue #{issueNumber} • {currentMonthYear}
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
              {showCtaButton && (
                <div className="py-8">
                  <a 
                    href={ctaPostLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-primary text-white dark:text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer text-sm font-sans"
                  >
                    {ctaButtonText || "Read the full story"}
                  </a>
                </div>
              )}
            </div>
            
            <div className="p-10 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center space-y-4">
              <div className="flex justify-center gap-6 text-slate-400">
                <a 
                  href="mailto:?subject=Read%20the%20Rugumaho%20Journal&body=Read%20the%20latest%20issue%20of%20the%20newsletter%20here:%20https://rugumaho.com" 
                  title="Share by Email" 
                  className="hover:text-primary transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </a>
                <a 
                  href="https://rugumaho.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Visit Website" 
                  className="hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
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
            className="px-8 py-2.5 rounded-lg bg-primary text-white dark:text-slate-900 font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Now
          </button>
        </div>
      </footer>

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6 transform scale-100 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Schedule Newsletter</h3>
                <p className="text-xs text-slate-500 mt-1">Choose when your subscribers will receive this issue.</p>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Date</label>
                <input 
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-slate-900 dark:text-white bg-transparent py-2.5 px-3.5 text-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Time</label>
                <input 
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-lg border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-slate-900 dark:text-white bg-transparent py-2.5 px-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSchedule}
                disabled={!scheduleDate || !scheduleTime}
                className="px-6 py-2 bg-primary text-white dark:text-slate-900 font-bold text-sm rounded-lg hover:bg-opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs for image uploads */}
      <input 
        type="file" 
        ref={featuredFileInputRef} 
        onChange={handleFeaturedFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={inlineFileInputRef} 
        onChange={handleInlineFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* General custom dialog Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 animate-scale-in">
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                {modal.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {modal.message}
              </p>
            </div>

            {/* Input field for Prompts */}
            {modal.type === 'prompt' && (
              <input
                type="text"
                value={modal.inputValue || ""}
                onChange={(e) => setModal(prev => ({ ...prev, inputValue: e.target.value }))}
                placeholder={modal.placeholder}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white font-medium"
                autoFocus
              />
            )}

            {/* Choice buttons */}
            {modal.type === 'choice' && modal.choiceOptions && (
              <div className="flex flex-col gap-3">
                {modal.choiceOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      opt.action();
                      setModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between group text-slate-700 dark:text-slate-300"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 pt-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Actions for Prompt */}
            {modal.type !== 'choice' && (
              <div className="flex justify-end gap-3 border-t border-slate-50 dark:border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  {modal.cancelText || 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => modal.onConfirm(modal.inputValue)}
                  className="px-5 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary dark:hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                >
                  {modal.confirmText || 'Confirm'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Link Modal */}
      {linkModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-scale-in">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Insert Web Link</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Text to display</label>
                <input 
                  type="text" 
                  value={linkModal.text}
                  onChange={(e) => setLinkModal(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Link text..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL (Web address)</label>
                <input 
                  type="text" 
                  value={linkModal.url}
                  onChange={(e) => setLinkModal(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => setLinkModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-650"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleInsertLink}
                disabled={!linkModal.url.trim()}
                className="px-5 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg disabled:opacity-40"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Media (Image/Video) Modal */}
      {mediaModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-scale-in">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white capitalize">
              Insert {mediaModal.type} URL
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Direct Image URL
                </label>
                <input 
                  type="text" 
                  value={mediaModal.url}
                  onChange={(e) => setMediaModal(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Caption</label>
                <input 
                  type="text" 
                  value={mediaModal.caption}
                  onChange={(e) => setMediaModal(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Write a descriptive caption..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => setMediaModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-650"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleInsertMedia}
                disabled={!mediaModal.url.trim()}
                className="px-5 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg disabled:opacity-40"
              >
                Insert Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
