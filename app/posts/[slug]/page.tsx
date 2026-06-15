"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getPostBySlug, getPosts, Post } from "../../../lib/mockData";
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
  ChevronDown 
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

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
        avatar: "/profile.jpg",
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
  const [comments, setComments] = useState<Comment[]>(DEFAULT_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");
  const [recommended, setRecommended] = useState<Post[]>([]);
  const [commentComposerFocused, setCommentComposerFocused] = useState(false);

  useEffect(() => {
    const found = getPostBySlug(resolvedParams.slug);
    if (found) {
      setPost(found);
    }
    setMounted(true);
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (post) {
      const all = getPosts().filter(p => p.status === "published" && p.slug !== post.slug);
      let recs = all.filter(p => p.category === post.category);
      if (recs.length < 3) {
        const others = all.filter(p => p.category !== post.category);
        recs = [...recs, ...others];
      }
      setRecommended(recs.slice(0, 3));
    }
  }, [post]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f6f8f8] flex items-center justify-center">
        <div className="text-slate-400 font-medium">Loading article...</div>
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
          className="mt-2 bg-primary text-slate-950 px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const authorInfo = post.author === "Ariane Rugumaho" ? {
    name: "Ariane Rugumaho",
    avatar: "/profile.jpg",
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
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c-user-${Date.now()}`,
      author: "Guest Explorer",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCILgCbmO9BoZ92G-jMDt55p5rrjWEzCHEybwrHUFaadKeABiyJx-CV8PfeiZGAQSPQey_HKStW0YE7QtCocGyLkO33QA2Eb3tOPf2A3Ykq59390_y-f7a5703qvR6mIMqVYW0ubG85AsFASMx3ENhmQhmus0e248eRPYijWHE1ZC-ZfVjkKmZdTkJWaFCZewLfJb1QI2ilzZX3QnEDsZnqiHs7evHoaouTN6w85BsnH4OsJuA1pikvN89cj2Wck8OWb4__zvrgBg",
      content: newCommentText.trim(),
      time: "Just now",
      likes: 0
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
    setCommentComposerFocused(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(c => {
        if (c.id === commentId) {
          return { ...c, likes: c.likes + 1 };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r)
          };
        }
        return c;
      })
    );
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
      <Navbar />

      {/* Floating Left Sidebar Social Actions */}
      <aside className="fixed left-12 top-1/2 hidden -translate-y-1/2 flex-col gap-6 xl:flex z-40">
        <button 
          onClick={() => {
            if (typeof navigator !== "undefined") {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
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
        <button 
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:border-primary transition-all cursor-pointer"
          title="Bookmark story"
        >
          <Bookmark className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
        <div className="h-10 w-px bg-slate-100 self-center"></div>
        <button 
          onClick={() => {
            if (typeof navigator !== "undefined") {
              navigator.clipboard.writeText(window.location.href);
              alert("Story link copied!");
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
              {post.category}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                className="h-full w-full object-cover" 
                alt={post.title} 
                src={post.coverImage}
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
        <article className="mx-auto mt-16 max-w-[680px] text-lg leading-[1.8] text-slate-700">
          {renderContentBlocks(post.content)}

          {/* Author Bio Card */}
          <section className="mt-20 flex flex-col items-center rounded-xl bg-[#F0FBFF]/70 backdrop-blur-md border border-primary/20 shadow-sm shadow-primary/5 p-8 text-center sm:flex-row sm:text-left">
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={rec.title} 
                      src={rec.coverImage || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634"}
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

          {/* Comment Composer */}
          <form 
            onSubmit={handlePostComment}
            className="comment-composer group mb-12 rounded-xl border border-slate-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <div className="flex gap-4">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  className="h-full w-full object-cover" 
                  alt="Current user avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCILgCbmO9BoZ92G-jMDt55p5rrjWEzCHEybwrHUFaadKeABiyJx-CV8PfeiZGAQSPQey_HKStW0YE7QtCocGyLkO33QA2Eb3tOPf2A3Ykq59390_y-f7a5703qvR6mIMqVYW0ubG85AsFASMx3ENhmQhmus0e248eRPYijWHE1ZC-ZfVjkKmZdTkJWaFCZewLfJb1QI2ilzZX3QnEDsZnqiHs7evHoaouTN6w85BsnH4OsJuA1pikvN89cj2Wck8OWb4__zvrgBg"
                />
              </div>
              <textarea 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onFocus={() => setCommentComposerFocused(true)}
                className="w-full resize-none border-none p-0 text-slate-705 placeholder-slate-400 focus:ring-0 outline-none text-sm" 
                placeholder="Join the conversation..." 
                rows={2}
              />
            </div>
            
            {(commentComposerFocused || newCommentText.length > 0) && (
              <div className="composer-toolbar mt-4 flex items-center justify-between border-t border-slate-100 pt-4 transition-all duration-300">
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
                      onClick={() => { setNewCommentText(""); setCommentComposerFocused(false); }}
                      className="text-sm font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-slate-900 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="group">
                <div className="flex gap-4">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      className="h-full w-full object-cover" 
                      alt={comment.author} 
                      src={comment.avatar}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{comment.author}</span>
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
                      <button className="hover:text-primary transition-colors cursor-pointer">Reply</button>
                    </div>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-6 relative pl-4 sm:pl-8">
                        {/* Thread line */}
                        <div className="absolute left-0 top-0 h-full w-px bg-slate-100"></div>
                        
                        {comment.replies.map((reply) => {
                          const isAuthor = reply.author === authorInfo.name;
                          return (
                            <div 
                              key={reply.id} 
                              className={`rounded-xl p-4 mb-4 ${
                                isAuthor ? "bg-[#F0FBFF]" : "bg-slate-50"
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
                                    <span className="font-bold text-slate-900 text-xs">{reply.author}</span>
                                    {isAuthor && (
                                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-primary tracking-wider">
                                        Author
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-semibold">{reply.time}</span>
                                  </div>
                                  <p className="mt-2 text-slate-700 text-xs leading-relaxed">{reply.content}</p>
                                  <div className="mt-3 flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    <button 
                                      onClick={() => handleLikeComment(reply.id)}
                                      className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                                    >
                                      <ThumbsUp className="w-3 h-3" /> {reply.likes}
                                    </button>
                                    <button className="hover:text-primary transition-colors cursor-pointer">Reply</button>
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
            ))}
          </div>
          
          <button className="group mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-4 text-sm font-bold text-slate-500 hover:border-primary hover:text-primary transition-all cursor-pointer">
            Load more comments
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
