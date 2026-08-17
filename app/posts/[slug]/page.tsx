"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getPostBySlug, getPosts, Post, getApprovedComments, addComment, incrementPostViews, likeComment } from "../../../lib/mockData";
import { 
  Calendar, 
  User, 
  Clock, 
  ChevronRight, 
  Share2, 
  MessageCircle, 
  Bookmark, 
  Link as LinkIcon, 
  ThumbsUp, 
  ChevronDown,
  CheckCircle
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Logo from "../../../components/Logo";
import ImageWithPlaceholder from "../../../components/ImageWithPlaceholder";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  email?: string;
  replies?: Comment[];
}

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "David Kim",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbMCsh05251zcwDvg3kcM3FnWO85UZURM6okUVl0_qbpQBVd1CLx-rz7E43zGSE7kkfx0Hp_6KI_PJ-t4PGNel_BcFUUR2jRAX0uj6W88IzhY-YqgV_3dWhxbakZUxbD--MhNr2lQUBsI9VblrwKeVauXAN-b8HMs9Y8S_ZlunreACZa3_uV7iSbYsPFzkTKNvO8Lwf3hCvqAKUIZNpjJwfJ3uUZxtWgs1I4jjK2ZVL2VpJxKeqN6J_NvTBnTlmGFxaEatvkbMBHc",
    content: "This article beautifully captures the essence of Rwanda. I visited Musanze last year and the warmth of the people stayed with me more than anything else.",
    time: "2 days ago",
    likes: 14,
    replies: [
      {
        id: "c1-r1",
        author: "Ariane Rugumaho",
        avatar: "/profile.png",
        content: "So glad it resonated with you, David! The Northern Province truly is something special.",
        time: "1 day ago",
        likes: 5
      },
      {
        id: "c1-r2",
        author: "Sarah B.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZe7Obr-PuQddaI_ovMNlraRIpukYtZSAaDFtta9q4P6q_h9-8D-OmiqSN3PnvII0Zz2-5zsDkiIeZ8Z9KFAFrjdCrL6DQN9JpDAE1QQoVrPka8T2D-GAUAtnPPlLkyjQwIjrK89uUP_qqEZMM2vUuVdPKMA1s8c-ZZsLjoBl58N4vIUSU19Dh9wUOkqfry1d8FETjfi6cdokRyxRL7qwhKxgTQV1SzyN8EAu1yw0ElZiaYeuUJ9tZ5lrn8KdyzWLK5s5fTnhRXYM",
        content: "I'm adding this to my bucket list right now!",
        time: "12 hours ago",
        likes: 1
      }
    ]
  },
  {
    id: "c2",
    author: "Marc Jean",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZe7Obr-PuQddaI_ovMNlraRIpukYtZSAaDFtta9q4P6q_h9-8D-OmiqSN3PnvII0Zz2-5zsDkiIeZ8Z9KFAFrjdCrL6DQN9JpDAE1QQoVrPka8T2D-GAUAtnPPlLkyjQwIjrK89uUP_qqEZMM2vUuVdPKMA1s8c-ZZsLjoBl58N4vIUSU19Dh9wUOkqfry1d8FETjfi6cdokRyxRL7qwhKxgTQV1SzyN8EAu1yw0ElZiaYeuUJ9tZ5lrn8KdyzWLK5s5fTnhRXYM",
    content: "The imagery is stunning. Do you have any recommendations for local guides in the Southern Province?",
    time: "3 days ago",
    likes: 3
  }
];

export default function BlogPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [recommended, setRecommended] = useState<Post[]>([]);
  const [commentComposerFocused, setCommentComposerFocused] = useState(false);

  // Replies states
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");

  const [toast, setToast] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [likedComments, setLikedComments] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rugumaho_liked_comments");
      if (stored) {
        try {
          setLikedComments(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleInstagramShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!post) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      })
      .then(() => setIsShareModalOpen(false))
      .catch((err) => {
        console.error("Native share failed, fallback to copy:", err);
        fallbackInstagramShare();
      });
    } else {
      fallbackInstagramShare();
    }
  };

  const fallbackInstagramShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsShareModalOpen(false);
      setIsInstagramModalOpen(true);
    }
  };

  const isAuthor = (name: string, email?: string) => {
    const lowercaseEmail = email?.toLowerCase().trim();
    return (name === "Ariane Rugumaho" || (post && name === post.author)) && 
           (lowercaseEmail === "hello@rugumaho.com" || lowercaseEmail === "alecbideri@gmail.com");
  };

  useEffect(() => {
    // Increment post views per load securely in Sanity
    incrementPostViews(resolvedParams.slug).catch((err) => {
      console.error("Failed to increment views:", err);
    });

    getPostBySlug(resolvedParams.slug).then((found) => {
      if (found) {
        setPost(found);
      }
      setMounted(true);
    }).catch((err) => {
      console.error("Error fetching post by slug:", err);
      setMounted(true);
    });

    getApprovedComments(resolvedParams.slug).then((data) => {
      const rootComments = data.filter(c => !c.parentId);
      const replies = data.filter(c => c.parentId);

      const mapped = rootComments.map((c) => {
        const commentReplies = replies
          .filter(r => r.parentId === c.id)
          .map(r => ({
            id: r.id,
            author: r.name,
            avatar: r.avatar,
            content: r.content,
            time: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            likes: r.likes || 0,
            email: r.email
          }));

        return {
          id: c.id,
          author: c.name,
          avatar: c.avatar,
          content: c.content,
          time: new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          likes: c.likes || 0,
          email: c.email,
          replies: commentReplies
        };
      });
      setComments(mapped);
    }).catch(err => {
      console.error("Failed to load approved comments:", err);
    });
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (post) {
      getPosts().then((fetched) => {
        const all = fetched.filter(p => p.status === "published" && p.slug !== post.slug);
        let recs = all.filter(p => p.category === post.category);
        if (recs.length < 3) {
          const others = all.filter(p => p.category !== post.category);
          recs = [...recs, ...others];
        }
        setRecommended(recs.slice(0, 3));
      }).catch((err) => {
        console.error("Error fetching recommended posts:", err);
      });
    }
  }, [post]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f6f8f8] dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <Logo className="h-16 w-auto" animate={true} />
        <p className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
          Loading article...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f6f8f8] flex flex-col items-center justify-center gap-4 px-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-slate-500 max-w-md text-center font-light">
          The post you are looking for does not exist or has been deleted.
        </p>
        <Link 
          href="/" 
          className="mt-2 bg-primary text-white dark:text-slate-950 px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const authorInfo = post.author === "Ariane Rugumaho" ? {
    name: "Ariane Rugumaho",
    avatar: "/profile.png",
    bio: "Ariane is a Kigali-based travel writer and photographer dedicated to uncovering the soulful narratives of African heritage and landscape.",
    handle: "@arianerugumaho"
  } : {
    name: post.author,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCILgCbmO9BoZ92G-jMDt55p5rrjWEzCHEybwrHUFaadKeABiyJx-CV8PfeiZGAQSPQey_HKStW0YE7QtCocGyLkO33QA2Eb3tOPf2A3Ykq59390_y-f7a5703qvR6mIMqVYW0ubG85AsFASMx3ENhmQhmus0e248eRPYijWHE1ZC-ZfVjkKmZdTkJWaFCZewLfJb1QI2ilzZX3QnEDsZnqiHs7evHoaouTN6w85BsnH4OsJuA1pikvN89cj2Wck8OWb4__zvrgBg",
    bio: `${post.author} is a lifestyle journalist and editor, sharing curated daily thoughts and stories on travel, health, and design.`,
    handle: "@rugumaho"
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !commentName.trim() || !commentEmail.trim()) return;

    // Initials Avatar generator
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(commentName.trim())}`;

    const newCommentData = {
      postSlug: resolvedParams.slug,
      name: commentName.trim(),
      email: commentEmail.trim(),
      content: newCommentText.trim(),
      avatar: avatarUrl
    };

    addComment(newCommentData).then(() => {
      setIsSubmitted(true);
      setNewCommentText("");
      setCommentName("");
      setCommentEmail("");
      setCommentComposerFocused(false);
      setTimeout(() => setIsSubmitted(false), 7000);
    }).catch((err) => {
      console.error("Failed to submit comment:", err);
      alert("Failed to submit comment: " + (err.message || "Please try again."));
    });
  };

  const handlePostReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !replyName.trim() || !replyEmail.trim()) return;

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(replyName.trim())}`;

    const newReplyData = {
      postSlug: resolvedParams.slug,
      name: replyName.trim(),
      email: replyEmail.trim(),
      content: replyText.trim(),
      avatar: avatarUrl,
      parentId: parentId
    };

    addComment(newReplyData).then(() => {
      setIsSubmitted(true);
      setReplyText("");
      setReplyName("");
      setReplyEmail("");
      setReplyToCommentId(null);
      setTimeout(() => setIsSubmitted(false), 7000);
    }).catch((err) => {
      console.error("Failed to submit reply:", err);
      alert("Failed to submit reply: " + (err.message || "Please try again."));
    });
  };

  const handleLikeComment = (commentId: string) => {
    if (likedComments.includes(commentId)) {
      // Prevent multiple likes per user session
      return;
    }

    setComments(prev => 
      prev.map(c => {
        if (c.id === commentId) {
          return { ...c, likes: (c.likes || 0) + 1 };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? { ...r, likes: (r.likes || 0) + 1 } : r)
          };
        }
        return c;
      })
    );

    // Save liked comment ID in localStorage to prevent repeat clicking
    const updated = [...likedComments, commentId];
    setLikedComments(updated);
    localStorage.setItem("rugumaho_liked_comments", JSON.stringify(updated));

    // Save likes permanently in the Sanity database
    likeComment(commentId).catch((err) => {
      console.error("Failed to save like permanently in Sanity:", err);
    });
  };

  // Simple Markdown parsing for formatting paragraphs, headings, blockquotes, lists
  const renderContentBlocks = (text: string) => {
    const blocks = text.split(/\n\s*\n/);
    return blocks.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={index} className="font-serif text-3xl font-bold text-slate-900 mt-12 mb-6">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="font-serif text-2xl font-bold text-slate-900 mt-10 mb-4">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map(li => li.replace(/^[-*]\s+/, ""));
        return (
          <ul key={index} className="mt-6 space-y-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                <span className="text-slate-750 text-lg">{item}</span>
              </li>
            ))}
          </ul>
        );
      }
      // If it is surrounded by quotes, make it a blockquote
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return (
          <blockquote key={index} className="my-12 border-l-4 border-primary bg-slate-50/50 px-8 py-10 italic text-slate-900">
            <p className="font-serif text-2xl leading-relaxed">
              {trimmed}
            </p>
          </blockquote>
        );
      }

      // First paragraph gets the drop-cap effect
      const isFirstParagraph = index === 0;
      return (
        <p 
          key={index} 
          className={`${isFirstParagraph ? "drop-cap mb-8 text-lg" : "mt-6"} text-slate-700 leading-[1.8]`}
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="dot-grid min-h-screen bg-white font-display text-slate-900 transition-colors duration-200 flex flex-col">
      {post && (
        <>
          <title>{`${post.title} | Rugumaho`}</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={`${post.title} | Rugumaho`} />
          <meta property="og:description" content={post.excerpt} />
          {post.coverImage && <meta property="og:image" content={post.coverImage} />}
          <meta property="og:type" content="article" />
          <link rel="canonical" href={`https://rugumaho.com/posts/${post.slug}`} />
          
          {/* JSON-LD Structured Data Schema for Search Engines (Rich Snippets) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt,
                "image": post.coverImage || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634",
                "datePublished": post.createdAt,
                "author": {
                  "@type": "Person",
                  "name": "Ariane Rugumaho",
                  "url": "https://rugumaho.com/about"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Rugumaho",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://rugumaho.com/logos/rugumaho_logo_microphone_v1.svg"
                  }
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://rugumaho.com/posts/${post.slug}`
                }
              })
            }}
          />
        </>
      )}
      <Navbar />

      {/* Floating Left Sidebar Social Actions */}
      <aside className="fixed left-12 top-1/2 hidden -translate-y-1/2 flex-col gap-6 xl:flex z-40">
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:border-primary transition-all cursor-pointer"
          title="Share page link"
        >
          <Share2 className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
        <button 
          onClick={() => {
            const elem = document.getElementById("comments-section");
            if (elem) elem.scrollIntoView({ behavior: "smooth" });
          }}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:border-primary transition-all cursor-pointer"
          title="Jump to conversation"
        >
          <MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
        <div className="h-10 w-px bg-slate-100 self-center"></div>
        <button 
          onClick={() => {
            if (typeof navigator !== "undefined") {
              navigator.clipboard.writeText(window.location.href);
              triggerToast("Story link copied to clipboard!");
            }
          }}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:border-primary transition-all cursor-pointer"
          title="Copy Link"
        >
          <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
      </aside>

      {/* Main Container */}
      <main className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-16 flex-grow">
        
        {/* Article Header */}
        <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {post.category && (
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              {post.category === "Fitness" ? "Wellbeing" : post.category}
            </span>
          )}
          
          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-slate-900">
            {post.title}
          </h1>

          <div className="mt-8 flex items-center gap-4 border-b border-slate-100 pb-8 w-full justify-center">
            <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                className="h-full w-full object-cover" 
                alt={authorInfo.name} 
                src={authorInfo.avatar}
              />
            </div>
            <div className="text-left">
              <p className="text-base font-bold text-slate-900 leading-none">{authorInfo.name}</p>
              <p className="mt-1 text-sm text-slate-500">{post.createdAt} • {post.readTime}</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {post.coverImage && (
          <figure className="mx-auto mt-12 max-w-[720px]">
            <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-xl shadow-slate-200/50">
              <ImageWithPlaceholder
                src={post.coverImage}
                alt={post.title}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
            </div>
            {post.slug === "the-hidden-gems-of-rwandas-countryside" && (
              <figcaption className="mt-4 text-center font-serif italic text-slate-500">
                The misty mornings over the Musanze valleys are unlike anything else in East Africa.
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body Content */}
        <article className="mx-auto mt-16 max-w-[680px] text-lg leading-[1.8] text-slate-700 font-serif">
          {post.content.trim().startsWith("<") || post.content.includes("</") ? (
            <div 
              className="wysiwyg-content text-slate-700 dark:text-slate-350"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          ) : (
            renderContentBlocks(post.content)
          )}

          {/* Author Bio Card */}
          <section className="mt-20 flex flex-col items-center rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm p-8 text-center sm:flex-row sm:text-left">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                className="h-full w-full object-cover" 
                alt={authorInfo.name} 
                src={authorInfo.avatar}
              />
            </div>
            <div className="mt-6 sm:ml-8 sm:mt-0">
              <h4 className="text-xl font-bold text-slate-900">About {authorInfo.name}</h4>
              <p className="mt-2 text-base text-slate-600">
                {authorInfo.bio}
              </p>
              <a className="mt-4 inline-block font-bold text-primary hover:underline" href="#">
                Follow {authorInfo.handle}
              </a>
            </div>
          </section>
        </article>

        {/* Recommended Articles ("You May Also Like") */}
        {recommended.length > 0 && (
          <section className="mx-auto mt-24 max-w-5xl border-t border-slate-100 pt-16">
            <h3 className="text-center font-serif text-3xl font-bold text-slate-900">You May Also Like</h3>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((rec) => (
                <Link key={rec.id} href={`/posts/${rec.slug}`} className="group cursor-pointer block">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-50 border border-slate-100 relative">
                    <ImageWithPlaceholder
                      src={rec.coverImage || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634"}
                      alt={rec.title}
                      containerClassName="w-full h-full animate-fadeIn"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">{rec.category}</p>
                  <h4 className="mt-2 font-serif text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                    {rec.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Conversation / Comments Section */}
        <section id="comments-section" className="mx-auto mt-24 max-w-[680px] pb-24 border-t border-slate-100 pt-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-3xl font-bold text-slate-900">Conversation</h3>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by</span>
              <select className="border-none bg-transparent text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none">
                <option>Best</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          {isSubmitted && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              Thank you! Your comment has been submitted and is awaiting moderation approval.
            </div>
          )}

          {/* Comment Composer */}
          <form 
            onSubmit={handlePostComment}
            className="comment-composer group mb-12 rounded-xl border border-slate-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <div className="flex gap-4">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <textarea 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onFocus={() => setCommentComposerFocused(true)}
                className="w-full resize-none border-none p-0 text-slate-700 placeholder-slate-400 focus:ring-0 outline-none text-sm" 
                placeholder="Join the conversation..." 
                rows={2}
              />
            </div>
            
            {(commentComposerFocused || newCommentText.length > 0) && (
              <div className="composer-toolbar mt-4 pt-4 border-t border-slate-100 flex flex-col gap-4 transition-all duration-300">
                {/* Name & Email inputs for anonymous comments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Your Name (required)"
                    className="bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary/25 focus:border-primary outline-none text-slate-700 font-semibold"
                  />
                  <input
                    type="email"
                    required
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    placeholder="Your Email (required, hidden)"
                    className="bg-slate-50 border border-slate-255 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary/25 focus:border-primary outline-none text-slate-700 font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-xs font-semibold hover:text-primary cursor-pointer">B</span>
                    <span className="text-xs font-semibold italic hover:text-primary cursor-pointer">I</span>
                    <span className="text-xs font-semibold hover:text-primary cursor-pointer">Link</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400">{newCommentText.length} / 500</span>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => { 
                          setNewCommentText(""); 
                          setCommentName("");
                          setCommentEmail("");
                          setCommentComposerFocused(false); 
                        }}
                        className="text-sm font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!newCommentText.trim() || !commentName.trim() || !commentEmail.trim()}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-8">
            {comments.map((comment) => {
              const isRootAuthor = isAuthor(comment.author, comment.email);
              return (
                <div key={comment.id} className="group">
                  <div className={`flex gap-4 p-4 rounded-xl transition-all ${
                    isRootAuthor 
                      ? "bg-sky-50/40 border border-sky-100 dark:bg-sky-950/10 dark:border-sky-900/20" 
                      : ""
                  }`}>
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        className="h-full w-full object-cover" 
                        alt={comment.author} 
                        src={comment.avatar}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-905 text-sm">{comment.author}</span>
                        {isRootAuthor && (
                          <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-primary tracking-wider">
                            Author
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-semibold">{comment.time}</span>
                      </div>
                      <p className="mt-2 text-slate-700 text-sm leading-relaxed">{comment.content}</p>
                      <div className="mt-4 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <button 
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> {comment.likes}
                        </button>
                        <button 
                          onClick={() => {
                            setReplyToCommentId(comment.id);
                            setReplyText("");
                            setReplyName("");
                            setReplyEmail("");
                          }}
                          className="hover:text-primary transition-colors cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Inline Reply Composer */}
                      {replyToCommentId === comment.id && (
                        <form 
                          onSubmit={(e) => handlePostReply(e, comment.id)}
                          className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/30 dark:border-slate-800 space-y-3"
                        >
                          <p className="text-xs font-bold text-slate-450 dark:text-slate-400">Replying to {comment.author}</p>
                          <textarea
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none resize-none text-slate-700 dark:text-slate-300"
                            rows={2}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              placeholder="Your Name (required)"
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 dark:text-slate-350 font-semibold"
                            />
                            <input
                              type="email"
                              required
                              value={replyEmail}
                              onChange={(e) => setReplyEmail(e.target.value)}
                              placeholder="Your Email (required, hidden)"
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 dark:text-slate-350 font-semibold"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyToCommentId(null);
                                setReplyText("");
                                setReplyName("");
                                setReplyEmail("");
                              }}
                              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={!replyText.trim() || !replyName.trim() || !replyEmail.trim()}
                              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-slate-900 rounded-lg px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Post Reply
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-6 relative pl-4 sm:pl-8">
                          {/* Thread line */}
                          <div className="absolute left-0 top-0 h-full w-px bg-slate-100 dark:bg-slate-800"></div>
                          
                          {comment.replies.map((reply) => {
                            const isReplyAuthor = isAuthor(reply.author, reply.email);
                            return (
                              <div 
                                key={reply.id} 
                                className={`rounded-xl p-4 mb-4 border transition-all ${
                                  isReplyAuthor 
                                    ? "bg-sky-50/70 border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/30" 
                                    : "bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800"
                                }`}
                              >
                                <div className="flex gap-4">
                                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-slate-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                      className="h-full w-full object-cover" 
                                      alt={reply.author} 
                                      src={reply.avatar}
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{reply.author}</span>
                                      {isReplyAuthor && (
                                        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-primary tracking-wider">
                                          Author
                                        </span>
                                      )}
                                      <span className="text-[10px] text-slate-400 font-semibold">{reply.time}</span>
                                    </div>
                                    <p className="mt-2 text-slate-700 dark:text-slate-355 text-xs leading-relaxed">{reply.content}</p>
                                    <div className="mt-3 flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                      <button 
                                        onClick={() => handleLikeComment(reply.id)}
                                        className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                                      >
                                        <ThumbsUp className="w-3 h-3" /> {reply.likes}
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setReplyToCommentId(comment.id);
                                          setReplyName("");
                                          setReplyEmail("");
                                          setReplyText("");
                                        }}
                                        className="hover:text-primary transition-colors cursor-pointer"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="group mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-4 text-sm font-bold text-slate-500 hover:border-primary hover:text-primary transition-all cursor-pointer">
            Load more comments
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-8 left-8 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold border border-slate-800 dark:border-slate-700 animate-fade-in-up">
          <CheckCircle className="w-4.5 h-4.5 text-primary" />
          {toast}
        </div>
      )}

      {/* Custom Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                Share this Story
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* X / Twitter */}
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all font-semibold text-xs text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <div className="size-8 rounded bg-black text-white flex items-center justify-center font-black">
                  X
                </div>
                <span>Share on X</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all font-semibold text-xs text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <div className="size-8 rounded bg-[#1877F2] text-white flex items-center justify-center">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1H13a5 5 0 0 0-5 5v2z"/>
                  </svg>
                </div>
                <span>Facebook</span>
              </a>

              {/* Instagram */}
              <button
                onClick={handleInstagramShare}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all font-semibold text-xs text-slate-700 dark:text-slate-350 cursor-pointer w-full text-left"
              >
                <div className="size-8 rounded bg-[#E1306C] text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span>Instagram</span>
              </button>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all font-semibold text-xs text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <div className="size-8 rounded bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Copy link option inside Share Drawer */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Copy Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-500 truncate outline-none select-all font-semibold"
                />
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      triggerToast("Link copied to clipboard!");
                      setIsShareModalOpen(false);
                    }
                  }}
                  className="bg-slate-905 dark:bg-white text-white dark:text-slate-900 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Instagram Fallback Modal */}
      {isInstagramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-105 dark:border-slate-800 p-6 space-y-4 animate-scale-in">
            <div className="space-y-2">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="size-6 rounded bg-[#E1306C] text-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </span>
                Link Copied for Instagram!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                The story link has been copied to your clipboard. Since Instagram does not support posting links directly from desktop browsers, you can now paste this link into your **Instagram Bio, Story, or Direct Message**.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsInstagramModalOpen(false)}
                className="w-1/2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                Close
              </button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsInstagramModalOpen(false)}
                className="w-1/2 bg-[#E1306C] text-white rounded-lg py-2 text-xs font-bold transition-all flex items-center justify-center cursor-pointer hover:opacity-90 text-center"
              >
                Open Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
