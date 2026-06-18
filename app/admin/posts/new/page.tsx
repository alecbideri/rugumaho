"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  Quote, 
  Link as LinkIcon, 
  List, 
  Image as ImageIcon, 
  Video, 
  ImagePlus, 
  Settings, 
  Edit3, 
  X, 
  Globe, 
  ArrowLeft,
  Eye,
  Sparkles,
  CheckCircle,
  Flower
} from "lucide-react";
import { getPosts, addPost, updatePost, Post } from "../../../../lib/mockData";

// Loading Fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
      <div className="text-slate-400 text-sm font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-primary" />
        Loading workspace...
      </div>
    </div>
  );
}

// Inner Editor Component
function NewPostEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // State bindings
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"Travel" | "Motherhood" | "Fitness" | "Lifestyle">("Travel");
  const [tags, setTags] = useState<string[]>(["Adventure", "Story"]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuBhvB0y0uOyIw_p3KdqF7An70gEZQR_bAcTwuFngKFm0tTd-haobprSnkTwQY5sxtcWlxkB8B_5vnfdRKv1VfbRpt3O07I9FvZn5Y47iYVhREULiYpAxmOfOGAAeS-mZziLUwxPEdV8cETi41yjBBhx7XSXTilH4WUDHrpcBqH7HGOQZQo5wYYpmzUsj5vhJ0MuaFLM84O9903gA1qM7vfSy7OIs1rGZTOqdg4D4jAdXdezG4sE6E-fSS_8o8r4hOL-uuxz8YiCTaw");
  const [excerpt, setExcerpt] = useState("");
  const [visibility, setVisibility] = useState<"Public" | "Private">("Public");
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [isEditing, setIsEditing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState("Start writing your story here...");

  const editorRef = useRef<HTMLDivElement>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load editing post if ID exists
  useEffect(() => {
    if (editId) {
      const allPosts = getPosts();
      const post = allPosts.find((p) => p.id === editId);
      if (post) {
        setIsEditing(true);
        setTitle(post.title);
        setCategory(post.category || "Travel");
        setTags(post.tags || []);
        setCoverImage(post.coverImage || "");
        setExcerpt(post.excerpt || "");
        setStatus(post.status);
        setVisibility(post.status === "published" ? "Public" : "Private");
        setInitialContent(post.content);
        setContent(post.content);
        if (editorRef.current) {
          editorRef.current.innerHTML = post.content;
        }
      }
    }
  }, [editId]);

  // Handle auto-growing textarea height
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = "auto";
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleEditorFocus = () => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === "Start writing your story here...") {
      editorRef.current.innerHTML = "";
    }
  };

  const handleEditorBlur = () => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === "") {
      editorRef.current.innerHTML = "Start writing your story here...";
    } else if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const formatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLinkButton = () => {
    const url = prompt("Enter the URL link:");
    if (url) {
      formatText("createLink", url);
    }
  };

  const handleImageButton = () => {
    const url = prompt("Enter the image URL:");
    if (url) {
      formatText("insertImage", url);
    }
  };

  const handleVideoButton = () => {
    const embedCode = prompt("Enter video URL or YouTube embed code:");
    if (embedCode) {
      if (embedCode.includes("<iframe")) {
        formatText("insertHTML", `<div class="aspect-video w-full my-4">${embedCode}</div>`);
      } else {
        formatText("insertHTML", `<video src="${embedCode}" controls class="w-full my-4 rounded-lg" />`);
      }
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleEditFeaturedImage = () => {
    const url = prompt("Enter new cover image URL:", coverImage);
    if (url) {
      setCoverImage(url);
    }
  };

  const handleDropzoneClick = () => {
    const url = prompt("Enter image URL to use as cover:");
    if (url) {
      setCoverImage(url);
    }
  };

  const handleSave = (statusToSave: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please enter a story title before saving.");
      return;
    }

    const calculatedReadTime = () => {
      const text = editorRef.current?.innerText || "";
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200));
      return `${minutes} min read`;
    };

    const finalContent = editorRef.current && editorRef.current.innerHTML !== "Start writing your story here..."
      ? editorRef.current.innerHTML
      : "";

    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const postData = {
      title,
      slug: cleanSlug,
      excerpt: excerpt || title,
      content: finalContent,
      coverImage,
      category,
      tags,
      author: "Ariane Rugumaho",
      status: statusToSave,
      readTime: calculatedReadTime()
    };

    if (isEditing && editId) {
      updatePost({
        ...postData,
        id: editId,
        createdAt: new Date().toISOString().split("T")[0]
      });
      triggerToast("Post updated successfully!");
    } else {
      addPost(postData);
      triggerToast("Post created successfully!");
    }

    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const cleanSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Toast alert banner */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold">{showToast}</span>
        </div>
      )}

      {/* Embedded Global Editor Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .wysiwyg-content:focus { outline: none; }
        .wysiwyg-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-family: var(--font-playfair), serif;
          color: var(--foreground);
        }
        .wysiwyg-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-playfair), serif;
          color: var(--foreground);
        }
        .wysiwyg-content blockquote {
          border-left: 4px solid #2bcdee;
          padding-left: 1rem;
          font-style: italic;
          color: #64748b;
          margin: 1.5rem 0;
        }
        .wysiwyg-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .wysiwyg-content img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          width: 100%;
          max-height: 400px;
          object-fit: cover;
        }
      ` }} />

      {/* Editor Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/dashboard" 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Flower className="text-primary w-8 h-8 shrink-0 animate-spin-slow" />
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Rugumaho <span className="font-normal text-slate-500">Studio</span>
              </h1>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <span className={`size-2 rounded-full ${status === "published" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
              {status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Preview
          </button>
          <button 
            type="button"
            onClick={() => handleSave("draft")}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
          >
            Save Draft
          </button>
          <button 
            type="button"
            onClick={() => handleSave("published")}
            className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm shadow-primary/20 transition-all cursor-pointer"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Editable Workspace */}
        <section className="flex-1 overflow-y-auto px-6 py-12 scrollbar-none">
          <div className="max-w-[700px] mx-auto relative">
            
            {/* Formatting Sticky Toolbar */}
            <div className="sticky top-0 z-40 mb-12 flex justify-center">
              <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none">
                <button 
                  onClick={() => formatText("bold")}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Bold"
                >
                  <Bold className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => formatText("italic")}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Italic"
                >
                  <Italic className="w-5 h-5" />
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button 
                  onClick={() => formatText("formatBlock", "<h2>")}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors font-bold text-sm"
                  title="Heading 2"
                >
                  H2
                </button>
                <button 
                  onClick={() => formatText("formatBlock", "<h3>")}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors font-bold text-sm"
                  title="Heading 3"
                >
                  H3
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button 
                  onClick={() => formatText("formatBlock", "<blockquote>")}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Blockquote"
                >
                  <Quote className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLinkButton}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => formatText("insertUnorderedList")}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Bullet List"
                >
                  <List className="w-5 h-5" />
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button 
                  onClick={handleImageButton}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleVideoButton}
                  type="button"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Video"
                >
                  <Video className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Title Input */}
            <textarea 
              ref={titleTextareaRef}
              className="w-full text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 border-none focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 resize-none overflow-hidden mb-8 bg-transparent" 
              placeholder="Your Story Title..." 
              rows={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Rich Editor Field */}
            <div 
              ref={editorRef}
              className="wysiwyg-content min-h-[500px] text-lg font-serif leading-relaxed text-slate-700 dark:text-slate-300 focus:outline-none" 
              contentEditable="true"
              onFocus={handleEditorFocus}
              onBlur={handleEditorBlur}
              onInput={handleEditorInput}
              dangerouslySetInnerHTML={{ __html: initialContent }}
            />

            {/* Dropzone area at bottom */}
            <div className="mt-12">
              <div 
                onClick={handleDropzoneClick}
                className="border-2 border-dashed border-primary/20 hover:border-primary hover:bg-primary/[0.02] rounded-xl p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Drop an image here</p>
                  <p className="text-xs text-slate-500">or click to upload from your computer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Post Settings Right Sidebar */}
        <aside className="w-80 border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark overflow-y-auto flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Post Settings</h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Category Select */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary focus:ring-primary dark:text-white"
              >
                <option value="Travel">Travel</option>
                <option value="Motherhood">Motherhood</option>
                <option value="Fitness">Fitness &amp; Wellness</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Interactive Tags Builder */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight">Tags</label>
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                {tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    {tag} 
                    <X 
                      onClick={() => removeTag(idx)}
                      className="w-3 h-3 cursor-pointer hover:opacity-80" 
                    />
                  </span>
                ))}
                <input 
                  className="flex-1 bg-transparent border-none p-0 text-xs focus:ring-0 min-w-[50px] dark:text-white" 
                  placeholder="Add..." 
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
            </div>

            {/* Featured Image aspect ratio Box */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase">Featured Image</label>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 group border border-slate-100 dark:border-slate-800">
                {coverImage ? (
                  <>
                    <img 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                      src={coverImage}
                      alt="Featured image cover"
                    />
                    <button 
                      onClick={handleEditFeaturedImage}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditFeaturedImage}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-xs">Add Image</span>
                  </button>
                )}
              </div>
            </div>

            {/* Excerpt with Character Counter */}
            <div className="space-y-3">
              <label className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Excerpt</span>
                <span className="font-normal normal-case italic">{excerpt.length}/160</span>
              </label>
              <textarea 
                className="w-full h-24 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary focus:ring-primary resize-none dark:text-white" 
                placeholder="Write a short summary..."
                maxLength={160}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            {/* SEO Live Preview Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-500 uppercase">SEO Preview</label>
              <div className="space-y-1">
                <p className="text-[12px] text-[#1a0dab] dark:text-blue-400 font-medium truncate">
                  {title || "Your Story Title..."} - Rugumaho
                </p>
                <p className="text-[10px] text-[#006621] dark:text-emerald-500 truncate">
                  rugumaho.com/posts/{cleanSlug || "your-story"}...
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                  {excerpt || "This is how your post will appear in search results. Make sure to include keywords in your excerpt."}
                </p>
              </div>
            </div>

            {/* Publishing Settings Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Publish Immediately</span>
                <button 
                  type="button"
                  onClick={() => setPublishImmediately(!publishImmediately)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-0 ${
                    publishImmediately ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    publishImmediately ? "translate-x-5" : "translate-x-0"
                  }`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visibility</span>
                </div>
                <select 
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="text-xs bg-transparent border-none p-0 focus:ring-0 text-primary font-semibold text-right cursor-pointer"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* High-Fidelity Blog Post Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 text-slate-500">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Story Preview</span>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-6">
              {/* Category */}
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                {category === "Fitness" ? "Fitness & Wellness" : category}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {title || "Untitled Story"}
              </h1>

              {/* Author & Info */}
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <img 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  alt="Ariane avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAot0CfIGSP0ePMPx8RhsKrHib5Ilicb7ExC-mnkh9SeEky65sqhFLJw2BsSftAarX5sCXmNlRwApy3IIqmqvFiik_riZHC94s-Q7A7yhE2n0DwEEfIxcz5WdERXtI1Cxr9aNvx8sr3dq4NOo7rKiJ8TjndYuHFTtEx3jmSBRuajEpaBewgoVPwGKDomlJegbsdvg9sGbGDZrsIej_0M-tCZUjp302UFWtJXwt-2TVPGJhXxfROU9qQiBvoCCNaiLHDNUxx8qO0-l0"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Ariane Rugumaho</span>
                  <span className="mx-2">•</span>
                  <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>

              {/* Featured Cover preview */}
              {coverImage && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <img className="w-full h-full object-cover" src={coverImage} alt="Cover Preview" />
                </div>
              )}

              {/* Excerpt */}
              {excerpt && (
                <p className="text-slate-500 dark:text-slate-400 text-lg italic border-l-2 border-slate-200 dark:border-slate-700 pl-4 font-serif">
                  {excerpt}
                </p>
              )}

              {/* Rich Body Content */}
              <div 
                className="wysiwyg-content text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-serif pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800"
                dangerouslySetInnerHTML={{ __html: content || "<p class='italic text-slate-400'>Write content to see preview...</p>" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Suspense wrapped Page component
export default function NewPostPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewPostEditor />
    </Suspense>
  );
}
