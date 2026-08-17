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
  ArrowRight
} from "lucide-react";
import { getPosts, addPost, updatePost, Post } from "../../../../lib/mockData";
import { uploadImageToImageKit } from "../../../../lib/imagekitActions";
import { compressImage } from "../../../../lib/imageCompression";
import Logo from "@/components/Logo";

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
  const [category, setCategory] = useState<"Travel" | "Motherhood" | "Fitness" | "Wellbeing" | "Lifestyle">("Travel");
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
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);

  const uploadSelectionRef = useRef<Range | null>(null);
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

  const editorRef = useRef<HTMLDivElement>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  // Load editing post if ID exists
  useEffect(() => {
    if (editId) {
      getPosts().then((allPosts) => {
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
          setIsFeatured(post.isFeatured || false);
          setContent(post.content);
          if (editorRef.current) {
            editorRef.current.innerHTML = post.content;
          }
        }
      }).catch((err) => {
        console.error("Failed to load post for editing:", err);
      });
    } else {
      // If creating a new post, initialize helper placeholder
      if (editorRef.current && !content) {
        editorRef.current.innerHTML = "Start writing your story here...";
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

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const handleImageButton = () => {
    uploadSelectionRef.current = saveCurrentSelection();
    showChoiceModal(
      "Insert Image",
      "Choose how you want to add an image to your story:",
      [
        {
          label: "Upload from computer",
          action: () => inlineFileInputRef.current?.click()
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
                savedSelection: uploadSelectionRef.current
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
    const captionText = mediaModal.caption.trim() || `Write ${mediaModal.type} caption...`;

    if (mediaModal.type === "image") {
      const imgHTML = `
        <div class="my-6 text-center select-none" contenteditable="false">
          <img src="${mediaModal.url.trim()}" class="rounded-xl max-h-[450px] object-cover w-full shadow-md" alt="Story image" />
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-2 font-serif italic border-none focus:outline-none" contenteditable="true">${captionText}</p>
        </div>
        <p><br></p>
      `;
      formatText("insertHTML", imgHTML);
    } else {
      const ytEmbed = getYouTubeEmbedUrl(mediaModal.url.trim());
      let mediaHTML = "";
      if (ytEmbed) {
        mediaHTML = `<iframe src="${ytEmbed}" class="w-full aspect-video rounded-xl shadow-md" frameborder="0" allowfullscreen></iframe>`;
      } else if (mediaModal.url.trim().includes("<iframe")) {
        mediaHTML = `<div class="aspect-video w-full my-4">${mediaModal.url.trim()}</div>`;
      } else {
        mediaHTML = `<video src="${mediaModal.url.trim()}" controls class="w-full my-4 rounded-xl shadow-md" />`;
      }

      const videoHTML = `
        <div class="my-6 text-center select-none" contenteditable="false">
          <div class="w-full rounded-xl overflow-hidden shadow-md bg-slate-900">${mediaHTML}</div>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-2 font-serif italic border-none focus:outline-none" contenteditable="true">${captionText}</p>
        </div>
        <p><br></p>
      `;
      formatText("insertHTML", videoHTML);
    }

    setMediaModal({ isOpen: false, type: "image", url: "", caption: "", savedSelection: null });
  };

  const handleInlineFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerToast("Uploading image to ImageKit...");
    try {
      const base64 = await compressImage(file);
      const res = await uploadImageToImageKit(base64, file.name);
      if (res.success && res.url) {
        restoreCurrentSelection(uploadSelectionRef.current);
        const imgHTML = `
          <div class="my-6 text-center select-none" contenteditable="false">
            <img src="${res.url}" class="rounded-xl max-h-[450px] object-cover w-full shadow-md" alt="Story image" />
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-2 font-serif italic border-none focus:outline-none" contenteditable="true">Write image caption...</p>
          </div>
          <p><br></p>
        `;
        formatText("insertHTML", imgHTML);
        triggerToast("Image inserted successfully!");
      } else {
        alert("ImageKit upload failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to read and compress file: " + err.message);
    }
    // Reset file input value so same file can be uploaded again
    e.target.value = "";
  };

  const handleVideoButton = () => {
    const savedSel = saveCurrentSelection();
    setMediaModal({
      isOpen: true,
      type: "video",
      url: "",
      caption: "",
      savedSelection: savedSel
    });
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
    showChoiceModal(
      "Set Cover Image",
      "Choose how you want to set your featured cover image:",
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
                "Enter the direct web address (URL) of the cover photo:",
                coverImage || "",
                "https://example.com/cover.jpg",
                (url) => {
                  if (url.trim()) setCoverImage(url.trim());
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

    setIsUploadingFeatured(true);
    triggerToast("Uploading cover image...");
    try {
      const base64 = await compressImage(file);
      const res = await uploadImageToImageKit(base64, file.name);
      setIsUploadingFeatured(false);
      if (res.success && res.url) {
        setCoverImage(res.url);
        triggerToast("Cover image uploaded successfully!");
      } else {
        alert("ImageKit upload failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      setIsUploadingFeatured(false);
      alert("Failed to read and compress file: " + err.message);
    }
    // Reset file input value so same file can be uploaded again
    e.target.value = "";
  };

  const getDynamicWordCount = () => {
    if (typeof document === "undefined" || !editorRef.current) return 0;
    const text = editorRef.current.innerText || "";
    const cleanText = text.trim();
    if (!cleanText || cleanText === "Start writing your story here...") return 0;
    return cleanText.split(/\s+/).filter(w => w.length > 0).length;
  };

  const getDynamicReadTime = () => {
    const words = getDynamicWordCount();
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  const handleSave = (statusToSave: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please enter a story title before saving.");
      return;
    }

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
      readTime: getDynamicReadTime(),
      isFeatured
    };

    if (isEditing && editId) {
      updatePost({
        ...postData,
        id: editId,
        createdAt: new Date().toISOString().split("T")[0]
      }).then(() => {
        triggerToast("Post updated successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      }).catch((err) => {
        console.error("Error updating post:", err);
        alert("Failed to update post. See console.");
      });
    } else {
      addPost(postData).then(() => {
        triggerToast("Post created successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      }).catch((err) => {
        console.error("Error creating post:", err);
        alert("Failed to create post. See console.");
      });
    }
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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 h-screen overflow-hidden flex flex-col">
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
          border-left: 4px solid var(--color-primary);
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
        .wysiwyg-content div[contenteditable="false"] p[contenteditable="true"]:focus {
          outline: 1px dashed var(--color-primary);
          border-radius: 4px;
          padding: 2px 6px;
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
              <Logo className="h-7 w-auto shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Studio</span>
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
            className="px-5 py-2 text-sm font-bold text-white dark:text-slate-900 bg-primary hover:bg-primary/90 rounded-lg shadow-sm shadow-primary/20 transition-all cursor-pointer"
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
            <div className="sticky top-4 z-40 mb-12 flex justify-center">
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

            {/* Hidden File Inputs for ImageKit */}
            <input 
              type="file" 
              ref={featuredFileInputRef} 
              onChange={handleFeaturedFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <input 
              type="file" 
              ref={inlineFileInputRef} 
              onChange={handleInlineFileChange} 
              className="hidden" 
              accept="image/*" 
            />

            {/* Story Title Input */}
            <textarea 
              ref={titleTextareaRef}
              className="w-full text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 border-none focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 resize-none overflow-hidden mb-8 bg-transparent" 
              placeholder="Your Story Title..." 
              rows={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div 
              ref={editorRef}
              className="wysiwyg-content min-h-[500px] text-lg font-serif leading-relaxed text-slate-700 dark:text-slate-300 focus:outline-none" 
              contentEditable="true"
              onFocus={handleEditorFocus}
              onBlur={handleEditorBlur}
              onInput={handleEditorInput}
              suppressContentEditableWarning={true}
            />
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
                <option value="Wellbeing">Wellbeing</option>
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
                ) : isUploadingFeatured ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-primary">
                    <span className="size-6 rounded-full border-2 border-t-primary border-slate-200 dark:border-slate-700 animate-spin"></span>
                    <span className="text-[10px] font-semibold text-slate-500">Uploading...</span>
                  </div>
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

            {/* Live Stats */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-500 uppercase">Story Stats</label>
              <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-400">
                <span className="text-slate-400">Words Count:</span>
                <span className="text-slate-900 dark:text-white font-bold">{getDynamicWordCount().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-400">
                <span className="text-slate-400">Est. Read Time:</span>
                <span className="text-primary font-bold">{getDynamicReadTime()}</span>
              </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Feature in Hero</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-0 ${
                    isFeatured ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isFeatured ? "translate-x-5" : "translate-x-0"
                  }`}></span>
                </button>
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
                {category === "Fitness" || category === "Wellbeing" ? "Wellbeing" : category}
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
                  src="/profile.png"
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

      {/* Custom Premium Modal Dialog */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-105 dark:border-slate-800 p-6 space-y-6 animate-scale-in">
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
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-650 pt-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Actions for Prompt */}
            {modal.type !== 'choice' && (
              <div className="flex justify-end gap-3 border-t border-slate-50 dark:border-slate-850 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-bold text-slate-450 dark:text-slate-400 hover:text-slate-905 dark:hover:text-white cursor-pointer"
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

      {/* Custom Link Modal with captions/text builder */}
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
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-850">
              <button 
                type="button"
                onClick={() => setLinkModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white"
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

      {/* Custom Media (Image/Video) Modal with captions builder */}
      {mediaModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-scale-in">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white capitalize">
              Insert {mediaModal.type} URL
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  {mediaModal.type === 'image' ? 'Direct Image URL' : 'YouTube Link / Embed Code'}
                </label>
                <input 
                  type="text" 
                  value={mediaModal.url}
                  onChange={(e) => setMediaModal(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={mediaModal.type === 'image' ? 'https://example.com/photo.jpg' : 'https://youtube.com/watch?v=...'}
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
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-850">
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

// Suspense wrapped Page component
export default function NewPostPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewPostEditor />
    </Suspense>
  );
}
